import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { ReactFlow, Background, Controls } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import styled from 'styled-components'
import { getTree, getTreeBudget } from '../api/trees'
import { useTheme } from '../context/ThemeContext'
import SkillNode from '../components/SkillNode'
import NodeDetailDrawer from '../components/NodeDetailDrawer'
import PivotSimulatorModal from '../components/PivotSimulatorModal'

const nodeTypes = { skillNode: SkillNode }

const BRANCH_PALETTE = [
  '#4ade80', // green
  '#fbbf24', // yellow
  '#f87171', // red
  '#60a5fa', // blue
  '#a78bfa', // purple
  '#fb923c', // orange
  '#34d399', // teal
  '#f472b6', // pink
]

function assignBranchColors(rawNodes, rawEdges) {
  const children = {}
  const hasParent = new Set()
  rawNodes.forEach(n => { children[String(n.id)] = [] })
  rawEdges.forEach(e => {
    const src = String(e.parent_node_id)
    const tgt = String(e.child_node_id)
    if (!children[src]) children[src] = []
    children[src].push(tgt)
    hasParent.add(tgt)
  })

  const rootIds = rawNodes
    .filter(n => !hasParent.has(String(n.id)))
    .map(n => String(n.id))
  if (rootIds.length === 0 && rawNodes.length > 0) rootIds.push(String(rawNodes[0].id))

  const colorMap = {}
  rootIds.forEach((id, i) => {
    colorMap[id] = BRANCH_PALETTE[i % BRANCH_PALETTE.length]
  })

  // BFS: propagate each root's color down to all descendants
  const queue = [...rootIds]
  while (queue.length) {
    const curr = queue.shift()
    ;(children[curr] || []).forEach(child => {
      if (!colorMap[child]) {
        colorMap[child] = colorMap[curr]
        queue.push(child)
      }
    })
  }

  return { colorMap, rootIds }
}

// Hierarchical layout — roots at bottom, leaves at top
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

  // BFS to assign levels (roots = level 0)
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

  const maxLevel = Math.max(...Object.values(level))

  const byLevel = {}
  flowNodes.forEach(n => {
    const l = level[n.id]
    if (!byLevel[l]) byLevel[l] = []
    byLevel[l].push(n.id)
  })

  // W = node width, H = node height, HG = horizontal gap, VG = vertical gap
  const W = 110, H = 90, HG = 50, VG = 110
  const positions = {}
  Object.entries(byLevel).forEach(([l, ids]) => {
    const total = ids.length * W + (ids.length - 1) * HG
    // invert: roots (level 0) sit at the bottom (largest y)
    const y = (maxLevel - parseInt(l)) * (H + VG)
    ids.forEach((id, i) => {
      positions[id] = {
        x: -total / 2 + i * (W + HG),
        y,
      }
    })
  })

  return flowNodes.map(n => ({ ...n, position: positions[n.id] || n.position }))
}

function toFlowNodes(nodes, colorMap, rootSet) {
  return nodes.map(n => ({
    id: String(n.id),
    type: 'skillNode',
    position: { x: n.position_x ?? 0, y: n.position_y ?? 0 },
    data: {
      ...n,
      branchColor: colorMap[String(n.id)] || '#5a90e8',
      isRoot: rootSet.has(String(n.id)),
    },
  }))
}

function toFlowEdges(edges, colorMap) {
  return edges.map(e => {
    const color = colorMap[String(e.parent_node_id)] || '#1e2a3a'
    return {
      id: String(e.id),
      source: String(e.parent_node_id),
      target: String(e.child_node_id),
      type: 'bezier',
      animated: e.edge_type === 'optional',
      style: { stroke: color, strokeWidth: 2, opacity: 0.55 },
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
  background: var(--bg);
  overflow: hidden;
`

const StatsBar = styled.div`
  height: 46px;
  min-height: 46px;
  background: var(--panel);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 14px;
  flex-shrink: 0;
  overflow: hidden;
`

const Traj = styled.div`
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 1px;
  white-space: nowrap;
  flex-shrink: 0;
`

const TrajRole = styled.span`color: var(--accent); font-weight: 700;`

const Divider = styled.div`width: 1px; height: 18px; background: var(--border); flex-shrink: 0;`

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`

const SVal = styled.div`font-size: 12px; font-weight: 700; color: var(--accent); line-height: 1;`
const SLbl = styled.div`font-size: 7px; color: var(--muted); letter-spacing: 1.5px; margin-top: 2px;`

const Spacer = styled.div`flex: 1;`

const PivotBtn = styled.button`
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--muted);
  font-family: inherit;
  font-size: 9px;
  padding: 5px 10px;
  cursor: pointer;
  letter-spacing: 1px;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.12s;
  &:hover { background: var(--card); border-color: var(--accent); color: var(--accent); }
`

const Body = styled.div`flex: 1; display: flex; overflow: hidden;`

const FlowArea = styled.div`flex: 1; position: relative;`

const Loading = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 2px;
  background: var(--bg);
`

// ── Component ──────────────────────────────────────────────────────────────────

export default function TreeDetail() {
  const { id } = useParams()
  const { isDark } = useTheme()
  const [tree, setTree]               = useState(null)
  const [nodes, setNodes]             = useState([])
  const [edges, setEdges]             = useState([])
  const [budget, setBudget]           = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [stats, setStats]             = useState({ totalHours: 0, mappedPct: 0 })
  const [showPivot, setShowPivot]     = useState(false)

  const colorMapRef = useRef({})
  const rootSetRef  = useRef(new Set())

  useEffect(() => {
    setTree(null)
    setSelectedNode(null)
    getTree(id)
      .then(data => {
        setTree(data)
        const { colorMap, rootIds } = assignBranchColors(data.nodes, data.edges)
        colorMapRef.current = colorMap
        rootSetRef.current  = new Set(rootIds)
        const fe = toFlowEdges(data.edges, colorMap)
        const fn = autoLayout(toFlowNodes(data.nodes, colorMap, rootSetRef.current), fe)
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
      try {
        const freshTree = await getTree(id)
        const freshMap  = {}
        freshTree.nodes.forEach(n => { freshMap[String(n.id)] = n })

        // Preserve visual data (branchColor, isRoot) in updated node list
        setNodes(prev => prev.map(n => {
          const fresh = freshMap[n.id]
          if (!fresh) return n
          return {
            ...n,
            data: {
              ...fresh,
              branchColor: n.data.branchColor,
              isRoot:      n.data.isRoot,
            },
          }
        }))

        // Auto-select the first newly-available child node
        const completedId = String(updatedNode.id)
        const nextNode = edges
          .filter(e => e.source === completedId)
          .map(e => freshMap[e.target])
          .find(n => n?.status === 'available')

        if (nextNode) {
          setSelectedNode({
            ...nextNode,
            branchColor: colorMapRef.current[String(nextNode.id)] || '#5a90e8',
            isRoot: rootSetRef.current.has(String(nextNode.id)),
          })
        } else {
          const fresh = freshMap[String(updatedNode.id)]
          setSelectedNode(fresh
            ? { ...fresh, branchColor: colorMapRef.current[String(fresh.id)] || '#5a90e8', isRoot: rootSetRef.current.has(String(fresh.id)) }
            : updatedNode
          )
        }

        setStats(computeStats(freshTree.nodes))
        return
      } catch {
        // fall through to local update
      }
    }

    setNodes(prev =>
      prev.map(n => n.id === String(updatedNode.id)
        ? { ...n, data: { ...updatedNode, branchColor: n.data.branchColor, isRoot: n.data.isRoot } }
        : n
      )
    )
    setSelectedNode({
      ...updatedNode,
      branchColor: colorMapRef.current[String(updatedNode.id)] || '#5a90e8',
      isRoot: rootSetRef.current.has(String(updatedNode.id)),
    })
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
        <PivotBtn onClick={() => setShowPivot(true)}>PIVOT SIMULATOR</PivotBtn>
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
            <Background variant="dots" color={isDark ? '#1a1a2e' : '#c0c8e0'} gap={28} size={1} />
            <Controls
              style={{
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                borderRadius: 5,
              }}
            />
          </ReactFlow>
        </FlowArea>
      </Body>

      {/* Floating modals — rendered outside Body so FlowArea fills full width */}
      <NodeDetailDrawer
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onSaved={handleNodeSaved}
      />

      {showPivot && (
        <PivotSimulatorModal treeId={id} onClose={() => setShowPivot(false)} />
      )}
    </Page>
  )
}
