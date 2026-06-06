import { Handle, Position } from '@xyflow/react'
import styled, { keyframes, css } from 'styled-components'

// ── Status → visual config ────────────────────────────────────────────────────

const STATUS = {
  locked: {
    ring: '#cbd5e1', ringW: 2, bg: '#f1f5f9',
    iconColor: '#94a3b8', labelColor: '#94a3b8',
    glow: 'none', pulse: false,
  },
  available: {
    ring: '#2563eb', ringW: 3, bg: '#ffffff',
    iconColor: '#2563eb', labelColor: '#1e293b',
    glow: '0 0 0 0 rgba(37,99,235,0.5)', pulse: true,
  },
  in_progress: {
    ring: '#f59e0b', ringW: 3, bg: '#fffbeb',
    iconColor: '#b45309', labelColor: '#1e293b',
    glow: '0 4px 20px rgba(245,158,11,0.35)', pulse: false,
  },
  complete: {
    ring: '#22c55e', ringW: 3, bg: '#f0fdf4',
    iconColor: '#16a34a', labelColor: '#1e293b',
    glow: '0 4px 20px rgba(34,197,94,0.35)', pulse: false,
  },
}

// ── Icon picker ────────────────────────────────────────────────────────────────

function pickIcon(title = '') {
  const t = title.toLowerCase()
  if (/html|markup|tag/.test(t))               return '‹›'
  if (/css|style|layout|flex|grid/.test(t))    return '✦'
  if (/typescript|tsx/.test(t))                return 'TS'
  if (/javascript|jsx|\.js/.test(t))           return 'JS'
  if (/python/.test(t))                        return 'Py'
  if (/react|vue|angular|svelte/.test(t))      return '⚛'
  if (/node|express|deno/.test(t))             return '{}'
  if (/database|sql|mongo|postgres|mysql/.test(t)) return '⊞'
  if (/git|github|version|branch/.test(t))     return '⑂'
  if (/api|rest|http|graphql|fetch/.test(t))   return '⇌'
  if (/data.*sci|analytic|tableau|power.?bi/.test(t)) return '∑'
  if (/machine|deep learn|neural|ml|ai/.test(t)) return '◉'
  if (/devops|docker|k8s|cloud|deploy/.test(t)) return '⬡'
  if (/test|jest|cypress|qa|debug/.test(t))    return '◎'
  if (/security|auth|oauth|jwt/.test(t))       return '⊕'
  if (/math|calculus|linear|statistic/.test(t)) return 'π'
  if (/algorithm|data.struct/.test(t))         return 'Σ'
  if (/ui|ux|figma|design|proto/.test(t))      return '◈'
  if (/excel|sheet|spread/.test(t))            return '▦'
  if (/java\b|kotlin/.test(t))                 return 'Ja'
  if (/go\b|golang/.test(t))                   return 'Go'
  if (/rust/.test(t))                          return 'Rs'
  if (/swift|ios/.test(t))                     return 'Sw'
  if (/c\+\+|cpp/.test(t))                     return 'C+'
  if (/php/.test(t))                           return 'φ'
  if (/linux|bash|shell|terminal/.test(t))     return '$_'
  if (/network|tcp|http/.test(t))              return '⊗'
  return title.slice(0, 2).toUpperCase()
}

// ── Animations ─────────────────────────────────────────────────────────────────

const ringPulse = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(37,99,235,0.55); }
  70%  { box-shadow: 0 0 0 12px rgba(37,99,235,0); }
  100% { box-shadow: 0 0 0 0 rgba(37,99,235,0); }
`

// ── Styled components ──────────────────────────────────────────────────────────

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 80px;
`

const Circle = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${p => p.$s.bg};
  border: ${p => p.$s.ringW}px solid ${p => p.$s.ring};
  box-shadow: ${p => p.$s.glow};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  ${p => p.$s.pulse && css`
    animation: ${ringPulse} 2s ease-in-out infinite;
  `}

  &:hover {
    transform: scale(1.1);
    filter: brightness(1.05);
  }
`

const IconText = styled.span`
  font-size: ${p => p.$short ? '15px' : '11px'};
  font-weight: 800;
  color: ${p => p.$color};
  font-family: 'Courier New', Courier, monospace;
  line-height: 1;
  user-select: none;
  letter-spacing: ${p => p.$short ? '0px' : '-0.5px'};
`

const GreenTick = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #22c55e;
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  color: #fff;
  font-weight: 900;
  box-shadow: 0 2px 6px rgba(34,197,94,0.4);
`

const Label = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: ${p => p.$color};
  text-align: center;
  line-height: 1.3;
  max-width: 88px;
  word-break: break-word;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
`

const handleStyle = {
  background: 'transparent',
  border: 'none',
  width: 6,
  height: 6,
  zIndex: 10,
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function SkillNode({ data }) {
  const s = STATUS[data.status] || STATUS.locked
  const isComplete = data.status === 'complete'
  const isLocked   = data.status === 'locked'

  const icon = isComplete ? '✓'
    : isLocked ? '⊘'
    : pickIcon(data.title)

  const shortIcon = String(icon).length <= 2

  return (
    <>
      <Handle type="target" position={Position.Top} style={handleStyle} />
      <Wrap>
        <Circle $s={s}>
          <IconText $color={s.iconColor} $short={shortIcon}>
            {icon}
          </IconText>
          {isComplete && <GreenTick>✓</GreenTick>}
        </Circle>
        <Label $color={s.labelColor}>{data.title}</Label>
      </Wrap>
      <Handle type="source" position={Position.Bottom} style={handleStyle} />
    </>
  )
}
