import { useEffect, useRef } from 'react'
import styled from 'styled-components'

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF></?'

export default function MatrixRain({ active }) {
  const canvasRef = useRef(null)
  const animRef   = useRef(null)

  useEffect(() => {
    if (!active) {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      return
    }
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    const cols   = Math.floor(canvas.width / 16)
    const drops  = Array(cols).fill(1)

    function draw() {
      ctx.fillStyle = 'rgba(2,11,20,0.06)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      drops.forEach((y, i) => {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        ctx.fillStyle = y === 1 ? '#ffffff' : Math.random() > 0.95 ? '#7b2fff' : '#00f5ff'
        ctx.font = '14px "Share Tech Mono", monospace'
        ctx.fillText(char, i * 16, y * 16)
        if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      })
      animRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [active])

  if (!active) return null
  return <Canvas ref={canvasRef} />
}

const Canvas = styled.canvas`
  position: fixed;
  inset: 0;
  z-index: 9000;
  pointer-events: none;
`
