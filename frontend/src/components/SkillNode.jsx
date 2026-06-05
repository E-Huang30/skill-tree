import { Handle, Position } from '@xyflow/react'
import styled from 'styled-components'

const ICONS = [
  // 0: code brackets
  <svg key={0} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/></svg>,
  // 1: layers / stack
  <svg key={1} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12,2 2,7 12,12 22,7 12,2"/><polyline points="2,17 12,22 22,17"/><polyline points="2,12 12,17 22,12"/></svg>,
  // 2: database
  <svg key={2} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  // 3: cpu / system
  <svg key={3} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="2" x2="9" y2="4"/><line x1="15" y1="2" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="22"/><line x1="15" y1="20" x2="15" y2="22"/><line x1="20" y1="9" x2="22" y2="9"/><line x1="20" y1="14" x2="22" y2="14"/><line x1="2" y1="9" x2="4" y2="9"/><line x1="2" y1="14" x2="4" y2="14"/></svg>,
  // 4: git / version control
  <svg key={4} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 012 2v7"/><line x1="6" y1="9" x2="6" y2="21"/></svg>,
  // 5: terminal / CLI
  <svg key={5} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4,17 10,11 4,5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>,
  // 6: globe / network / API
  <svg key={6} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  // 7: shield / security / testing
  <svg key={7} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  // 8: activity / algorithms
  <svg key={8} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>,
  // 9: package / module
  <svg key={9} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27,6.96 12,12.01 20.73,6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
]

function pickIcon(title) {
  const t = (title || '').toLowerCase()
  if (/(html|css|style|frontend|ui|design|layout|component|react|vue|angular)/.test(t)) return 0
  if (/(layer|stack|architect|micro|service|infra|cloud|devops)/.test(t)) return 1
  if (/(data|database|sql|storage|persist|mongo|postgres|redis|query)/.test(t)) return 2
  if (/(cpu|processor|compute|hardware|system|os|kernel|concurr|thread)/.test(t)) return 3
  if (/(git|version|control|branch|deploy|ci|cd|pipeline|workflow)/.test(t)) return 4
  if (/(terminal|cli|command|bash|shell|script|linux|unix)/.test(t)) return 5
  if (/(api|rest|http|graphql|network|web|server|endpoint|socket)/.test(t)) return 6
  if (/(security|auth|test|quality|review|audit|safe|validat)/.test(t)) return 7
  if (/(algo|perform|optim|complex|pattern|sort|search|recursion)/.test(t)) return 8
  if (/(package|module|library|framework|sdk|tool|build|bundle)/.test(t)) return 9
  let h = 0
  for (const c of title || '') h = (h * 31 + c.charCodeAt(0)) & 0xffff
  return h % ICONS.length
}

const HS = { background: 'transparent', border: 'none', width: 6, height: 6 }

export default function SkillNode({ data }) {
  const { status = 'locked', branchColor = '#5a90e8', isRoot = false, title = '' } = data
  const locked   = status === 'locked'
  const complete = status === 'complete'
  const active   = status === 'in_progress'
  const color    = locked ? '#1e2a3a' : branchColor
  const SIZE     = isRoot ? 68 : 50
  // approx height of labels below the circle (gap + label + optional branch tag)
  const LABEL_H  = isRoot ? 44 : 25

  return (
    <Wrap>
      <Handle type="source" position={Position.Top}    style={{ ...HS, top: -3 }} />
      <Handle type="target" position={Position.Bottom} style={{ ...HS, bottom: LABEL_H }} />

      <Orb $c={color} $sz={SIZE} $complete={complete} $active={active} $locked={locked}>
        <Icon $c={locked ? '#2a3a55' : complete ? '#fff' : branchColor} $sz={SIZE * 0.43}>
          {ICONS[pickIcon(title)]}
        </Icon>
        {complete && <CompleteBadge $c={branchColor}>✓</CompleteBadge>}
      </Orb>

      <Label $locked={locked}>{title}</Label>
      {isRoot && data.branch_label && (
        <BTag $c={branchColor}>{data.branch_label.toUpperCase()}</BTag>
      )}
    </Wrap>
  )
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  min-width: 100px;
`

const Orb = styled.div`
  width: ${p => p.$sz}px;
  height: ${p => p.$sz}px;
  border-radius: 50%;
  background: ${p => p.$complete ? `${p.$c}18` : '#06060f'};
  border: 2px solid ${p => p.$c};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
  transition: box-shadow 0.2s;

  ${p => !p.$locked && `
    box-shadow: 0 0 ${p.$active ? 22 : 10}px ${p.$active ? 6 : 2}px ${p.$c}${p.$active ? '99' : '44'};
  `}

  &:hover {
    ${p => !p.$locked && `box-shadow: 0 0 26px 8px ${p.$c}77;`}
  }
`

const Icon = styled.div`
  width: ${p => p.$sz}px;
  height: ${p => p.$sz}px;
  color: ${p => p.$c};
  display: flex;
  align-items: center;
  justify-content: center;
  svg { width: 100%; height: 100%; }
`

const CompleteBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${p => p.$c};
  color: #06060f;
  font-size: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Label = styled.div`
  font-size: 9px;
  font-weight: 600;
  color: ${p => p.$locked ? '#1e2a3a' : '#8090b0'};
  text-align: center;
  max-width: 100px;
  line-height: 1.3;
  font-family: 'Courier New', monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  letter-spacing: 0.3px;
`

const BTag = styled.div`
  font-size: 8px;
  font-weight: 700;
  color: ${p => p.$c};
  letter-spacing: 2.5px;
  text-align: center;
  font-family: 'Courier New', monospace;
`
