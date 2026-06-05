import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { ReactFlow, Background, Controls } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import styled from 'styled-components'
import { getTree, getTreeBudget } from '../api/trees'
import SkillNode from '../components/SkillNode'
import NodeDetailDrawer from '../components/NodeDetailDrawer'

const nodeTypes = { skillNode: SkillNode }

// Compute hierarchical layout when nodes have no meaningful positions
function autoLayout(flowNodes, flowEdges) {
  if (flowNodes.length === 0) return flowNodes

  const allZero = flowNodes.every(
    n => (n.position.x == null || n.position.x === 0) &&
         (n.position.y == null || n.position.y === 0)
  )
  if (!allZero) return flowNodes

  const children = {}
  const hasParent = new Set()
  flowNodes.forEach(n => { children[n.id] = [] })
  flowEdges.forEach(e => {
    if (children[e.source]) children[e.source].push(e.target)
    hasParent.add(e.target)
  })

  const roots = flowNodes.filter(n => !hasParent.has(n.id)).map(n => n.id)
  if (roots.length === 0) roots.push(flowNodes[0].id)

  const level = {}
  const queue = [...roots]
  roots.forEach(r => { level[r] = 0 })
  while (queue.length) {
    const curr = queue.shift()
    ;(children[curr] || []).forEach(child => {
      if (level[child] === undefined) {
        level[child] = level[curr] + 1
        queue.push(child)
      }
    })
  }
  flowNodes.forEach(n => { if (level[n.id] === undefined) level[n.id] = 0 })

  const byLevel = {}
  flowNodes.forEach(n => {
    const l = level[n.id]
    if (!byLevel[l]) byLevel[l] = []
    byLevel[l].push(n.id)
  })

  const W = 210, H = 80, HG = 80, VG = 120
  const positions = {}
  Object.entries(byLevel).forEach(([l, ids]) => {
    const total = ids.length * W + (ids.length - 1) * HG
    ids.forEach((id, i) => {
      positions[id] = {
        x: -total / 2 + i * (W + HG),
        y: parseInt(l) * (H + VG)
      }
    })
  })

  return flowNodes.map(n => ({ ...n, position: positions[n.id] || n.position }))
}

function toFlowNodes(nodes) {
  return nodes.map(n => ({
    id: String(n.id),
    type: 'skillNode',
    position: { x: n.position_x ?? 0, y: n.position_y ?? 0 },
    data: n
  }))
}

function toFlowEdges(edges) {
  return edges.map(e => ({
    id: String(e.id),
    source: String(e.parent_node_id),
    target: String(e.child_node_id),
    type: 'smoothstep',
    animated: e.edge_type === 'optional',
    style: { stroke: '#1e2a3a', strokeWidth: 1.5 }
  }))
}

function computeStats(nodes) {
  if (!nodes?.length) return { totalHours: 0, mappedPct: 0 }
  const totalHours = nodes.reduce((s, n) => s + (n.estimated_hours || 0), 0)
  const done = nodes.filter(n => n.status === 'complete' || n.status === 'in_progress').length
  return { totalHours, mappedPct: Math.round((done / nodes.length) * 100) }
}

// ── Styled components ──────────────────────────────────────────────────────────

const Page = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #080812;
  overflow: hidden;
`

const StatsBar = styled.div`
  height: 46px;
  min-height: 46px;
  background: #0b0b18;
  border-bottom: 1px solid #141424;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 14px;
  flex-shrink: 0;
  overflow: hidden;
`

const Traj = styled.div`
  font-size: 10px;
  color: #2a4070;
  letter-spacing: 1px;
  white-space: nowrap;
  flex-shrink: 0;
`

const TrajRole = styled.span`color: #5a90e8; font-weight: 700;`

const Divider = styled.div`width: 1px; height: 18px; background: #141424; flex-shrink: 0;`

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`

const SVal = styled.div`font-size: 12px; font-weight: 700; color: #5a90e8; line-height: 1;`
const SLbl = styled.div`font-size: 7px; color: #2a3a55; letter-spacing: 1.5px; margin-top: 2px;`

const Spacer = styled.div`flex: 1;`

const PivotBtn = styled.button`
  background: transparent;
  border: 1px solid #141e30;
  border-radius: 4px;
  color: #2a4070;
  font-family: inherit;
  font-size: 9px;
  padding: 5px 10px;
  cursor: pointer;
  letter-spacing: 1px;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.12s;
  &:hover { background: #0e1628; border-color: #1e3560; color: #5a80c0; }
`

const Body = styled.div`flex: 1; display: flex; overflow: hidden;`

const FlowArea = styled.div`flex: 1; position: relative;`

const Legend = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: flex;
  gap: 5px;
  z-index: 5;
  pointer-events: none;
`

const LegendChip = styled.div`
  background: rgba(8,8,18,0.88);
  border: 1px solid #141424;
  border-radius: 3px;
  padding: 3px 7px;
  font-size: 8px;
  color: #2a3a55;
  letter-spacing: 0.8px;
`

const Loading = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #2a3a55;
  letter-spacing: 2px;
  background: #080812;
`

// ── Component ──────────────────────────────────────────────────────────────────

export default function TreeDetail() {
  const { id } = useParams()
  const [tree, setTree] = useState(null)
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [budget, setBudget] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [stats, setStats] = useState({ totalHours: 0, mappedPct: 0 })

  useEffect(() => {
    setTree(null)
    setSelectedNode(null)
    getTree(id)
      .then(data => {
        setTree(data)
        const fe = toFlowEdges(data.edges)
        const fn = autoLayout(toFlowNodes(data.nodes), fe)
        setNodes(fn)
        setEdges(fe)
        setStats(computeStats(data.nodes))
      })
      .catch(console.error)
    getTreeBudget(id).then(setBudget).catch(() => {})
  }, [id])

  const handleNodeClick = useCallback((_, node) => {
    setSelectedNode(node.data)
  }, [])

  async function handleNodeSaved(updatedNode) {
    if (updatedNode.status === 'complete') {
      // Backend auto-unlocks children — refetch to get updated statuses
      try {
        const freshTree = await getTree(id)
        const freshMap = {}
        freshTree.nodes.forEach(n => { freshMap[String(n.id)] = n })
        // Preserve positions from current layout, update data only
        setNodes(prev => prev.map(n => ({ ...n, data: freshMap[n.id] ?? n.data })))
        setSelectedNode(freshMap[String(updatedNode.id)] ?? updatedNode)
        setStats(computeStats(freshTree.nodes))
        return
      } catch {
        // fall through to local update
      }
    }
    setNodes(prev =>
      prev.map(n => n.id === String(updatedNode.id) ? { ...n, data: updatedNode } : n)
    )
    setSelectedNode(updatedNode)
    setStats(computeStats(
      nodes.map(n => n.id === String(updatedNode.id) ? updatedNode : n.data)
    ))
  }

  if (!tree) return <Loading>LOADING...</Loading>

  return (
    <Page>
      <StatsBar>
        <Traj>ACTIVE TRAJECTORY · <TrajRole>{tree.target_role}</TrajRole></Traj>
        <Divider />
        <Stat>
          <SVal>{stats.totalHours}h</SVal>
          <SLbl>TOTAL</SLbl>
        </Stat>
        <Divider />
        <Stat>
          <SVal>{stats.mappedPct}%</SVal>
          <SLbl>MAPPED</SLbl>
        </Stat>
        {budget && (
          <>
            <Divider />
            <Stat>
              <SVal>{budget.remaining_hours}h</SVal>
              <SLbl>REMAIN</SLbl>
            </Stat>
            <Divider />
            <Stat>
              <SVal>{budget.estimated_weeks}w</SVal>
              <SLbl>EST.</SLbl>
            </Stat>
          </>
        )}
        <Spacer />
        <PivotBtn>PIVOT SIMULATOR</PivotBtn>
      </StatsBar>

      <Body>
        <FlowArea>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={handleNodeClick}
            fitView
            fitViewOptions={{ padding: 0.25 }}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#141424" gap={22} size={1} />
            <Controls
              style={{
                background: '#0b0b18',
                border: '1px solid #141424',
                borderRadius: 5,
              }}
            />
          </ReactFlow>
          <Legend>
            <LegendChip>CLICK LIT NODE TO UNLOCK</LegendChip>
            <LegendChip>◇ = COSTS SP</LegendChip>
            <LegendChip>⚡ GOLD = FREE</LegendChip>
          </Legend>
        </FlowArea>

        <NodeDetailDrawer
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onSaved={handleNodeSaved}
        />
      </Body>
    </Page>
  )
}
