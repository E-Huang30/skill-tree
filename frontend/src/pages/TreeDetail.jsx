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

  const W = 80, H = 100, HG = 70, VG = 90
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

function toFlowEdges(edges, nodes) {
  const statusMap = {}
  nodes.forEach(n => { statusMap[n.id] = n.status })

  return edges.map(e => {
    const ts = statusMap[e.child_node_id] || 'locked'
    const color = ts === 'complete'    ? '#22c55e'
      : ts === 'in_progress'           ? '#f59e0b'
      : ts === 'available'             ? '#2563eb'
      : '#cbd5e1'
    const w = ts === 'locked' ? 1.5 : 2
    return {
      id: String(e.id),
      source: String(e.parent_node_id),
      target: String(e.child_node_id),
      type: 'smoothstep',
      animated: ts === 'in_progress',
      style: { stroke: color, strokeWidth: w }
    }
  })
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
  background: #ffffff;
  overflow: hidden;
`

const StatsBar = styled.div`
  height: 48px;
  min-height: 48px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 14px;
  flex-shrink: 0;
  overflow: hidden;
`

const Traj = styled.div`
  font-size: 11px;
  color: #64748b;
  letter-spacing: 0.3px;
  white-space: nowrap;
  flex-shrink: 0;
  font-weight: 500;
`

const TrajRole = styled.span`color: #2563eb; font-weight: 700;`

const Divider = styled.div`width: 1px; height: 18px; background: #e2e8f0; flex-shrink: 0;`

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`

const SVal = styled.div`font-size: 13px; font-weight: 800; color: #2563eb; line-height: 1;`
const SLbl = styled.div`font-size: 8px; color: #94a3b8; letter-spacing: 1px; margin-top: 2px; text-transform: uppercase;`

const Spacer = styled.div`flex: 1;`

const PivotBtn = styled.button`
  background: #f8faff;
  border: 1.5px solid #bfdbfe;
  border-radius: 6px;
  color: #2563eb;
  font-family: inherit;
  font-size: 11px;
  font-weight: 600;
  padding: 6px 14px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.12s;
  &:hover { background: #eff6ff; border-color: #93c5fd; }
`

const Body = styled.div`flex: 1; display: flex; overflow: hidden;`

const FlowArea = styled.div`flex: 1; position: relative;`

const Legend = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  display: flex;
  gap: 8px;
  z-index: 5;
  pointer-events: none;
`

const LegendChip = styled.div`
  background: rgba(255,255,255,0.92);
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 10px;
  color: #64748b;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
`

const Loading = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #94a3b8;
  letter-spacing: 1px;
  background: #ffffff;
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
        const fe = toFlowEdges(data.edges, data.nodes)
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
      // Backend auto-unlocks children — refetch so newly available nodes light up
      try {
        const freshTree = await getTree(id)
        const freshMap = {}
        freshTree.nodes.forEach(n => { freshMap[String(n.id)] = n })
        // Keep positions, update data for every node
        setNodes(prev => prev.map(n => ({ ...n, data: freshMap[n.id] ?? n.data })))
        setEdges(toFlowEdges(freshTree.edges, freshTree.nodes))
        setSelectedNode(freshMap[String(updatedNode.id)] ?? updatedNode)
        setStats(computeStats(freshTree.nodes))
        return
      } catch { /* fall through */ }
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
            fitViewOptions={{ padding: 0.3 }}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#e2e8f0" gap={24} size={1} />
            <Controls
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              }}
            />
          </ReactFlow>
          <Legend>
            <LegendChip><span style={{color:'#2563eb'}}>●</span> Click a blue node to begin</LegendChip>
            <LegendChip><span style={{color:'#22c55e'}}>●</span> Green = complete</LegendChip>
            <LegendChip><span style={{color:'#cbd5e1'}}>●</span> Gray = locked</LegendChip>
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
