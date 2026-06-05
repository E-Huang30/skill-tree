import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styled from 'styled-components'

const STEPS = [
  {
    num: '01',
    title: 'Tell the AI Your Goal',
    desc: 'Enter your target role and any context about your current skills. Claude maps the full learning path in under 30 seconds.',
    color: '#00f5ff',
  },
  {
    num: '02',
    title: 'Follow Your Skill Tree',
    desc: 'Work through nodes in order — each one unlocks the next. Every skill ships with curated resources so you\'re never stuck.',
    color: '#7b2fff',
  },
  {
    num: '03',
    title: 'Ship Your Career',
    desc: 'Track progress, analyze gaps, simulate pivots. Watch your tree turn green as you level up toward your target role.',
    color: '#ff2a6d',
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <Section id="how-it-works" ref={ref}>
      <Header>
        <Tag>PROCESS</Tag>
        <Title>Three steps to career clarity.</Title>
      </Header>

      <Steps>
        {STEPS.map((s, i) => (
          <Step
            key={s.num}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.14, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <StepNum $c={s.color}>{s.num}</StepNum>
            <Orb $c={s.color} />
            <StepTitle>{s.title}</StepTitle>
            <StepDesc>{s.desc}</StepDesc>
          </Step>
        ))}
      </Steps>

      <ConnectorLine />
    </Section>
  )
}

const Section = styled.section`
  padding: 80px 80px 120px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 80px;
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
`

const Steps = styled.div`
  display: flex;
  gap: 20px;
  position: relative;
  z-index: 1;
`

const Step = styled(motion.div)`
  flex: 1;
  text-align: center;
  padding: 32px 24px;
  background: rgba(255,255,255,0.015);
  border: 1px solid rgba(0,245,255,0.07);
  border-radius: 18px;
`

const StepNum = styled.div`
  font-family: 'Orbitron', sans-serif;
  font-size: 52px;
  font-weight: 800;
  color: ${p => p.$c};
  opacity: 0.15;
  line-height: 1;
  margin-bottom: 12px;
`

const Orb = styled.div`
  width: 10px; height: 10px;
  border-radius: 50%;
  background: ${p => p.$c};
  margin: 0 auto 20px;
  box-shadow: 0 0 12px ${p => p.$c};
`

const StepTitle = styled.div`
  font-family: 'Orbitron', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #c8eeff;
  margin-bottom: 14px;
  letter-spacing: 0.3px;
`

const StepDesc = styled.div`
  font-family: 'Exo 2', sans-serif;
  font-size: 14px;
  color: #3a6a85;
  line-height: 1.8;
`

const ConnectorLine = styled.div`
  display: none;
`
