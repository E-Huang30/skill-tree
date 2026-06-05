import styled, { keyframes } from 'styled-components'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`

const CARDS = [
  {
    icon: '◈',
    color: '#60a5fa',
    title: 'AI-Generated Trees',
    desc: 'Tell Claude your target role and it maps a full skill path — 8 to 15 connected nodes — with realistic hour estimates.',
  },
  {
    icon: '→',
    color: '#4ade80',
    title: 'Auto-Progression',
    desc: 'Completing a skill automatically unlocks the next nodes and opens them for you. Always know what\'s next.',
  },
  {
    icon: '▶',
    color: '#fbbf24',
    title: 'Curated Resources',
    desc: 'Every node includes a "Start Here" link — courses, videos, and articles — so you\'re never lost on where to begin.',
  },
  {
    icon: '↗',
    color: '#f87171',
    title: 'Pivot Simulator',
    desc: 'Analyze your skill gap to any new target role. See readiness %, transferable skills, and exactly what to learn.',
  },
]

export default function Dashboard() {
  return (
    <Page>
      <Hero>
        <HeroLabel>BLUESCRIPT / SKILL OS</HeroLabel>
        <HeroTitle>Map your career path.<br />One skill at a time.</HeroTitle>
        <HeroSub>
          Generate a personalized skill tree for any role — then work through it,
          node by node, with resources at every step.
        </HeroSub>
        <Cta>← Select a tree or generate a new one from the sidebar</Cta>
      </Hero>

      <Grid>
        {CARDS.map((c, i) => (
          <FeatureCard key={c.title} $delay={i * 60}>
            <CardIcon $c={c.color}>{c.icon}</CardIcon>
            <CardTitle>{c.title}</CardTitle>
            <CardDesc>{c.desc}</CardDesc>
          </FeatureCard>
        ))}
      </Grid>
    </Page>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const Page = styled.div`
  flex: 1;
  height: 100%;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 48px;
  padding: 40px 48px;
  overflow-y: auto;
`

const Hero = styled.div`
  text-align: center;
  animation: ${fadeUp} 0.4s ease both;
`

const HeroLabel = styled.div`
  font-size: 9px;
  letter-spacing: 3px;
  color: var(--muted);
  font-family: 'Courier New', monospace;
  margin-bottom: 14px;
`

const HeroTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.2;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  margin-bottom: 14px;
`

const HeroSub = styled.p`
  font-size: 15px;
  color: var(--text2);
  max-width: 480px;
  line-height: 1.7;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  margin: 0 auto 20px;
`

const Cta = styled.div`
  font-size: 11px;
  color: var(--accent);
  letter-spacing: 0.5px;
  font-family: 'Courier New', monospace;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  width: 100%;
  max-width: 640px;
  animation: ${fadeUp} 0.4s 0.1s ease both;
`

const FeatureCard = styled.div`
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px;
  animation: ${fadeUp} 0.4s ${p => p.$delay}ms ease both;
  transition: border-color 0.15s, transform 0.15s;
  &:hover {
    border-color: var(--border2);
    transform: translateY(-2px);
  }
`

const CardIcon = styled.div`
  font-size: 22px;
  color: ${p => p.$c};
  margin-bottom: 10px;
`

const CardTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 6px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
`

const CardDesc = styled.div`
  font-size: 11px;
  color: var(--text2);
  line-height: 1.7;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
`
