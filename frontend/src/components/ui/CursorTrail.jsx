import { useEffect, useRef } from 'react'

export default function CursorTrail() {
  const frameRef = useRef(null)

  useEffect(() => {
    const TRAIL = 14
    const dots = Array.from({ length: TRAIL }, (_, i) => {
      const el = document.createElement('div')
      const size = 8 - i * 0.4
      el.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: #00f5ff;
        pointer-events: none;
        z-index: 9998;
        transform: translate(-50%, -50%);
        mix-blend-mode: screen;
        transition: opacity 0.05s;
      `
      document.body.appendChild(el)
      return el
    })

    let mouseX = -200, mouseY = -200
    const positions = Array(TRAIL).fill(null).map(() => ({ x: -200, y: -200 }))

    function onMouseMove(e) {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    function animate() {
      positions[0].x = mouseX
      positions[0].y = mouseY
      for (let i = 1; i < TRAIL; i++) {
        positions[i].x += (positions[i - 1].x - positions[i].x) * 0.3
        positions[i].y += (positions[i - 1].y - positions[i].y) * 0.3
      }
      dots.forEach((dot, i) => {
        const alpha = (1 - i / TRAIL) * 0.75
        dot.style.left    = `${positions[i].x}px`
        dot.style.top     = `${positions[i].y}px`
        dot.style.opacity = `${alpha}`
      })
      frameRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove)
    animate()

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(frameRef.current)
      dots.forEach(d => d.remove())
    }
  }, [])

  return null
}
