import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { updateNode } from '../api/nodes'

// ── Styled components ──────────────────────────────────────────────────────────

const Panel = styled.div`
  width: 272px;
  min-width: 272px;
  background: var(--panel);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  font-family: 'Courier New', Courier, monospace;
  overflow: hidden;
`

const Header = styled.div`
  padding: 13px 16px;
  border-bottom: 1px solid var(--border);
  font-size: 9px;
  color: var(--muted);
  letter-spacing: 2.5px;
  flex-shrink: 0;
`

const Scroll = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: var(--border); }
`

// ── Empty state ───────────────────────────────────────────────────────────────

const EmptyWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  gap: 20px;
`

const EmptyMsg = styled.div`
  font-size: 9px;
  color: var(--dim);
  letter-spacing: 1.5px;
  line-height: 2;
  text-align: center;
`

const TipBox = styled.div`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 12px 14px;
  width: 100%;
`

const TipLabel = styled.div`
  font-size: 7px;
  color: var(--dim);
  letter-spacing: 2.5px;
  margin-bottom: 8px;
`

const TipText = styled.div`
  font-size: 9px;
  color: var(--muted);
  line-height: 2;
`

// ── Node detail ───────────────────────────────────────────────────────────────

const Content = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`

const NodeTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
  line-height: 1.35;
`

const NodeDesc = styled.div`
  font-size: 10px;
  color: var(--text2);
  line-height: 1.8;
`

const Section = styled.div``

const SLabel = styled.div`
  font-size: 7px;
  color: var(--muted);
  letter-spacing: 2.5px;
  margin-bottom: 8px;
`

const SValue = styled.div`
  font-size: 11px;
  color: var(--text2);
`

// ── Resources ─────────────────────────────────────────────────────────────────

const ResourceList = styled.div`display: flex; flex-direction: column; gap: 8px;`

const ResourceCard = styled.a`
  display: block;
  background: var(--card);
  border: 1px solid ${p => p.$hasUrl ? 'var(--border2)' : 'var(--border)'};
  border-radius: 6px;
  padding: 10px 12px;
  text-decoration: none;
  cursor: ${p => p.$hasUrl ? 'pointer' : 'default'};
  transition: border-color 0.12s, background 0.12s;
  ${p => p.$hasUrl && `&:hover { border-color: var(--accent); background: var(--border); }`}
`

const ResourceTop = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 4px;
`

const ResourceIcon = styled.span`
  font-size: 12px;
  flex-shrink: 0;
  color: ${p => p.$hasUrl ? 'var(--accent)' : 'var(--muted)'};
`

const ResourceTitle = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: ${p => p.$hasUrl ? 'var(--accent)' : 'var(--text2)'};
  line-height: 1.3;
`

const ResourceMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`

const ResourcePlatform = styled.span`
  font-size: 8px;
  color: var(--muted);
  letter-spacing: 0.8px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 1px 5px;
`

const ResourceType = styled.span`
  font-size: 8px;
  color: var(--dim);
  letter-spacing: 0.5px;
  text-transform: uppercase;
`

const ResourceNote = styled.div`
  margin-top: 5px;
  font-size: 9px;
  color: var(--muted);
  line-height: 1.6;
  border-left: 2px solid var(--border2);
  padding-left: 8px;
`

const ExternalArrow = styled.span`
  font-size: 9px;
  color: var(--muted);
  margin-left: auto;
  flex-shrink: 0;
`

// ── Status editor ─────────────────────────────────────────────────────────────

const Select = styled.select`
  background: var(--card);
  border: 1px solid var(--border2);
  border-radius: 5px;
  padding: 8px 10px;
  color: var(--text);
  font-size: 10px;
  font-family: inherit;
  letter-spacing: 0.5px;
  width: 100%;
  cursor: pointer;
  &:focus { outline: none; border-color: var(--accent); }
`

const SaveBtn = styled.button`
  background: ${p => p.disabled ? 'transparent' : 'var(--card)'};
  border: 1px solid ${p => p.disabled ? 'var(--border)' : 'var(--accent)'};
  border-radius: 5px;
  color: ${p => p.disabled ? 'var(--dim)' : 'var(--accent)'};
  font-family: inherit;
  font-size: 9px;
  padding: 9px;
  cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
  letter-spacing: 2px;
  width: 100%;
  transition: all 0.12s;
  &:hover:not(:disabled) { background: var(--border); }
`

const UnlockNote = styled.div`
  font-size: 8px;
  color: #40c080;
  letter-spacing: 0.5px;
  text-align: center;
  padding: 4px 0 0;
  opacity: 0.8;
`

// ── Helpers ────────────────────────────────────────────────────────────────────

const TYPE_ICON = { course: '◈', video: '▶', article: '◉', book: '□', tutorial: '◆' }

const STATUSES = ['locked', 'available', 'in_progress', 'complete']
const STATUS_LABELS = {
  locked: 'Locked',
  available: 'Available — ready to start',
  in_progress: 'In Progress',
  complete: 'Complete ✓',
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function NodeDetailDrawer({ node, onClose, onSaved }) {
  const [status, setStatus] = useState('locked')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (node) setStatus(node.status)
  }, [node?.id])

  async function handleSave() {
    if (!node) return
    setSaving(true)
    try {
      const updated = await updateNode(node.id, { status })
      onSaved(updated)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Panel>
      <Header>// NODE INSPECTOR</Header>
      <Scroll>
        {!node ? (
          <EmptyWrap>
            <EmptyMsg>
              SELECT ANY NODE<br />ON THE MAP<br />TO INSPECT
            </EmptyMsg>
            <TipBox>
              <TipLabel>// HOW IT WORKS</TipLabel>
              <TipText>
                Click any glowing node to open it.<br />
                Work through its resources, then<br />
                mark it <strong>Complete</strong> to unlock<br />
                the next skills in your path.
              </TipText>
            </TipBox>
          </EmptyWrap>
        ) : (
          <Content>
            <NodeTitle>{node.title}</NodeTitle>

            {node.description && <NodeDesc>{node.description}</NodeDesc>}

            <Section>
              <SLabel>ESTIMATED TIME</SLabel>
              <SValue>{node.estimated_hours || 0}h</SValue>
            </Section>

            {node.resources?.length > 0 && (
              <Section>
                <SLabel>START HERE — RESOURCES</SLabel>
                <ResourceList>
                  {node.resources.map((r, i) => {
                    const hasUrl = !!(r.url?.trim())
                    const icon = TYPE_ICON[r.type] || '◆'
                    return (
                      <ResourceCard
                        key={i}
                        as={hasUrl ? 'a' : 'div'}
                        href={hasUrl ? r.url : undefined}
                        target={hasUrl ? '_blank' : undefined}
                        rel={hasUrl ? 'noopener noreferrer' : undefined}
                        $hasUrl={hasUrl}
                      >
                        <ResourceTop>
                          <ResourceIcon $hasUrl={hasUrl}>{icon}</ResourceIcon>
                          <ResourceTitle $hasUrl={hasUrl}>{r.title}</ResourceTitle>
                          {hasUrl && <ExternalArrow>↗</ExternalArrow>}
                        </ResourceTop>
                        <ResourceMeta>
                          {r.platform && <ResourcePlatform>{r.platform}</ResourcePlatform>}
                          <ResourceType>{r.type || 'resource'}</ResourceType>
                        </ResourceMeta>
                        {r.note && <ResourceNote>{r.note}</ResourceNote>}
                      </ResourceCard>
                    )
                  })}
                </ResourceList>
              </Section>
            )}

            {node.branch_label && (
              <Section>
                <SLabel>BRANCH / SPECIALIZATION</SLabel>
                <SValue>{node.branch_label}</SValue>
              </Section>
            )}

            <Section>
              <SLabel>MARK PROGRESS</SLabel>
              <Select value={status} onChange={e => setStatus(e.target.value)}>
                {STATUSES.map(s => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </Select>
            </Section>

            <div>
              <SaveBtn onClick={handleSave} disabled={saving || status === node.status}>
                {saving ? 'SAVING...' : 'SAVE PROGRESS'}
              </SaveBtn>
              {status === 'complete' && status !== node.status && (
                <UnlockNote>↓ will unlock next skills in your path</UnlockNote>
              )}
            </div>
          </Content>
        )}
      </Scroll>
    </Panel>
  )
}
