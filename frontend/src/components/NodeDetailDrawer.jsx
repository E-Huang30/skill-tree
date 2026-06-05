import { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { updateNode } from '../api/nodes'

const fadeIn  = keyframes`from{opacity:0}to{opacity:1}`
const slideUp = keyframes`
  from { opacity: 0; transform: translateY(28px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
`

const STATUSES = [
  { value: 'locked',      label: 'Locked',      color: '#4a5568', bg: 'transparent' },
  { value: 'available',   label: 'Available',   color: '#60a5fa', bg: '#0a1628'     },
  { value: 'in_progress', label: 'In Progress', color: '#fbbf24', bg: '#1a1008'     },
  { value: 'complete',    label: 'Complete',    color: '#4ade80', bg: '#0a1e12'     },
]

const TYPE_ICON  = { course: '◈', video: '▶', article: '◉', book: '□' }
const TYPE_LABEL = { course: 'Course', video: 'Video', article: 'Article', book: 'Book' }

export default function NodeDetailDrawer({ node, onClose, onSaved }) {
  const [status, setStatus] = useState('locked')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (node) setStatus(node.status)
  }, [node?.id])

  if (!node) return null

  const branchColor    = node.branchColor || '#60a5fa'
  const currentStatus  = STATUSES.find(s => s.value === node.status) || STATUSES[0]
  const isDirty        = status !== node.status

  async function handleSave() {
    setSaving(true)
    try {
      const updated = await updateNode(node.id, { status })
      onSaved(updated)
      if (status === 'complete') onClose()
    } finally {
      setSaving(false)
    }
  }

  const firstResource = node.resources?.[0]

  return (
    <Overlay onClick={onClose}>
      <Card onClick={e => e.stopPropagation()}>
        <Stripe $c={branchColor} />

        <Scroll>
          {/* Header row */}
          <TopRow>
            <BadgeRow>
              {node.branch_label && (
                <BranchBadge $c={branchColor}>{node.branch_label}</BranchBadge>
              )}
              <StatusBadge $c={currentStatus.color} $bg={currentStatus.bg}>
                <Dot $c={currentStatus.color} /> {currentStatus.label}
              </StatusBadge>
            </BadgeRow>
            <CloseBtn onClick={onClose}>✕</CloseBtn>
          </TopRow>

          {/* Title */}
          <Title>{node.title}</Title>
          {node.estimated_hours > 0 && (
            <HoursPill>{node.estimated_hours}h estimated</HoursPill>
          )}

          {/* Description */}
          {node.description && <Desc>{node.description}</Desc>}

          {/* Start Here hero — only when available + has url */}
          {node.status === 'available' && firstResource?.url && (
            <StartHero href={firstResource.url} target="_blank" rel="noopener noreferrer" $c={branchColor}>
              <StartLeft>
                <StartBadge $c={branchColor}>▶ START HERE</StartBadge>
                <StartName>{firstResource.title}</StartName>
                <StartType>{TYPE_LABEL[firstResource.type] || 'Resource'}</StartType>
              </StartLeft>
              <Arrow $c={branchColor}>→</Arrow>
            </StartHero>
          )}

          {/* Resources */}
          {node.resources?.length > 0 && (
            <Section>
              <SectionLabel>RESOURCES</SectionLabel>
              <ResGrid>
                {node.resources.map((r, i) => {
                  const icon   = TYPE_ICON[r.type] || '◆'
                  const hasUrl = r.url?.trim()
                  const Tag    = hasUrl ? ResLink : ResCard
                  return (
                    <Tag key={i} href={hasUrl || undefined} target={hasUrl ? '_blank' : undefined} rel="noopener noreferrer">
                      <ResIcon>{icon}</ResIcon>
                      <ResBody>
                        <ResName>{r.title}</ResName>
                        <ResKind>{(r.type || 'resource').toUpperCase()}</ResKind>
                      </ResBody>
                      {hasUrl && <ResArr>→</ResArr>}
                    </Tag>
                  )
                })}
              </ResGrid>
            </Section>
          )}

          {/* Status picker */}
          <Section>
            <SectionLabel>SET STATUS</SectionLabel>
            <PillRow>
              {STATUSES.map(s => (
                <Pill key={s.value} $active={status === s.value} $c={s.color} onClick={() => setStatus(s.value)}>
                  <PillDot $c={s.color} $active={status === s.value} />
                  {s.label}
                </Pill>
              ))}
            </PillRow>
          </Section>
        </Scroll>

        <Footer>
          <SaveBtn onClick={handleSave} disabled={saving || !isDirty} $c={branchColor} $complete={status === 'complete'}>
            {saving ? 'Saving…'
              : status === 'complete' ? '★  Mark Complete'
              : 'Save Changes'}
          </SaveBtn>
        </Footer>
      </Card>
    </Overlay>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  z-index: 50;
  animation: ${fadeIn} 0.15s ease both;
`

const Card = styled.div`
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 20px;
  width: 540px;
  max-height: 82vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0,0,0,0.55);
  animation: ${slideUp} 0.22s cubic-bezier(0.16, 1, 0.3, 1) both;
`

const Stripe = styled.div`
  height: 4px;
  background: ${p => p.$c};
  flex-shrink: 0;
`

const Scroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 22px 24px 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
`

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`

const BadgeRow = styled.div`display: flex; gap: 7px; flex-wrap: wrap;`

const BranchBadge = styled.div`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: ${p => p.$c};
  border: 1px solid ${p => p.$c}55;
  border-radius: 20px;
  padding: 3px 10px;
  font-family: 'Courier New', monospace;
`

const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
  color: ${p => p.$c};
  background: ${p => p.$bg};
  border: 1px solid ${p => p.$c}44;
  border-radius: 20px;
  padding: 3px 10px;
  font-family: 'Courier New', monospace;
`

const Dot = styled.div`
  width: 6px; height: 6px;
  border-radius: 50%;
  background: ${p => p.$c};
  flex-shrink: 0;
`

const CloseBtn = styled.button`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 50%;
  width: 28px; height: 28px;
  cursor: pointer;
  color: var(--muted);
  font-size: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: all 0.12s;
  &:hover { color: var(--text); border-color: var(--border2); }
`

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.25;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
`

const HoursPill = styled.div`
  display: inline-block;
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 0.5px;
  font-family: 'Courier New', monospace;
  margin-top: -8px;
`

const Desc = styled.p`
  font-size: 13px;
  color: var(--text2);
  line-height: 1.7;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
`

const StartHero = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${p => p.$c}12;
  border: 1.5px solid ${p => p.$c}40;
  border-radius: 12px;
  padding: 14px 16px;
  text-decoration: none;
  transition: all 0.15s;
  cursor: pointer;
  &:hover { background: ${p => p.$c}20; border-color: ${p => p.$c}70; }
`

const StartLeft = styled.div`flex: 1; min-width: 0;`

const StartBadge = styled.div`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
  color: ${p => p.$c};
  margin-bottom: 4px;
  font-family: 'Courier New', monospace;
`

const StartName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
`

const StartType = styled.div`
  font-size: 10px;
  color: var(--muted);
  margin-top: 2px;
  font-family: 'Courier New', monospace;
`

const Arrow = styled.div`
  font-size: 18px;
  color: ${p => p.$c};
  flex-shrink: 0;
`

const Section = styled.div`display: flex; flex-direction: column; gap: 10px;`

const SectionLabel = styled.div`
  font-size: 9px;
  font-weight: 700;
  color: var(--muted);
  letter-spacing: 2.5px;
  font-family: 'Courier New', monospace;
`

const ResGrid = styled.div`display: flex; flex-direction: column; gap: 7px;`

const resBase = `
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--card);
  transition: all 0.12s;
`

const ResLink = styled.a`
  ${resBase}
  text-decoration: none;
  cursor: pointer;
  &:hover { border-color: var(--border2); background: var(--panel); }
`

const ResCard = styled.div`${resBase}`

const ResIcon = styled.div`
  font-size: 16px;
  color: var(--accent);
  flex-shrink: 0;
  width: 20px;
  text-align: center;
`

const ResBody = styled.div`flex: 1; min-width: 0;`

const ResName = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
`

const ResKind = styled.div`
  font-size: 9px;
  color: var(--muted);
  letter-spacing: 1px;
  margin-top: 2px;
  font-family: 'Courier New', monospace;
`

const ResArr = styled.div`
  color: var(--muted);
  font-size: 14px;
  flex-shrink: 0;
`

const PillRow = styled.div`display: flex; gap: 7px; flex-wrap: wrap;`

const Pill = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 30px;
  border: 1.5px solid ${p => p.$active ? p.$c : 'var(--border)'};
  background: ${p => p.$active ? `${p.$c}18` : 'transparent'};
  color: ${p => p.$active ? p.$c : 'var(--muted)'};
  font-size: 11px;
  font-weight: ${p => p.$active ? 700 : 400};
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  transition: all 0.12s;
  &:hover { border-color: ${p => p.$c}; color: ${p => p.$c}; }
`

const PillDot = styled.div`
  width: 7px; height: 7px;
  border-radius: 50%;
  background: ${p => p.$active ? p.$c : 'var(--border)'};
  flex-shrink: 0;
  transition: background 0.12s;
`

const Footer = styled.div`
  padding: 16px 24px 22px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
`

const SaveBtn = styled.button`
  width: 100%;
  padding: 13px;
  border-radius: 12px;
  border: none;
  background: ${p => p.disabled ? 'var(--border)' : p.$complete ? '#0a1e12' : p.$c};
  color: ${p => p.disabled ? 'var(--muted)' : p.$complete ? '#4ade80' : '#000'};
  border: 1.5px solid ${p => p.disabled ? 'var(--border)' : p.$complete ? '#4ade80' : p.$c};
  font-size: 13px;
  font-weight: 700;
  cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
  letter-spacing: 0.5px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  transition: all 0.15s;
  &:hover:not(:disabled) {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }
  &:active:not(:disabled) { transform: translateY(0); }
`
