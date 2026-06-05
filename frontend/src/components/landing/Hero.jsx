import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import AnimatedCounter from '../ui/AnimatedCounter'
import GlitchText from '../ui/GlitchText'

const STATS = [
  { value: 12000, suffix: '+', label: 'TREES BUILT' },
  { value: 98000, suffix: '+', label: 'SKILLS MAPPED' },
  { value: 4200,  suffix: '+', label: 'ACTIVE USERS' },
  { value: 500,   suffix: 'K+', label: 'HOURS SAVED' },
]

function ParticleField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = canvas.offsetWidth, h = canvas.offsetHeight
    canvas.width = w; canvas.height = h

    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.4 + 0.05,
    }))

    let raf
    function draw() {
      ctx.clearRect(0, 0, w, h)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,245,255,${p.alpha})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()

    function onResize() {
      w = canvas.offsetWidth; h = canvas.offsetHeight
      canvas.width = w; canvas.height = h
    }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])

  return <PCanvas ref={canvasRef} />
}

export default function Hero() {
  const navigate = useNavigate()

  return (
    <Section>
      <ParticleField />
      <Grid />

      <Content
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Eyebrow>CAREER INTELLIGENCE PLATFORM · v2.0</Eyebrow>

        <Headline>
          <GlitchText text="Forge Your" />{' '}Career Path.<br />
          <GradientSpan>One Skill at a Time.</GradientSpan>
        </Headline>

        <Sub>
          AI-powered skill trees that map your journey from zero to hired.
          Generate a personalized roadmap, track progress, and always know
          exactly what to learn next.
        </Sub>

        <Actions>
          <motion.button
            style={{
              background: 'linear-gradient(135deg,#00f5ff,#7b2fff)',
              border: 'none', borderRadius: 8,
              padding: '14px 32px',
              color: '#020b14',
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: 1,
            }}
            whileHover={{ scale: 1.04, boxShadow: '0 0 40px rgba(0,245,255,0.5)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/app')}
          >
            Start Forging Free
          </motion.button>
          <GhostBtn href="#how-it-works">
            See How It Works ↓
          </GhostBtn>
        </Actions>
      </Content>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <StatsRow>
          {STATS.map(s => (
            <StatItem key={s.label}>
              <StatVal><AnimatedCounter target={s.value} suffix={s.suffix} /></StatVal>
              <StatLbl>{s.label}</StatLbl>
            </StatItem>
          ))}
        </StatsRow>
      </motion.div>
    </Section>
  )
}

const Section = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 100px 40px 60px;
  gap: 0;
`

const PCanvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
`

const Grid = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image:
    linear-gradient(rgba(0,245,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,245,255,0.025) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
`

const Content = styled(motion.div)`
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 840px;
  margin-bottom: 64px;
`

const Eyebrow = styled.div`
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  letter-spacing: 4px;
  color: #00f5ff;
  opacity: 0.7;
  margin-bottom: 24px;
`

const Headline = styled.h1`
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(38px, 6.5vw, 76px);
  font-weight: 800;
  color: #c8eeff;
  line-height: 1.08;
  margin-bottom: 24px;
  letter-spacing: -1px;
`

const GradientSpan = styled.span`
  background: linear-gradient(135deg, #00f5ff 0%, #7b2fff 50%, #ff2a6d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const Sub = styled.p`
  font-family: 'Exo 2', sans-serif;
  font-size: 18px;
  color: #3a6a85;
  line-height: 1.75;
  max-width: 560px;
  margin: 0 auto 40px;
`

const Actions = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`

const GhostBtn = styled.a`
  border: 1px solid rgba(0,245,255,0.2);
  border-radius: 8px;
  padding: 14px 28px;
  color: #3a6a85;
  font-family: 'Share Tech Mono', monospace;
  font-size: 12px;
  text-decoration: none;
  letter-spacing: 0.5px;
  transition: all 0.2s;
  &:hover { color: #00f5ff; border-color: rgba(0,245,255,0.5); }
`

const StatsRow = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  gap: 64px;
  justify-content: center;
  flex-wrap: wrap;
`

const StatItem = styled.div`text-align: center;`

const StatVal = styled.div`
  font-family: 'Orbitron', sans-serif;
  font-size: 34px;
  font-weight: 700;
  color: #00f5ff;
  line-height: 1;
  margin-bottom: 6px;
  text-shadow: 0 0 20px rgba(0,245,255,0.4);
`

const StatLbl = styled.div`
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  letter-spacing: 2.5px;
  color: #3a6a85;
`
