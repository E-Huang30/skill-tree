import { useEffect, useState } from 'react'
import styled from 'styled-components'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement
      const scrolled = el.scrollTop || document.body.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return <Bar style={{ width: `${progress}%` }} />
}

const Bar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, #00f5ff, #7b2fff, #ff2a6d);
  z-index: 9999;
  transition: width 0.1s linear;
  box-shadow: 0 0 8px #00f5ff88;
  pointer-events: none;
`
