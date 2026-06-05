import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { updateNode } from '../api/nodes'

const Panel = styled.div`
  width: 256px;
  min-width: 256px;
  background: #0b0b18;
  border-left: 1px solid #141424;
  display: flex;
  flex-direction: column;
  font-family: 'Courier New', Courier, monospace;
  overflow: hidden;
`

const Header = styled.div`
  padding: 13px 16px;
  border-bottom: 1px solid #141424;
  font-size: 9px;
  color: #2a4070;
  letter-spacing: 2.5px;
  flex-shrink: 0;
`

const Scroll = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: #141424; }
`

// Empty state
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
  color: #1e2a3a;
  letter-spacing: 1.5px;
  line-height: 2;
  text-align: center;
`

const TipBox = styled.div`
  background: #0d0d1c;
  border: 1px solid #141424;
  border-radius: 4px;
  padding: 12px 14px;
  width: 100%;
`

const TipLabel = styled.div`
  font-size: 7px;
  color: #1e2a3a;
  letter-spacing: 2.5px;
  margin-bottom: 8px;
`

const TipText = styled.div`
  font-size: 9px;
  color: #1e2a3a;
  line-height: 2;
  letter-spacing: 0.3px;
`

// Node detail state
const Content = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const NodeTitle = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #6a9fd8;
  line-height: 1.35;
`

const NodeDesc = styled.div`
  font-size: 9px;
  color: #3a5080;
  line-height: 1.9;
`

const Field = styled.div``

const FLabel = styled.div`
  font-size: 7px;
  color: #1e2a3a;
  letter-spacing: 2.5px;
  margin-bottom: 6px;
`

const FValue = styled.div`
  font-size: 11px;
  color: #4a6a9a;
`

const Select = styled.select`
  background: #0d0d1c;
  border: 1px solid #1a2a3a;
  border-radius: 4px;
  padding: 7px 10px;
  color: #6a9fd8;
  font-size: 9px;
  font-family: inherit;
  letter-spacing: 1px;
  width: 100%;
  cursor: pointer;
  &:focus { outline: none; border-color: #2a5090; }
`

const SaveBtn = styled.button`
  background: ${p => p.disabled ? 'transparent' : '#0d1828'};
  border: 1px solid ${p => p.disabled ? '#141424' : '#1e3a70'};
  border-radius: 4px;
  color: ${p => p.disabled ? '#1e2a3a' : '#4a80d8'};
  font-family: inherit;
  font-size: 8px;
  padding: 9px;
  cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
  letter-spacing: 2px;
  transition: all 0.12s;
  &:hover:not(:disabled) { background: #101e38; }
`

const STATUSES = ['locked', 'available', 'in_progress', 'complete']

const ResourceList = styled.div`display: flex; flex-direction: column; gap: 6px;`

const ResourceLink = styled.a`
  display: block;
  background: #0d0d1c;
  border: 1px solid #1a2a3a;
  border-radius: 4px;
  padding: 8px 10px;
  text-decoration: none;
  transition: border-color 0.12s;
  &:hover { border-color: #2a5090; }
`

const ResourceNoLink = styled.div`
  background: #0d0d1c;
  border: 1px solid #141424;
  border-radius: 4px;
  padding: 8px 10px;
`

const ResourceTitle = styled.div`
  font-size: 10px;
  color: ${p => p.$linked ? '#5a80c8' : '#3a5080'};
  line-height: 1.4;
`

const ResourceMeta = styled.div`
  font-size: 8px;
  color: #2a3a55;
  letter-spacing: 1px;
  margin-top: 3px;
`

const StartBanner = styled.div`
  background: #0a1e12;
  border: 1px solid #1a5030;
  border-radius: 6px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
`

const StartLeft = styled.div`flex: 1; min-width: 0;`

const StartLabel = styled.div`
  font-size: 8px;
  color: #40c080;
  letter-spacing: 2px;
  font-weight: 700;
  margin-bottom: 3px;
`

const StartHint = styled.div`
  font-size: 9px;
  color: #3a6050;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const StartLink = styled.a`
  flex-shrink: 0;
  font-size: 8px;
  color: #40c080;
  letter-spacing: 1.5px;
  text-decoration: none;
  border: 1px solid #1a5030;
  border-radius: 3px;
  padding: 5px 9px;
  font-family: 'Courier New', monospace;
  transition: background 0.12s;
  &:hover { background: #0d2a1a; }
`

const TYPE_ICON = {
  course:  '◈',
  video:   '▶',
  article: '◉',
  book:    '□',
}

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
              SELECT ANY NODE<br />
              ON THE MAP<br />
              TO INSPECT
            </EmptyMsg>
            <TipBox>
              <TipLabel>// TIP</TipLabel>
              <TipText>
                Lit nodes are unlockable.<br />
                Dashed edges = optional path.<br />
                ◇ = costs SP · ⚡ = free
              </TipText>
            </TipBox>
          </EmptyWrap>
        ) : (
          <Content>
            {node.status === 'available' && node.resources?.length > 0 && (
              <StartBanner>
                <StartLeft>
                  <StartLabel>▶ START HERE</StartLabel>
                  <StartHint>{node.resources[0].title}</StartHint>
                </StartLeft>
                {node.resources[0].url && (
                  <StartLink href={node.resources[0].url} target="_blank" rel="noopener noreferrer">
                    OPEN →
                  </StartLink>
                )}
              </StartBanner>
            )}
            <NodeTitle>{node.title}</NodeTitle>
            {node.description && <NodeDesc>{node.description}</NodeDesc>}
            <Field>
              <FLabel>HOURS</FLabel>
              <FValue>{node.estimated_hours || 0}h estimated</FValue>
            </Field>
            {node.branch_label && (
              <Field>
                <FLabel>BRANCH</FLabel>
                <FValue>{node.branch_label}</FValue>
              </Field>
            )}
            {node.resources?.length > 0 && (
              <Field>
                <FLabel>RESOURCES</FLabel>
                <ResourceList>
                  {node.resources.map((r, i) => {
                    const icon = TYPE_ICON[r.type] || '◆'
                    const hasUrl = r.url && r.url.trim() !== ''
                    const inner = (
                      <>
                        <ResourceTitle $linked={hasUrl}>{icon} {r.title}</ResourceTitle>
                        <ResourceMeta>{(r.type || 'resource').toUpperCase()}</ResourceMeta>
                      </>
                    )
                    return hasUrl ? (
                      <ResourceLink key={i} href={r.url} target="_blank" rel="noopener noreferrer">
                        {inner}
                      </ResourceLink>
                    ) : (
                      <ResourceNoLink key={i}>{inner}</ResourceNoLink>
                    )
                  })}
                </ResourceList>
              </Field>
            )}
            <Field>
              <FLabel>STATUS</FLabel>
              <Select value={status} onChange={e => setStatus(e.target.value)}>
                {STATUSES.map(s => (
                  <option key={s} value={s}>
                    {s.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </Select>
            </Field>
            <SaveBtn onClick={handleSave} disabled={saving || status === node.status}>
              {saving ? 'SAVING...' : 'SAVE CHANGES'}
            </SaveBtn>
          </Content>
        )}
      </Scroll>
    </Panel>
  )
}
