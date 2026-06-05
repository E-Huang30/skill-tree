import { useState } from 'react'
import styled, { keyframes } from 'styled-components'

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 8px currentColor; }
  50%       { box-shadow: 0 0 22px currentColor, 0 0 44px currentColor; }
`

const NODES = [
  { id: 'root', x: 150, y: 230, label: 'HTML & CSS',   status: 'complete', color: '#00f5ff' },
  { id: 'n1',   x: 60,  y: 145, label: 'JavaScript',   status: 'complete', color: '#00f5ff' },
  { id: 'n2',   x: 240, y: 145, label: 'React',        status: 'active',   color: '#7b2fff' },
  { id: 'n3',   x: 60,  y: 55,  label: 'Testing',      status: 'locked',   color: '#1a3a55' },
  { id: 'n4',   x: 240, y: 55,  label: 'TypeScript',   status: 'locked',   color: '#1a3a55' },
]

const EDGES = [
  { from: 'root', to: 'n1' },
  { from: 'root', to: 'n2' },
  { from: 'n1',   to: 'n3' },
  { from: 'n2',   to: 'n4' },
]

function getNode(id) { return NODES.find(n => n.id === id) }

export default function MiniSkillTree() {
  const [hovered, setHovered] = useState(null)

  return (
    <Wrap>
      <svg width="300" height="270" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {EDGES.map(e => {
          const a = getNode(e.from), b = getNode(e.to)
          const color = a.status === 'complete' ? '#00f5ff' : a.status === 'active' ? '#7b2fff' : '#1a3a55'
          return (
            <line
              key={`${e.from}-${e.to}`}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={color}
              strokeWidth={a.status === 'locked' ? 1 : 2}
              opacity={a.status === 'locked' ? 0.2 : 0.6}
              filter={a.status !== 'locked' ? 'url(#glow)' : undefined}
            />
          )
        })}
      </svg>
      {NODES.map(n => (
        <NodeOrb
          key={n.id}
          $x={n.x}
          $y={n.y}
          $color={n.color}
          $status={n.status}
          onMouseEnter={() => setHovered(n.id)}
          onMouseLeave={() => setHovered(null)}
        >
          {n.status === 'complete' ? '✓' : n.status === 'active' ? '▶' : '○'}
          {hovered === n.id && <Tip>{n.label}</Tip>}
        </NodeOrb>
      ))}
    </Wrap>
  )
}

const Wrap = styled.div`
  position: relative;
  width: 300px;
  height: 270px;
`

const NodeOrb = styled.div`
  position: absolute;
  left: ${p => p.$x - 22}px;
  top:  ${p => p.$y - 22}px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid ${p => p.$color};
  background: ${p => p.$status === 'complete'
    ? `${p.$color}22`
    : p.$status === 'active'
    ? `${p.$color}15`
    : '#020b14'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.$color};
  font-size: ${p => p.$status === 'complete' ? '16px' : '14px'};
  cursor: pointer;
  transition: transform 0.2s;
  ${p => p.$status !== 'locked' && `animation: ${pulse} 2.5s infinite;`}
  &:hover { transform: scale(1.25); z-index: 2; }
`

const Tip = styled.div`
  position: absolute;
  bottom: 110%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(2,11,20,0.95);
  border: 1px solid rgba(0,245,255,0.25);
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 10px;
  color: #c8eeff;
  white-space: nowrap;
  font-family: 'Share Tech Mono', monospace;
  pointer-events: none;
  z-index: 10;
`
