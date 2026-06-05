import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styled from 'styled-components'
import AnimatedCounter from '../ui/AnimatedCounter'

const COUNTERS = [
  { value: 12847, suffix: '',   label: 'Trees Generated' },
  { value: 98300, suffix: '+',  label: 'Skills Mapped' },
  { value: 4200,  suffix: '+',  label: 'Active Learners' },
  { value: 523,   suffix: 'K',  label: 'Hours Invested' },
]

const TESTIMONIALS = [
  {
    quote: "Generated a full React → Staff Engineer roadmap in 20 seconds. It nailed exactly what I needed to learn and in what order.",
    name: "Alex K.",
    role: "Frontend Engineer",
    color: '#00f5ff',
  },
  {
    quote: "The pivot simulator showed me I had only a 3-week skill gap to switch into DevOps. Completely changed my game plan.",
    name: "Sam T.",
    role: "Backend → DevOps",
    color: '#7b2fff',
  },
  {
    quote: "It's like having a senior engineer draw out your career roadmap, then stay accountable with you every step of the way.",
    name: "Jordan R.",
    role: "CS Student",
    color: '#ff2a6d',
  },
]

export default function SocialProof() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <Section ref={ref}>
      <CountRow>
        {COUNTERS.map((c, i) => (
          <CountItem
            key={c.label}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.55 }}
          >
            <CVal><AnimatedCounter target={c.value} suffix={c.suffix} /></CVal>
            <CLbl>{c.label}</CLbl>
          </CountItem>
        ))}
      </CountRow>

      <TRow>
        {TESTIMONIALS.map((t, i) => (
          <TCard
            key={t.name}
            $c={t.color}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.55 }}
          >
            <TStripe $c={t.color} />
            <Quote>"{t.quote}"</Quote>
            <Author>
              <AName $c={t.color}>{t.name}</AName>
              <ARole>{t.role}</ARole>
            </Author>
          </TCard>
        ))}
      </TRow>
    </Section>
  )
}

const Section = styled.section`
  padding: 80px 80px 120px;
  max-width: 1200px;
  margin: 0 auto;
`

const CountRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 80px;
  margin-bottom: 80px;
  flex-wrap: wrap;
`

const CountItem = styled(motion.div)`text-align: center;`

const CVal = styled.div`
  font-family: 'Orbitron', sans-serif;
  font-size: 44px;
  font-weight: 700;
  color: #00f5ff;
  line-height: 1;
  margin-bottom: 8px;
  text-shadow: 0 0 24px rgba(0,245,255,0.4);
`

const CLbl = styled.div`
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  letter-spacing: 2px;
  color: #3a6a85;
`

const TRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`

const TCard = styled(motion.div)`
  position: relative;
  background: rgba(255,255,255,0.015);
  border: 1px solid rgba(0,245,255,0.07);
  border-radius: 16px;
  padding: 28px;
  overflow: hidden;
`

const TStripe = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: ${p => p.$c};
  opacity: 0.6;
`

const Quote = styled.div`
  font-family: 'Exo 2', sans-serif;
  font-size: 14px;
  color: #c8eeff;
  line-height: 1.8;
  margin-bottom: 20px;
  font-style: italic;
`

const Author = styled.div``

const AName = styled.div`
  font-family: 'Orbitron', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${p => p.$c};
`

const ARole = styled.div`
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  color: #3a6a85;
  margin-top: 3px;
  letter-spacing: 0.5px;
`
