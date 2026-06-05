import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

export default function Footer() {
  const navigate = useNavigate()

  return (
    <Foot>
      <Inner>
        <Left>
          <Brand>
            <BrandHex>⬡</BrandHex>
            <BrandName>SkillForge OS</BrandName>
          </Brand>
          <Tagline>Map your career path. One skill at a time.</Tagline>
          <Built>Built with Claude AI · React · v2.0</Built>
        </Left>

        <LinkGroups>
          <Group>
            <GTitle>Product</GTitle>
            <GLink href="#features">Features</GLink>
            <GLink href="#how-it-works">How It Works</GLink>
            <GLink href="#pricing">Pricing</GLink>
          </Group>
          <Group>
            <GTitle>App</GTitle>
            <GBtn onClick={() => navigate('/app')}>Dashboard</GBtn>
            <GBtn onClick={() => navigate('/app')}>Build Tree</GBtn>
            <GBtn onClick={() => navigate('/app')}>Pivot Simulator</GBtn>
          </Group>
        </LinkGroups>
      </Inner>

      <Bottom>
        <Copy>© 2026 SkillForge OS. All rights reserved.</Copy>
        <EasterEggHint title="Try: ↑↑↓↓←→←→BA">
          // there are secrets here
        </EasterEggHint>
      </Bottom>
    </Foot>
  )
}

const Foot = styled.footer`
  border-top: 1px solid rgba(0,245,255,0.07);
  padding: 60px 80px 32px;
  max-width: 1200px;
  margin: 0 auto;
`

const Inner = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 48px;
  flex-wrap: wrap;
  gap: 40px;
`

const Left = styled.div`max-width: 320px;`

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`

const BrandHex = styled.span`
  font-size: 22px;
  color: #00f5ff;
  filter: drop-shadow(0 0 4px #00f5ff88);
`

const BrandName = styled.span`
  font-family: 'Orbitron', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #c8eeff;
`

const Tagline = styled.div`
  font-family: 'Exo 2', sans-serif;
  font-size: 13px;
  color: #3a6a85;
  margin-bottom: 8px;
  line-height: 1.5;
`

const Built = styled.div`
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  color: rgba(58,106,133,0.5);
  letter-spacing: 0.5px;
`

const LinkGroups = styled.div`
  display: flex;
  gap: 60px;
`

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const GTitle = styled.div`
  font-family: 'Orbitron', sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: #c8eeff;
  letter-spacing: 2px;
  margin-bottom: 4px;
`

const GLink = styled.a`
  font-family: 'Exo 2', sans-serif;
  font-size: 13px;
  color: #3a6a85;
  text-decoration: none;
  transition: color 0.2s;
  &:hover { color: #00f5ff; }
`

const GBtn = styled.button`
  font-family: 'Exo 2', sans-serif;
  font-size: 13px;
  color: #3a6a85;
  background: none;
  border: none;
  padding: 0;
  text-align: left;
  cursor: pointer;
  transition: color 0.2s;
  &:hover { color: #00f5ff; }
`

const Bottom = styled.div`
  border-top: 1px solid rgba(0,245,255,0.05);
  padding-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Copy = styled.div`
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  color: rgba(58,106,133,0.6);
  letter-spacing: 0.5px;
`

const EasterEggHint = styled.div`
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  color: rgba(0,245,255,0.12);
  letter-spacing: 1px;
  cursor: default;
  user-select: none;
  &:hover { color: rgba(0,245,255,0.3); }
`
