import { Handle, Position } from '@xyflow/react'
import styled from 'styled-components'

const THEME = {
  locked:      { border: '#1a2030', shadow: 'none',                           icon: '🔒', iconColor: '#2a3a55' },
  available:   { border: '#2a5aaa', shadow: '0 0 14px rgba(42,90,170,0.45)',  icon: '◆',  iconColor: '#5a90e8' },
  in_progress: { border: '#a06020', shadow: '0 0 14px rgba(160,96,32,0.45)', icon: '⚡', iconColor: '#d09040' },
  complete:    { border: '#1a8050', shadow: '0 0 14px rgba(26,128,80,0.45)', icon: '✓',  iconColor: '#40c080' },
}

const Box = styled.div`
  background: #0d0d1c;
  border: 1px solid ${p => p.$t.border};
  border-radius: 6px;
  padding: 10px 13px;
  min-width: 175px;
  max-width: 210px;
  box-shadow: ${p => p.$t.shadow};
  font-family: 'Courier New', Courier, monospace;
  cursor: pointer;
  transition: box-shadow 0.15s, border-color 0.15s;

  &:hover {
    border-color: ${p => p.$status === 'locked' ? '#232a3a' : p.$t.border};
    box-shadow: ${p => p.$status === 'locked'
      ? '0 0 8px rgba(30,42,60,0.3)'
      : p.$t.shadow.replace('0.45', '0.7')};
  }
`

const Row = styled.div`display: flex; align-items: center; gap: 7px; margin-bottom: 5px;`

const Icon = styled.span`
  font-size: 10px;
  flex-shrink: 0;
  color: ${p => p.$color};
`

const Title = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${p => p.$status === 'locked' ? '#2a3a55' : '#b0c4e0'};
  line-height: 1.25;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Meta = styled.div`display: flex; align-items: center; gap: 5px;`

const Hours = styled.span`font-size: 9px; color: #2a3a55; letter-spacing: 0.5px;`

const Badge = styled.span`
  border-radius: 3px;
  padding: 1px 5px;
  font-size: 8px;
  letter-spacing: 1px;

  ${p => p.$kind === 'MASTERED' && `
    background: #0a1e12; border: 1px solid #1a5030; color: #40c080;
  `}
  ${p => p.$kind === 'ACTIVE' && `
    background: #1e1008; border: 1px solid #50280a; color: #d09040;
  `}
  ${p => p.$kind === 'FORK' && `
    background: #0a1228; border: 1px solid #1a3060; color: #4a80d8;
  `}
`

const handleStyle = { background: '#1e2a3a', border: 'none', width: 5, height: 5 }

export default function SkillNode({ data }) {
  const t = THEME[data.status] || THEME.locked
  const statusBadge = data.status === 'complete' ? 'MASTERED'
    : data.status === 'in_progress' ? 'ACTIVE'
    : null

  return (
    <>
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <Box $t={t} $status={data.status}>
        <Row>
          <Icon $color={t.iconColor}>{t.icon}</Icon>
          <Title $status={data.status}>{data.title}</Title>
        </Row>
        <Meta>
          <Hours>{data.estimated_hours || 0}H</Hours>
          {statusBadge && <Badge $kind={statusBadge}>{statusBadge}</Badge>}
          {data.branch_label && <Badge $kind="FORK">FORK</Badge>}
        </Meta>
      </Box>
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
    </>
  )
}
