import styled from 'styled-components'

const STEPS = [
  { n: '01', label: 'Generate a Tree', desc: 'Type your target role (e.g. "Full Stack Engineer") and Claude AI builds a personalized skill tree with 8–15 connected nodes.' },
  { n: '02', label: 'Start at the Bottom', desc: 'The tree grows upward. Root nodes at the bottom are your entry points — click any lit node to see resources and begin.' },
  { n: '03', label: 'Work Through Skills', desc: 'Each node has curated resources (courses, videos, articles). A "START HERE" link in the inspector panel points you to the first step.' },
  { n: '04', label: 'Mark Complete', desc: 'When you finish a skill, mark it complete in the inspector. The tree auto-unlocks the next nodes and opens them for you.' },
  { n: '05', label: 'Pivot anytime', desc: 'Use the Pivot Simulator to analyze your current skills against any new target role — see your readiness score, transferable skills, and gaps.' },
]

const FEATURES = [
  { icon: '◈', label: 'AI Tree Generation', desc: 'Tailored to any role, with optional context for specializations.' },
  { icon: '→', label: 'Auto-Progression', desc: 'Completing a node automatically unlocks and highlights the next step.' },
  { icon: '▶', label: 'Resource Links', desc: 'Every node ships with start-here resources so you\'re never stuck wondering where to begin.' },
  { icon: '⊞', label: 'Branch Paths', desc: 'Fork into specializations when skills diverge — visible as colored branch lines on the map.' },
  { icon: '↗', label: 'Pivot Simulator', desc: 'Gap analysis between your current skill set and any new target role.' },
  { icon: '◉', label: 'Multiple Trees', desc: 'Track parallel career paths side by side in the sidebar.' },
]

export default function AboutModal({ onClose }) {
  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <div>
            <Title>BLUESCRIPT / SKILL OS</Title>
            <Sub>Career Navigator powered by Claude AI</Sub>
          </div>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </Header>

        <Scroll>
          <GoalBlock>
            <GoalLabel>THE GOAL</GoalLabel>
            <GoalText>
              Replace scattered, random learning with a structured path. Instead of jumping between
              tutorials and wondering what to study next, you get a clear skill graph — from where
              you are today to the role you want — with measurable, visible progress.
            </GoalText>
          </GoalBlock>

          <SectionHead>HOW IT WORKS</SectionHead>
          <StepList>
            {STEPS.map(s => (
              <StepItem key={s.n}>
                <StepNum>{s.n}</StepNum>
                <StepBody>
                  <StepLabel>{s.label}</StepLabel>
                  <StepDesc>{s.desc}</StepDesc>
                </StepBody>
              </StepItem>
            ))}
          </StepList>

          <SectionHead>FEATURES</SectionHead>
          <FeatureGrid>
            {FEATURES.map(f => (
              <FeatureCard key={f.label}>
                <FeatureIcon>{f.icon}</FeatureIcon>
                <FeatureLabel>{f.label}</FeatureLabel>
                <FeatureDesc>{f.desc}</FeatureDesc>
              </FeatureCard>
            ))}
          </FeatureGrid>

          <Footer>
            Built with Claude AI (claude-sonnet-4-6) · Nodes unlock as you progress ·
            Each skill includes real resources to get started immediately.
          </Footer>
        </Scroll>
      </Modal>
    </Overlay>
  )
}

// ── Styles ──────────────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.75);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
  backdrop-filter: blur(2px);
`

const Modal = styled.div`
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  width: 580px;
  max-height: 82vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Courier New', monospace;
`

const Header = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-shrink: 0;
`

const Title = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 2.5px;
`

const Sub = styled.div`
  font-size: 8px;
  color: var(--muted);
  letter-spacing: 1.5px;
  margin-top: 3px;
`

const CloseBtn = styled.button`
  background: none; border: none; cursor: pointer;
  color: var(--muted); font-size: 13px;
  &:hover { color: var(--text); }
`

const Scroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: var(--border); }
`

const GoalBlock = styled.div`
  background: var(--card);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: 4px;
  padding: 14px 16px;
`

const GoalLabel = styled.div`
  font-size: 7px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 3px;
  margin-bottom: 8px;
`

const GoalText = styled.p`
  font-size: 9px;
  color: var(--text2);
  line-height: 1.9;
`

const SectionHead = styled.div`
  font-size: 7px;
  font-weight: 700;
  color: var(--muted);
  letter-spacing: 3px;
  border-bottom: 1px solid var(--border);
  padding-bottom: 6px;
`

const StepList = styled.div`display: flex; flex-direction: column; gap: 10px;`

const StepItem = styled.div`
  display: flex;
  gap: 14px;
  align-items: flex-start;
`

const StepNum = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: var(--border2);
  line-height: 1;
  flex-shrink: 0;
  width: 28px;
`

const StepBody = styled.div``

const StepLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 3px;
`

const StepDesc = styled.div`
  font-size: 9px;
  color: var(--text2);
  line-height: 1.8;
`

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`

const FeatureCard = styled.div`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 12px;
`

const FeatureIcon = styled.div`
  font-size: 14px;
  color: var(--accent);
  margin-bottom: 5px;
`

const FeatureLabel = styled.div`
  font-size: 9px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
`

const FeatureDesc = styled.div`
  font-size: 8px;
  color: var(--muted);
  line-height: 1.7;
`

const Footer = styled.div`
  font-size: 8px;
  color: var(--dim);
  letter-spacing: 0.5px;
  line-height: 1.8;
  text-align: center;
  padding-top: 4px;
`
