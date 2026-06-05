import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styled from 'styled-components'
import MiniSkillTree from '../ui/MiniSkillTree'

export default function BuildYourGoal() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <Section id="features" ref={ref}>
      <Inner>
        <TextSide
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          initial={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Tag>PERSONALIZED ROADMAPS</Tag>
          <Title>Build your path to any role — in seconds.</Title>
          <Body>
            Tell our AI your target role. Get a full skill tree with 8–15 connected nodes,
            each with curated resources and realistic time estimates. Then work through it,
            one skill at a time.
          </Body>
          <FeatureList>
            {[
              ['→', 'AI maps the exact skills for your target role'],
              ['→', 'Auto-progression unlocks the next step when you finish'],
              ['→', 'Curated "Start Here" resources at every node'],
              ['→', 'Gap analysis for career pivots'],
            ].map(([icon, text]) => (
              <FeatureRow key={text}>
                <FIcon>{icon}</FIcon>
                <FText>{text}</FText>
              </FeatureRow>
            ))}
          </FeatureList>
        </TextSide>

        <TreeSide
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          initial={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <TreeBox>
            <BoxLabel>LIVE TREE PREVIEW</BoxLabel>
            <MiniSkillTree />
            <BoxCaption>Hover nodes to explore · Green = complete · Purple = active</BoxCaption>
          </TreeBox>
        </TreeSide>
      </Inner>
    </Section>
  )
}

const Section = styled.section`
  padding: 100px 80px;
  max-width: 1200px;
  margin: 0 auto;
`

const Inner = styled.div`
  display: flex;
  gap: 80px;
  align-items: center;
  @media (max-width: 900px) { flex-direction: column; }
`

const TextSide = styled(motion.div)`flex: 1; min-width: 0;`

const TreeSide = styled(motion.div)`
  flex-shrink: 0;
  display: flex;
  justify-content: center;
`

const Tag = styled.div`
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  letter-spacing: 4px;
  color: #00f5ff;
  margin-bottom: 16px;
`

const Title = styled.h2`
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(22px, 3vw, 36px);
  font-weight: 700;
  color: #c8eeff;
  line-height: 1.2;
  margin-bottom: 20px;
`

const Body = styled.p`
  font-family: 'Exo 2', sans-serif;
  font-size: 15px;
  color: #3a6a85;
  line-height: 1.8;
  margin-bottom: 28px;
`

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const FeatureRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`

const FIcon = styled.span`
  color: #00f5ff;
  font-size: 13px;
  margin-top: 1px;
  flex-shrink: 0;
`

const FText = styled.span`
  font-family: 'Exo 2', sans-serif;
  font-size: 14px;
  color: #c8eeff;
  line-height: 1.5;
`

const TreeBox = styled.div`
  background: rgba(0,245,255,0.02);
  border: 1px solid rgba(0,245,255,0.1);
  border-radius: 20px;
  padding: 28px 28px 20px;
`

const BoxLabel = styled.div`
  font-family: 'Share Tech Mono', monospace;
  font-size: 9px;
  letter-spacing: 3px;
  color: #00f5ff;
  opacity: 0.5;
  margin-bottom: 16px;
`

const BoxCaption = styled.div`
  font-family: 'Share Tech Mono', monospace;
  font-size: 8px;
  letter-spacing: 1px;
  color: #3a6a85;
  margin-top: 12px;
  text-align: center;
  opacity: 0.6;
`
