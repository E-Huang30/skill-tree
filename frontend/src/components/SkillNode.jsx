import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import styled from 'styled-components'

const STATUS_COLORS = {
  locked: '#6B7280',
  available: '#3B82F6',
  in_progress: '#F59E0B',
  complete: '#10B981'
}

const NodeBox = styled.div`
  background: #1a1a2e;
  border: 2px solid ${p => STATUS_COLORS[p.$status] || '#6B7280'};
  border-radius: 10px;
  padding: 12px 16px;
  min-width: 160px;
  max-width: 220px;
  cursor: pointer;
  box-shadow: 0 0 12px ${p => STATUS_COLORS[p.$status] || '#6B7280'}44;
`
const NodeTitle = styled.div`
  font-size: 13px; font-weight: 600; color: #f0f0f0; margin-bottom: 4px;
`
const NodeMeta = styled.div`
  font-size: 11px; color: #888; display: flex; align-items: center; gap: 4px;
`
const StatusDot = styled.div`
  width: 7px; height: 7px; border-radius: 50%;
  background: ${p => STATUS_COLORS[p.$status] || '#6B7280'};
  flex-shrink: 0;
`

function SkillNode({ data, selected }) {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <NodeBox $status={data.status} style={selected ? { outline: '2px solid #fff' } : {}}>
        <NodeTitle>{data.title}</NodeTitle>
        <NodeMeta>
          <StatusDot $status={data.status} />
          {data.status.replace('_', ' ')} · {data.estimated_hours}h
        </NodeMeta>
      </NodeBox>
      <Handle type="source" position={Position.Bottom} />
    </>
  )
}

export default memo(SkillNode)
