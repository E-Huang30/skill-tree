import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const FREE = [
  '3 AI-generated skill trees',
  'Full progress tracking',
  'Curated resource links',
  'Auto-progression system',
  '2 pivot simulations / month',
]

const PRO = [
  'Unlimited skill trees',
  'Priority AI generation',
  'Full progress tracking',
  'Curated resource links',
  'Unlimited pivot simulations',
  'Export to PDF & JSON',
  'Team workspaces (soon)',
]

export default function PricingTeaser() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const navigate = useNavigate()

  return (
    <Section id="pricing" ref={ref}>
      <Header>
        <Tag>PRICING</Tag>
        <Title>Free forever. Pro when you're ready.</Title>
        <Subtitle>No credit card required to start.</Subtitle>
      </Header>

      <Cards>
        <PCard
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <PName>Free</PName>
          <PPrice>$0</PPrice>
          <PSub>Perfect for getting started</PSub>
          <PList>
            {FREE.map(f => <PItem key={f}><Check>✓</Check>{f}</PItem>)}
          </PList>
          <PBtn $outline onClick={() => navigate('/app')}>
            Get Started Free
          </PBtn>
        </PCard>

        <PCard
          $pro
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.12, duration: 0.55 }}
          whileHover={{ boxShadow: '0 0 60px rgba(0,245,255,0.12)', transition: { duration: 0.2 } }}
        >
          <ProPill>MOST POPULAR</ProPill>
          <PName $pro>Pro</PName>
          <PPrice>
            $12
            <Per>/mo</Per>
          </PPrice>
          <PSub>For serious career builders</PSub>
          <PList>
            {PRO.map(f => <PItem key={f}><Check $pro>✓</Check>{f}</PItem>)}
          </PList>
          <PBtn $primary onClick={() => navigate('/app')}>
            Start 7-Day Free Trial
          </PBtn>
        </PCard>
      </Cards>
    </Section>
  )
}

const Section = styled.section`
  padding: 80px 80px 120px;
  max-width: 900px;
  margin: 0 auto;
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
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
  font-size: 14px;
  color: #3a6a85;
`

const Cards = styled.div`
  display: flex;
  gap: 24px;
  justify-content: center;
  @media (max-width: 700px) { flex-direction: column; align-items: center; }
`

const PCard = styled(motion.div)`
  position: relative;
  width: 340px;
  background: ${p => p.$pro ? 'rgba(0,245,255,0.03)' : 'rgba(255,255,255,0.02)'};
  border: 1px solid ${p => p.$pro ? 'rgba(0,245,255,0.25)' : 'rgba(0,245,255,0.07)'};
  border-radius: 20px;
  padding: 36px;
`

const ProPill = styled.div`
  position: absolute;
  top: -1px;
  right: 28px;
  background: linear-gradient(135deg, #00f5ff, #7b2fff);
  color: #020b14;
  font-family: 'Share Tech Mono', monospace;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 2px;
  padding: 4px 10px;
  border-radius: 0 0 8px 8px;
`

const PName = styled.div`
  font-family: 'Orbitron', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: ${p => p.$pro ? '#00f5ff' : '#c8eeff'};
  margin-bottom: 8px;
`

const PPrice = styled.div`
  font-family: 'Orbitron', sans-serif;
  font-size: 44px;
  font-weight: 800;
  color: #c8eeff;
  margin-bottom: 6px;
  line-height: 1;
`

const Per = styled.span`
  font-size: 16px;
  color: #3a6a85;
  font-weight: 400;
`

const PSub = styled.div`
  font-family: 'Exo 2', sans-serif;
  font-size: 13px;
  color: #3a6a85;
  margin-bottom: 24px;
`

const PList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;
  margin-bottom: 28px;
`

const PItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-family: 'Exo 2', sans-serif;
  font-size: 13px;
  color: #c8eeff;
`

const Check = styled.span`
  color: ${p => p.$pro ? '#00f5ff' : '#7b2fff'};
  font-size: 12px;
  flex-shrink: 0;
  margin-top: 1px;
`

const PBtn = styled.button`
  width: 100%;
  border-radius: 8px;
  padding: 13px;
  font-family: 'Orbitron', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s;

  ${p => p.$primary ? `
    background: linear-gradient(135deg, #00f5ff, #7b2fff);
    border: none;
    color: #020b14;
    &:hover { filter: brightness(1.1); box-shadow: 0 0 24px rgba(0,245,255,0.4); }
  ` : `
    background: transparent;
    border: 1px solid rgba(0,245,255,0.25);
    color: #00f5ff;
    &:hover { background: rgba(0,245,255,0.06); border-color: rgba(0,245,255,0.5); }
  `}
`
