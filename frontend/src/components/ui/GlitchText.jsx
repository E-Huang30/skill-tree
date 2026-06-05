import styled, { keyframes } from 'styled-components'

const glitch1 = keyframes`
  0%, 90%, 100% { clip-path: inset(100% 0 0 0); transform: translate(0); }
  92% { clip-path: inset(33% 0 45% 0); transform: translate(-3px, 1px); }
  94% { clip-path: inset(10% 0 75% 0); transform: translate(3px, -1px); }
  96% { clip-path: inset(70% 0 10% 0); transform: translate(-1px, 2px); }
  98% { clip-path: inset(50% 0 20% 0); transform: translate(1px, -2px); }
`

const glitch2 = keyframes`
  0%, 90%, 100% { clip-path: inset(0 0 100% 0); transform: translate(0); }
  92% { clip-path: inset(45% 0 33% 0); transform: translate(3px, -1px); }
  94% { clip-path: inset(75% 0 10% 0); transform: translate(-2px, 1px); }
  96% { clip-path: inset(10% 0 70% 0); transform: translate(1px, -2px); }
  98% { clip-path: inset(20% 0 50% 0); transform: translate(-1px, 2px); }
`

export default function GlitchText({ text, className }) {
  return (
    <Root className={className}>
      <Main>{text}</Main>
      <Layer1 aria-hidden="true">{text}</Layer1>
      <Layer2 aria-hidden="true">{text}</Layer2>
    </Root>
  )
}

const Root = styled.span`
  position: relative;
  display: inline-block;
`

const Main = styled.span`
  position: relative;
  z-index: 1;
`

const Layer1 = styled.span`
  position: absolute;
  inset: 0;
  color: #00f5ff;
  animation: ${glitch1} 4s infinite;
`

const Layer2 = styled.span`
  position: absolute;
  inset: 0;
  color: #ff2a6d;
  animation: ${glitch2} 4s infinite;
  animation-delay: 0.15s;
`
