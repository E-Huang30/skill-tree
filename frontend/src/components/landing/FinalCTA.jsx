import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

export default function FinalCTA() {
  const navigate = useNavigate()

  return (
    <Section>
      <RadialGlow />
      <Content>
        <Tag>START TODAY</Tag>
        <Title>Your career path is waiting.</Title>
        <Sub>
          Every senior engineer started where you are. The difference is knowing
          what to learn next — and in what order. Let the AI map it out for you.
        </Sub>
        <motion.button
          style={{
            background: 'linear-gradient(135deg,#00f5ff,#7b2fff)',
            border: 'none', borderRadius: 10,
            padding: '16px 44px',
            color: '#020b14',
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 14, fontWeight: 700,
            cursor: 'pointer', letterSpacing: 1,
            display: 'inline-block', marginBottom: 20,
          }}
          whileHover={{ scale: 1.04, boxShadow: '0 0 60px rgba(0,245,255,0.6)' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/app')}
        >
          Forge Your Path — Free
        </motion.button>
        <Fine>No credit card · No setup friction · Start in 30 seconds</Fine>
      </Content>
    </Section>
  )
}

const Section = styled.section`
  position: relative;
  padding: 120px 80px 140px;
  text-align: center;
  overflow: hidden;
`

const RadialGlow = styled.div`
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 700px; height: 500px;
  background: radial-gradient(ellipse, rgba(0,245,255,0.06) 0%, rgba(123,47,255,0.04) 40%, transparent 70%);
  pointer-events: none;
`

const Content = styled.div`
  position: relative;
  z-index: 1;
  max-width: 620px;
  margin: 0 auto;
`

const Tag = styled.div`
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  letter-spacing: 4px;
  color: #00f5ff;
  margin-bottom: 18px;
`

const Title = styled.h2`
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(28px, 5vw, 56px);
  font-weight: 800;
  color: #c8eeff;
  line-height: 1.12;
  margin-bottom: 22px;
`

const Sub = styled.p`
  font-family: 'Exo 2', sans-serif;
  font-size: 17px;
  color: #3a6a85;
  line-height: 1.75;
  margin-bottom: 40px;
`

const Fine = styled.div`
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  color: #3a6a85;
  letter-spacing: 1px;
  opacity: 0.7;
`
