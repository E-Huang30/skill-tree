import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { updateNode } from '../api/nodes'
import { getResourceProgress, saveResourceProgress, formatTime } from '../utils/progress'

// ── Constants ──────────────────────────────────────────────────────────────────

const TYPE_ICON = { course: '📖', video: '▶', article: '📄', book: '📚', tutorial: '🛠' }
const STATUSES  = ['locked', 'available', 'in_progress', 'complete']
const STATUS_LABELS = {
  locked:      'Locked',
  available:   'Available — ready to start',
  in_progress: 'In Progress',
  complete:    'Complete ✓',
}
const RESOURCE_DESCRIPTIONS = {
  course:   'A structured course that walks you through this skill step by step.',
  video:    'A video lesson — great for seeing concepts explained and demonstrated.',
  article:  'A reading resource covering key concepts and theory.',
  book:     'An in-depth written resource for thorough understanding.',
  tutorial: 'A hands-on tutorial — follow along and build something real.',
}
const STATUS_DOT = { locked: '⬤', available: '◆', in_progress: '⚡', complete: '✓' }

function platformStyle(platform = '') {
  const p = platform.toLowerCase()
  if (p.includes('khan'))          return { color: '#15803d', bg: '#f0fdf4' }
  if (p.includes('freecodecamp'))  return { color: '#0c4a6e', bg: '#f0f9ff' }
  if (p.includes('odin'))          return { color: '#b45309', bg: '#fffbeb' }
  if (p.includes('mdn'))           return { color: '#7c3aed', bg: '#f5f3ff' }
  if (p.includes('coursera'))      return { color: '#1d4ed8', bg: '#eff6ff' }
  if (p.includes('youtube'))       return { color: '#dc2626', bg: '#fef2f2' }
  if (p.includes('w3'))            return { color: '#0891b2', bg: '#f0fdfa' }
  if (p.includes('udemy'))         return { color: '#92400e', bg: '#fef3c7' }
  return { color: '#6b7280', bg: '#f9fafb' }
}

// ── Resource card with done toggle + study timer ───────────────────────────────

function ResourceCardItem({ r, idx, nodeId, userId }) {
  const [open,    setOpen]    = useState(false)
  const [done,    setDone]    = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)

  const intervalRef = useRef(null)
  const secondsRef  = useRef(0)
  const doneRef     = useRef(false)

  // Keep refs in sync
  useEffect(() => { secondsRef.current = seconds }, [seconds])
  useEffect(() => { doneRef.current = done       }, [done])

  // Load saved progress
  useEffect(() => {
    const p = getResourceProgress(userId, nodeId, idx)
    setDone(p.done)
    setSeconds(p.seconds)
    secondsRef.current = p.seconds
    doneRef.current    = p.done
  }, [userId, nodeId, idx])

  // Timer interval
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        const next = secondsRef.current + 1
        secondsRef.current = next
        setSeconds(next)
        saveResourceProgress(userId, nodeId, idx, { done: doneRef.current, seconds: next })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
      saveResourceProgress(userId, nodeId, idx, { done: doneRef.current, seconds: secondsRef.current })
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  // Save on unmount
  useEffect(() => () => {
    clearInterval(intervalRef.current)
    saveResourceProgress(userId, nodeId, idx, { done: doneRef.current, seconds: secondsRef.current })
  }, [])

  function toggleDone(e) {
    e.stopPropagation()
    const next = !done
    setDone(next)
    if (next) setRunning(false)
    saveResourceProgress(userId, nodeId, idx, { done: next, seconds: secondsRef.current })
  }

  function toggleTimer(e) {
    e.stopPropagation()
    if (done) return
    setRunning(v => !v)
  }

  const hasUrl  = !!(r.url?.trim())
  const emoji   = TYPE_ICON[r.type] || '📌'
  const ps      = platformStyle(r.platform)
  const typeDesc = RESOURCE_DESCRIPTIONS[r.type] || 'A learning resource to help you master this skill.'

  return (
    <ResourceCard $open={open} $done={done} onClick={() => setOpen(v => !v)}>
      <ResourceTop>
        <ResourceEmoji>{emoji}</ResourceEmoji>
        <ResourceInfo>
          <ResourceTitle $done={done}>{r.title}</ResourceTitle>
          <ResourceMeta>
            {r.platform && <PlatformTag $color={ps.color} $bg={ps.bg}>{r.platform}</PlatformTag>}
            <TypeTag>{r.type || 'resource'}</TypeTag>
          </ResourceMeta>
        </ResourceInfo>

        {/* Collapsed indicators */}
        <CollapseRight>
          {done && <DonePill>✓ Done</DonePill>}
          {!done && seconds > 0 && <TimePill>⏱ {formatTime(seconds)}</TimePill>}
          <ExpandArrow $open={open}>▾</ExpandArrow>
        </CollapseRight>
      </ResourceTop>

      {open && (
        <ResourceBody>
          {/* Description */}
          <DescBox>{typeDesc}</DescBox>

          {/* Start-here note */}
          {r.note && (
            <NoteBox>
              <NoteLabel>📌 Where to start</NoteLabel>
              <NoteText>{r.note}</NoteText>
            </NoteBox>
          )}

          {/* Tracking row */}
          <TrackRow>
            <DoneToggle $done={done} onClick={toggleDone}>
              {done ? '✓ Completed' : '○ Mark done'}
            </DoneToggle>
            <TimerBlock>
              <TimerDisplay $running={running}>{formatTime(seconds)}</TimerDisplay>
              <TimerBtn
                onClick={toggleTimer}
                disabled={done}
                $running={running}
              >
                {running ? '⏸' : '▶'}
              </TimerBtn>
            </TimerBlock>
          </TrackRow>

          {/* External link */}
          {hasUrl && (
            <OpenLink
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
            >
              Open {r.platform || 'Resource'} ↗
            </OpenLink>
          )}
        </ResourceBody>
      )}
    </ResourceCard>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function NodeDetailDrawer({ node, onSaved }) {
  const [status,   setStatus]   = useState('locked')
  const [saving,   setSaving]   = useState(false)
  const userId = localStorage.getItem('userId') || 'guest'

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
      <Header>Node Inspector</Header>
      <Scroll>
        {!node ? (
          <EmptyWrap>
            <EmptyIcon>🗺️</EmptyIcon>
            <EmptyMsg>Select a skill node</EmptyMsg>
            <EmptySub>
              Click any node on the map to see its resources, track study time, and mark your progress.
            </EmptySub>
            <TipBox>
              <TipLabel>How it works</TipLabel>
              <TipText>
                ◆ Blue nodes are ready to start<br />
                ▶ Start the timer when you study<br />
                ✓ Mark each resource done when finished<br />
                🔓 Complete a node to unlock the next
              </TipText>
            </TipBox>
          </EmptyWrap>
        ) : (
          <Content>
            <div>
              <NodeTitle>{node.title}</NodeTitle>
              <div style={{ marginTop: 10 }}>
                <StatusPill $s={node.status}>
                  {STATUS_DOT[node.status]} {STATUS_LABELS[node.status] || node.status}
                </StatusPill>
              </div>
            </div>

            {node.description && (
              <>
                <Divider />
                <NodeDesc>{node.description}</NodeDesc>
              </>
            )}

            <Divider />
            <Section>
              <SLabel>Estimated Time</SLabel>
              <HoursRow>
                <HoursNum>{node.estimated_hours || 0}</HoursNum>
                <HoursUnit>hours</HoursUnit>
              </HoursRow>
            </Section>

            {node.branch_label && (
              <>
                <Divider />
                <Section>
                  <SLabel>Specialisation Branch</SLabel>
                  <BranchTag>⑂ {node.branch_label}</BranchTag>
                </Section>
              </>
            )}

            {node.resources?.length > 0 && (
              <>
                <Divider />
                <Section>
                  <SLabel>
                    Learning Resources
                    <ResourceCount>
                      {node.resources.filter((_, i) => {
                        const p = getResourceProgress(userId, node.id, i)
                        return p.done
                      }).length}/{node.resources.length} done
                    </ResourceCount>
                  </SLabel>
                  <ResourceList>
                    {node.resources.map((r, i) => (
                      <ResourceCardItem
                        key={i}
                        r={r}
                        idx={i}
                        nodeId={node.id}
                        userId={userId}
                      />
                    ))}
                  </ResourceList>
                </Section>
              </>
            )}

            <Divider />
            <Section>
              <SLabel>Update Progress</SLabel>
              <Select value={status} onChange={e => setStatus(e.target.value)}>
                {STATUSES.map(s => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </Select>
            </Section>

            <div>
              <SaveBtn onClick={handleSave} disabled={saving || status === node.status}>
                {saving ? 'Saving…' : 'Save Progress'}
              </SaveBtn>
              {status === 'complete' && status !== node.status && (
                <UnlockNote>🔓 Will unlock next skills in your path</UnlockNote>
              )}
            </div>
          </Content>
        )}
      </Scroll>
    </Panel>
  )
}

// ── Styled components ──────────────────────────────────────────────────────────

const Panel = styled.div`
  width: 280px;
  min-width: 280px;
  background: #ffffff;
  border-left: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
`
const Header = styled.div`
  padding: 14px 16px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 2px;
  text-transform: uppercase;
  flex-shrink: 0;
`
const Scroll = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }
`

// Empty state
const EmptyWrap = styled.div`flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:28px 20px; gap:16px;`
const EmptyIcon = styled.div`font-size:40px; line-height:1;`
const EmptyMsg  = styled.div`font-size:15px; font-weight:700; color:#334155; text-align:center;`
const EmptySub  = styled.div`font-size:12px; color:#94a3b8; text-align:center; line-height:1.65;`
const TipBox    = styled.div`background:#f8faff; border:1.5px solid #e0eaff; border-radius:10px; padding:14px 16px; width:100%;`
const TipLabel  = styled.div`font-size:9px; font-weight:700; color:#2563eb; letter-spacing:2px; text-transform:uppercase; margin-bottom:8px;`
const TipText   = styled.div`font-size:12px; color:#475569; line-height:1.85;`

// Node content
const Content   = styled.div`padding:18px 16px; display:flex; flex-direction:column; gap:18px;`
const NodeTitle = styled.div`font-size:17px; font-weight:800; color:#0f172a; line-height:1.25; letter-spacing:-0.3px;`
const StatusPill = styled.div`
  display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:20px;
  font-size:11px; font-weight:600;
  background:${p => p.$s==='complete'?'#f0fdf4':p.$s==='in_progress'?'#fffbeb':p.$s==='available'?'#eff6ff':'#f8fafc'};
  color:${p => p.$s==='complete'?'#16a34a':p.$s==='in_progress'?'#b45309':p.$s==='available'?'#1d4ed8':'#94a3b8'};
  border:1.5px solid ${p => p.$s==='complete'?'#86efac':p.$s==='in_progress'?'#fcd34d':p.$s==='available'?'#93c5fd':'#e2e8f0'};
`
const NodeDesc  = styled.div`font-size:13px; color:#475569; line-height:1.75;`
const Section   = styled.div``
const SLabel    = styled.div`font-size:9px; font-weight:700; color:#94a3b8; letter-spacing:2px; text-transform:uppercase; margin-bottom:10px; display:flex; align-items:center; justify-content:space-between;`
const ResourceCount = styled.span`font-size:10px; font-weight:600; color:#2563eb; letter-spacing:0.3px;`
const Divider   = styled.div`height:1px; background:#f1f5f9;`
const HoursRow  = styled.div`display:flex; align-items:baseline; gap:6px;`
const HoursNum  = styled.span`font-size:24px; font-weight:800; color:#2563eb; letter-spacing:-0.5px;`
const HoursUnit = styled.span`font-size:13px; color:#94a3b8; font-weight:500;`
const BranchTag = styled.div`display:inline-flex; background:#f5f3ff; border:1px solid #ddd6fe; border-radius:6px; padding:4px 10px; font-size:11px; color:#7c3aed; font-weight:600;`

// Resources
const ResourceList = styled.div`display:flex; flex-direction:column; gap:8px;`

const ResourceCard = styled.div`
  background: ${p => p.$done ? '#f0fdf4' : '#f8fafc'};
  border: 1.5px solid ${p => p.$open ? '#93c5fd' : p.$done ? '#86efac' : '#e2e8f0'};
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.15s, background 0.15s;
  cursor: pointer;
  &:hover { border-color: ${p => p.$done ? '#4ade80' : '#93c5fd'}; }
`
const ResourceTop  = styled.div`display:flex; align-items:center; gap:10px; padding:12px 14px;`
const ResourceEmoji = styled.div`font-size:18px; flex-shrink:0; line-height:1;`
const ResourceInfo = styled.div`flex:1; min-width:0;`
const ResourceTitle = styled.div`
  font-size:13px; font-weight:700; color:${p => p.$done ? '#15803d' : '#1e293b'};
  white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:2px;
  text-decoration:${p => p.$done ? 'line-through' : 'none'};
`
const ResourceMeta = styled.div`display:flex; align-items:center; gap:6px; flex-wrap:wrap;`
const PlatformTag  = styled.span`font-size:10px; font-weight:600; color:${p=>p.$color||'#7c3aed'}; background:${p=>p.$bg||'#f5f3ff'}; border-radius:4px; padding:1px 7px;`
const TypeTag      = styled.span`font-size:10px; color:#94a3b8; font-weight:500;`
const CollapseRight = styled.div`display:flex; align-items:center; gap:6px; flex-shrink:0;`
const DonePill  = styled.span`font-size:9px; font-weight:700; color:#16a34a; background:#f0fdf4; border:1px solid #86efac; border-radius:10px; padding:2px 7px;`
const TimePill  = styled.span`font-size:9px; font-weight:600; color:#2563eb; background:#eff6ff; border:1px solid #bfdbfe; border-radius:10px; padding:2px 7px;`
const ExpandArrow = styled.span`font-size:13px; color:#94a3b8; transition:transform 0.15s; transform:${p=>p.$open?'rotate(180deg)':'rotate(0)'};`

const ResourceBody = styled.div`padding:0 14px 14px; display:flex; flex-direction:column; gap:10px; border-top:1px solid #e2e8f0;`
const DescBox  = styled.div`padding-top:12px; font-size:12px; color:#475569; line-height:1.7;`
const NoteBox  = styled.div`background:#eff6ff; border:1px solid #bfdbfe; border-radius:7px; padding:10px 12px;`
const NoteLabel = styled.div`font-size:9px; font-weight:700; color:#2563eb; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:5px;`
const NoteText  = styled.div`font-size:12px; color:#1d4ed8; line-height:1.65; font-weight:500;`

// Tracking
const TrackRow    = styled.div`display:flex; align-items:center; justify-content:space-between; gap:8px;`
const DoneToggle  = styled.button`
  flex:1; padding:8px 12px; border-radius:8px; font-size:12px; font-weight:700;
  font-family:inherit; cursor:pointer; transition:all 0.12s;
  background:${p=>p.$done?'#f0fdf4':'#f8fafc'};
  border:1.5px solid ${p=>p.$done?'#86efac':'#e2e8f0'};
  color:${p=>p.$done?'#15803d':'#64748b'};
  &:hover { border-color:${p=>p.$done?'#4ade80':'#2563eb'}; color:${p=>p.$done?'#15803d':'#2563eb'}; }
`
const TimerBlock  = styled.div`display:flex; align-items:center; gap:6px;`
const TimerDisplay = styled.div`
  font-size:13px; font-weight:800; color:${p=>p.$running?'#2563eb':'#334155'};
  font-family:'Courier New', monospace; min-width:38px; text-align:right;
`
const TimerBtn = styled.button`
  width:32px; height:32px; border-radius:50%; border:none;
  background:${p=>p.disabled?'#f1f5f9':p.$running?'#fee2e2':'#eff6ff'};
  color:${p=>p.disabled?'#cbd5e1':p.$running?'#dc2626':'#2563eb'};
  font-size:13px; cursor:${p=>p.disabled?'not-allowed':'pointer'};
  display:flex; align-items:center; justify-content:center;
  transition:all 0.12s;
  &:hover:not(:disabled) { transform:scale(1.1); }
`
const OpenLink = styled.a`
  display:flex; align-items:center; justify-content:center; gap:6px;
  background:#2563eb; color:#fff; border-radius:7px; padding:9px;
  font-size:12px; font-weight:700; text-decoration:none;
  transition:background 0.12s;
  &:hover { background:#1d4ed8; }
`

// Status + save
const Select = styled.select`
  background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:8px;
  padding:10px 12px; color:#334155; font-size:13px; font-family:inherit;
  font-weight:500; width:100%; cursor:pointer; transition:border-color 0.12s;
  &:focus { outline:none; border-color:#2563eb; }
`
const SaveBtn = styled.button`
  background:${p=>p.disabled?'#f1f5f9':'#2563eb'};
  border:none; border-radius:8px;
  color:${p=>p.disabled?'#94a3b8':'#fff'};
  font-family:inherit; font-size:13px; font-weight:700; padding:11px;
  cursor:${p=>p.disabled?'not-allowed':'pointer'};
  width:100%; transition:background 0.12s, transform 0.1s;
  &:hover:not(:disabled) { background:#1d4ed8; transform:translateY(-1px); }
  &:active:not(:disabled) { transform:none; }
`
const UnlockNote = styled.div`
  font-size:11px; color:#16a34a; font-weight:600; text-align:center;
  padding:6px 0 0; display:flex; align-items:center; justify-content:center; gap:4px;
`
