import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import styled from 'styled-components'
import { getTree, getTreeBudget } from '../api/trees'
import SkillNode from '../components/SkillNode'
import NodeDetailDrawer from '../components/NodeDetailDrawer'

const nodeTypes = { skillNode: SkillNode }

const Page = styled.div`height: calc(100vh - 56px); display: flex; flex-direction: column;`
const TopBar = styled.div`
  background: #1a1a2e; border-bottom: 1px solid #2a2a3e;
  padding: 0 24px; height: 52px;
  display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
`
const Left = styled.div`display: flex; align-items: center; gap: 8px;`
const BackButton = styled.button`
  background: transparent; border: none; color: #666; cursor: pointer; font-size: 13px;
  &:hover { color: #f0f0f0; }
`
const TreeTitle = styled.h2`font-size: 16px; font-weight: 600;`
const BudgetChip = styled.div`
  background: #0f0f23; border: 1px solid #2a2a3e; border-radius: 20px;
  padding: 4px 14px; font-size: 12px; color: #888;
`
const GraphWrapper = styled.div`flex: 1; position: relative;`

function toFlowNodes(nodes) {
  return nodes.map(n => ({
    id: String(n.id),
    type: 'skillNode',
    position: { x: n.position_x, y: n.position_y },
    data: n
  }))
}

function toFlowEdges(edges) {
  return edges.map(e => ({
    id: String(e.id),
    source: String(e.parent_node_id),
    target: String(e.child_node_id),
    animated: e.edge_type === 'optional',
    style: { stroke: '#2a2a3e' }
  }))
}

export default function TreeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tree, setTree] = useState(null)
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [budget, setBudget] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)

  useEffect(() => {
    getTree(id)
      .then(data => {
        setTree(data)
        setNodes(toFlowNodes(data.nodes))
        setEdges(toFlowEdges(data.edges))
      })
      .catch(console.error)
    getTreeBudget(id).then(setBudget).catch(() => {})
  }, [id])

  const handleNodeClick = useCallback((_, node) => {
    setSelectedNode(node.data)
  }, [])

  function handleNodeSaved(updatedNode) {
    setNodes(prev =>
      prev.map(n => n.id === String(updatedNode.id) ? { ...n, data: updatedNode } : n)
    )
    setSelectedNode(updatedNode)
  }

  if (!tree) return null

  return (
    <Page>
      <TopBar>
        <Left>
          <BackButton onClick={() => navigate('/')}>← Back</BackButton>
          <TreeTitle>{tree.title}</TreeTitle>
        </Left>
        {budget && (
          <BudgetChip>
            ~{budget.estimated_weeks}w · {budget.remaining_hours}h remaining
          </BudgetChip>
        )}
      </TopBar>
      <GraphWrapper>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
        >
          <Background color="#2a2a3e" gap={20} />
          <Controls />
          <MiniMap
            nodeColor={n => {
              const colors = {
                locked: '#6B7280',
                available: '#3B82F6',
                in_progress: '#F59E0B',
                complete: '#10B981'
              }
              return colors[n.data?.status] || '#6B7280'
            }}
            style={{ background: '#1a1a2e', border: '1px solid #2a2a3e' }}
          />
        </ReactFlow>
        {selectedNode && (
          <NodeDetailDrawer
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onSaved={handleNodeSaved}
          />
        )}
      </GraphWrapper>
    </Page>
  )
}
