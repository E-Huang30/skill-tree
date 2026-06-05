import { useState } from 'react'
import styled from 'styled-components'
import { runSimulation } from '../api/simulate'

const PRIORITY_COLOR = { high: '#f87171', medium: '#fbbf24', low: '#4ade80' }

export default function PivotSimulatorModal({ treeId, onClose }) {
  const [targetRole, setTargetRole] = useState('')
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)
  const [result, setResult]         = useState(null)

  async function handleRun() {
    const userId = localStorage.getItem('userId')
    if (!userId || !targetRole.trim()) return
    setLoading(true)
    setError(null)
    try {
      const data = await runSimulation(userId, targetRole.trim(), treeId)
      setResult(data.analysis)
    } catch (e) {
      setError('Analysis failed — check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <Title>PIVOT SIMULATOR</Title>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </Header>

        {!result ? (
          <Body>
            <Desc>
              Analyze the skill gap between your completed skills and any target role.
              Claude will identify what transfers and what you still need to learn.
            </Desc>

            <FieldLabel>TARGET ROLE</FieldLabel>
            <Input
              placeholder="e.g. Machine Learning Engineer"
              value={targetRole}
              onChange={e => setTargetRole(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && handleRun()}
              autoFocus
            />

            {error && <ErrorMsg>{error}</ErrorMsg>}

            <RunBtn onClick={handleRun} disabled={loading || !targetRole.trim()}>
              {loading ? 'ANALYZING...' : 'RUN ANALYSIS →'}
            </RunBtn>
          </Body>
        ) : (
          <Results>
            <ReadinessRow>
              <ReadinessLabel>READINESS</ReadinessLabel>
              <ReadinessBar>
                <ReadinessFill $pct={result.overlap_percentage ?? 0} />
              </ReadinessBar>
              <ReadinessPct>{result.overlap_percentage ?? 0}%</ReadinessPct>
            </ReadinessRow>

            <MetaRow>
              <MetaChip>
                <MetaVal>{result.estimated_months ?? '?'}</MetaVal>
                <MetaLbl>EST. MONTHS</MetaLbl>
              </MetaChip>
              <MetaChip>
                <MetaVal>{result.transferable_skills?.length ?? 0}</MetaVal>
                <MetaLbl>TRANSFERABLE</MetaLbl>
              </MetaChip>
              <MetaChip>
                <MetaVal>{result.gaps?.length ?? 0}</MetaVal>
                <MetaLbl>GAPS</MetaLbl>
              </MetaChip>
            </MetaRow>

            {result.summary && <Summary>{result.summary}</Summary>}

            {result.transferable_skills?.length > 0 && (
              <Section>
                <SectionTitle $color="#4ade80">✓ TRANSFERABLE SKILLS</SectionTitle>
                <ChipGroup>
                  {result.transferable_skills.map((s, i) => (
                    <GreenChip key={i}>{s}</GreenChip>
                  ))}
                </ChipGroup>
              </Section>
            )}

            {result.gaps?.length > 0 && (
              <Section>
                <SectionTitle $color="#f87171">△ SKILLS TO ACQUIRE</SectionTitle>
                <GapList>
                  {result.gaps.map((g, i) => (
                    <GapItem key={i}>
                      <GapName>{g.skill}</GapName>
                      <GapMeta>
                        <PriorityTag $c={PRIORITY_COLOR[g.priority] || '#8090b0'}>
                          {(g.priority || 'medium').toUpperCase()}
                        </PriorityTag>
                        {g.estimated_hours && (
                          <GapHours>{g.estimated_hours}h</GapHours>
                        )}
                      </GapMeta>
                    </GapItem>
                  ))}
                </GapList>
              </Section>
            )}

            <ResetBtn onClick={() => { setResult(null); setTargetRole('') }}>
              ← RUN ANOTHER
            </ResetBtn>
          </Results>
        )}
      </Modal>
    </Overlay>
  )
}

// ── Styles ──────────────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
  backdrop-filter: blur(2px);
`

const Modal = styled.div`
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  width: 520px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Courier New', monospace;
`

const Header = styled.div`
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`

const Title = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 2.5px;
`

const CloseBtn = styled.button`
  background: none; border: none; cursor: pointer;
  color: var(--muted); font-size: 13px;
  &:hover { color: var(--text); }
`

const Body = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const Desc = styled.p`
  font-size: 9px;
  color: var(--muted);
  line-height: 1.8;
  letter-spacing: 0.3px;
`

const FieldLabel = styled.div`
  font-size: 7px;
  color: var(--dim);
  letter-spacing: 2.5px;
`

const Input = styled.input`
  background: var(--card);
  border: 1px solid var(--border2);
  border-radius: 4px;
  padding: 10px 12px;
  color: var(--text);
  font-size: 11px;
  font-family: inherit;
  outline: none;
  &:focus { border-color: var(--accent); }
  &::placeholder { color: var(--dim); }
`

const ErrorMsg = styled.div`
  font-size: 9px;
  color: #f87171;
  letter-spacing: 0.5px;
`

const RunBtn = styled.button`
  background: ${p => p.disabled ? 'transparent' : 'var(--card)'};
  border: 1px solid ${p => p.disabled ? 'var(--border)' : 'var(--accent)'};
  border-radius: 4px;
  color: ${p => p.disabled ? 'var(--dim)' : 'var(--accent)'};
  font-family: inherit;
  font-size: 9px;
  padding: 11px;
  cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
  letter-spacing: 2px;
  transition: all 0.12s;
  &:hover:not(:disabled) { background: var(--panel); }
`

const Results = styled.div`
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: var(--border); }
`

const ReadinessRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const ReadinessLabel = styled.div`
  font-size: 7px;
  color: var(--muted);
  letter-spacing: 2px;
  flex-shrink: 0;
`

const ReadinessBar = styled.div`
  flex: 1;
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
`

const ReadinessFill = styled.div`
  height: 100%;
  width: ${p => p.$pct}%;
  background: ${p => p.$pct >= 70 ? '#4ade80' : p.$pct >= 40 ? '#fbbf24' : '#f87171'};
  border-radius: 2px;
  transition: width 0.4s;
`

const ReadinessPct = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: var(--text);
  flex-shrink: 0;
`

const MetaRow = styled.div`
  display: flex;
  gap: 10px;
`

const MetaChip = styled.div`
  flex: 1;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 10px 8px;
  text-align: center;
`

const MetaVal = styled.div`font-size: 16px; font-weight: 700; color: var(--accent);`
const MetaLbl = styled.div`font-size: 7px; color: var(--muted); letter-spacing: 1.5px; margin-top: 3px;`

const Summary = styled.p`
  font-size: 9px;
  color: var(--text2);
  line-height: 1.9;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 12px;
`

const Section = styled.div`display: flex; flex-direction: column; gap: 8px;`

const SectionTitle = styled.div`
  font-size: 8px;
  font-weight: 700;
  color: ${p => p.$color};
  letter-spacing: 2px;
`

const ChipGroup = styled.div`display: flex; flex-wrap: wrap; gap: 5px;`

const GreenChip = styled.div`
  background: #0a1e12;
  border: 1px solid #1a5030;
  border-radius: 3px;
  padding: 3px 8px;
  font-size: 9px;
  color: #4ade80;
`

const GapList = styled.div`display: flex; flex-direction: column; gap: 5px;`

const GapItem = styled.div`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const GapName = styled.div`font-size: 9px; color: var(--text2);`
const GapMeta = styled.div`display: flex; align-items: center; gap: 6px;`

const PriorityTag = styled.div`
  font-size: 7px;
  letter-spacing: 1px;
  color: ${p => p.$c};
  border: 1px solid ${p => p.$c}44;
  border-radius: 3px;
  padding: 2px 6px;
`

const GapHours = styled.div`font-size: 8px; color: var(--muted);`

const ResetBtn = styled.button`
  background: none;
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--muted);
  font-family: inherit;
  font-size: 8px;
  padding: 8px;
  cursor: pointer;
  letter-spacing: 1.5px;
  &:hover { color: var(--text2); border-color: var(--border2); }
`
