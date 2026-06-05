import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styled from 'styled-components'

const FEATURES = [
  { icon: '◈', color: '#00f5ff', title: 'AI Skill Trees', desc: 'Generate a personalized 8–15 node skill roadmap for any tech role in under 30 seconds.' },
  { icon: '→', color: '#7b2fff', title: 'Auto-Progression', desc: 'Finish a skill and the next one opens automatically. Always know what to tackle next.' },
  { icon: '▶', color: '#ff2a6d', title: 'Curated Resources', desc: 'Every node includes a "Start Here" link — the best course, video, or doc for that skill.' },
  { icon: '↗', color: '#ffd700', title: 'Pivot Simulator', desc: 'Switching roles? See your readiness %, transferable skills, and exact gaps to close.' },
  { icon: '⬡', color: '#00f5ff', title: 'Visual Skill Map', desc: 'Interactive canvas with color-coded branches. Your career path rendered as a game tree.' },
  { icon: '○', color: '#7b2fff', title: 'Progress Tracking', desc: 'Track hours, completion %, and time estimates. Know exactly when you\'ll be job-ready.' },
]

export default function FeaturesGrid() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <Section ref={ref}>
      <Header>
        <Tag>CAPABILITIES</Tag>
        <Title>Everything you need to level up.</Title>
        <Subtitle>Six core tools, one unified system.</Subtitle>
      </Header>
      <Grid>
        {FEATURES.map((f, i) => (
          <Card
            key={f.title}
            $color={f.color}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.08, duration: 0.55 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
          >
            <CardTop>
              <CIcon $c={f.color}>{f.icon}</CIcon>
            </CardTop>
            <CTitle>{f.title}</CTitle>
            <CDesc>{f.desc}</CDesc>
            <Glow $c={f.color} />
          </Card>
        ))}
      </Grid>
    </Section>
  )
}

const Section = styled.section`
  padding: 80px 80px 120px;
  max-width: 1200px;
  margin: 0 auto;
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 64px;
`

const Tag = styled.div`
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  letter-spacing: 4px;
  color: #00f5ff;
  margin-bottom: 14px;
`

const Title = styled.h2`
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(24px, 3vw, 42px);
  font-weight: 700;
  color: #c8eeff;
  margin-bottom: 10px;
`

const Subtitle = styled.div`
  font-family: 'Exo 2', sans-serif;
  font-size: 15px;
  color: #3a6a85;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 580px)  { grid-template-columns: 1fr; }
`

const Card = styled(motion.div)`
  position: relative;
  background: rgba(255,255,255,0.015);
  border: 1px solid rgba(0,245,255,0.07);
  border-radius: 18px;
  padding: 30px;
  overflow: hidden;
  &:hover { border-color: ${p => p.$color}44; }
  transition: border-color 0.25s;
`

const CardTop = styled.div`margin-bottom: 16px;`

const CIcon = styled.div`
  font-size: 30px;
  color: ${p => p.$c};
  filter: drop-shadow(0 0 6px ${p => p.$c}88);
`

const CTitle = styled.div`
  font-family: 'Orbitron', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #c8eeff;
  margin-bottom: 8px;
  letter-spacing: 0.3px;
`

const CDesc = styled.div`
  font-family: 'Exo 2', sans-serif;
  font-size: 13px;
  color: #3a6a85;
  line-height: 1.75;
`

const Glow = styled.div`
  position: absolute;
  bottom: -40px; right: -40px;
  width: 120px; height: 120px;
  border-radius: 50%;
  background: ${p => p.$c};
  opacity: 0.04;
  filter: blur(40px);
  pointer-events: none;
`
