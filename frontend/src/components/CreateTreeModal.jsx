import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { keyframes } from 'styled-components'
import { generateTree } from '../api/trees'

const fadeIn  = keyframes`from{opacity:0}to{opacity:1}`
const slideUp = keyframes`
  from { opacity: 0; transform: translateY(28px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
`
const spin = keyframes`from{transform:rotate(0deg)}to{transform:rotate(360deg)}`

const SUGGESTIONS = [
  'Full Stack Engineer', 'Frontend Developer', 'Backend Developer',
  'Data Scientist', 'ML Engineer', 'DevOps Engineer',
  'UI/UX Designer', 'Mobile Developer', 'Security Engineer', 'Product Manager',
]

export default function CreateTreeModal({ onClose, onCreated }) {
  const [role, setRole]       = useState('')
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    const userId = localStorage.getItem('userId')
    if (!userId || !role.trim()) return
    setLoading(true)
    setError('')
    try {
      const tree = await generateTree(userId, role.trim(), context)
      onCreated(tree)
      navigate(`/trees/${tree.id}`)
    } catch (err) {
      setError(err.message || 'Failed to generate tree. Try again.')
      setLoading(false)
    }
  }

  return (
    <Overlay onClick={e => e.target === e.currentTarget && onClose()}>
      <Modal>
        {loading ? (
          <LoadingBody>
            <Spinner />
            <LoadTitle>Building your skill tree…</LoadTitle>
            <LoadSub>Claude AI is mapping a personalized path to <em>{role}</em></LoadSub>
            <LoadSteps>
              <Step>Analyzing role requirements</Step>
              <Step>Structuring skill dependencies</Step>
              <Step>Curating learning resources</Step>
            </LoadSteps>
          </LoadingBody>
        ) : (
          <>
            <ModalHeader>
              <HeaderIcon>◈</HeaderIcon>
              <HeaderText>
                <ModalTitle>Generate Skill Tree</ModalTitle>
                <ModalSub>AI maps a personalized path from scratch to your target role</ModalSub>
              </HeaderText>
              <CloseBtn onClick={onClose}>✕</CloseBtn>
            </ModalHeader>

            <ModalBody>
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <FieldLabel>TARGET ROLE</FieldLabel>
                  <RoleInput
                    placeholder="e.g. Full Stack Engineer"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    autoFocus
                    required
                  />
                  <SuggestRow>
                    {SUGGESTIONS.map(s => (
                      <Suggest key={s} $active={role === s} onClick={() => setRole(s)}>
                        {s}
                      </Suggest>
                    ))}
                  </SuggestRow>
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel>CONTEXT <Optional>(optional)</Optional></FieldLabel>
                  <ContextArea
                    placeholder="e.g. I already know React and Python. Focus on cloud and system design."
                    value={context}
                    onChange={e => setContext(e.target.value)}
                    rows={3}
                  />
                </FieldGroup>

                {error && <ErrorMsg>{error}</ErrorMsg>}

                <ActionRow>
                  <CancelBtn type="button" onClick={onClose}>Cancel</CancelBtn>
                  <GenerateBtn type="submit" disabled={!role.trim()}>
                    Generate Tree →
                  </GenerateBtn>
                </ActionRow>
              </form>
            </ModalBody>
          </>
        )}
      </Modal>
    </Overlay>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
  animation: ${fadeIn} 0.15s ease both;
`

const Modal = styled.div`
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 20px;
  width: 540px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0,0,0,0.5);
  animation: ${slideUp} 0.22s cubic-bezier(0.16, 1, 0.3, 1) both;
`

// ── Loading state ──
const LoadingBody = styled.div`
  padding: 52px 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
`

const Spinner = styled.div`
  width: 40px; height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`

const LoadTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
`

const LoadSub = styled.div`
  font-size: 13px;
  color: var(--text2);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  em { color: var(--accent); font-style: normal; font-weight: 600; }
`

const LoadSteps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  width: 100%;
  max-width: 280px;
`

const Step = styled.div`
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 0.5px;
  font-family: 'Courier New', monospace;
  &::before { content: '▸  '; }
`

// ── Normal state ──
const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 22px 24px 18px;
  border-bottom: 1px solid var(--border);
`

const HeaderIcon = styled.div`
  font-size: 24px;
  color: var(--accent);
  flex-shrink: 0;
  margin-top: 2px;
`

const HeaderText = styled.div`flex: 1;`

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
`

const ModalSub = styled.p`
  font-size: 12px;
  color: var(--muted);
  margin-top: 3px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
`

const CloseBtn = styled.button`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 50%;
  width: 28px; height: 28px;
  cursor: pointer;
  color: var(--muted);
  font-size: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: all 0.12s;
  &:hover { color: var(--text); border-color: var(--border2); }
`

const ModalBody = styled.div`padding: 22px 24px;`

const FieldGroup = styled.div`margin-bottom: 18px;`

const FieldLabel = styled.div`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--muted);
  margin-bottom: 8px;
  font-family: 'Courier New', monospace;
`

const Optional = styled.span`
  font-weight: 400;
  color: var(--dim);
  letter-spacing: 0;
  text-transform: none;
  font-size: 9px;
`

const RoleInput = styled.input`
  width: 100%;
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 12px 14px;
  color: var(--text);
  font-size: 15px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  outline: none;
  transition: border-color 0.12s;
  &:focus { border-color: var(--accent); }
  &::placeholder { color: var(--dim); }
`

const SuggestRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
`

const Suggest = styled.button`
  type: button;
  background: ${p => p.$active ? 'var(--accent)' : 'var(--card)'};
  color: ${p => p.$active ? '#000' : 'var(--text2)'};
  border: 1px solid ${p => p.$active ? 'var(--accent)' : 'var(--border)'};
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 11px;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  transition: all 0.1s;
  &:hover { border-color: var(--accent); color: var(--accent); }
`

const ContextArea = styled.textarea`
  width: 100%;
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 12px 14px;
  color: var(--text);
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  resize: vertical;
  outline: none;
  transition: border-color 0.12s;
  &:focus { border-color: var(--accent); }
  &::placeholder { color: var(--dim); }
`

const ErrorMsg = styled.div`
  font-size: 12px;
  color: #f87171;
  margin-bottom: 14px;
  font-family: 'Courier New', monospace;
`

const ActionRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`

const CancelBtn = styled.button`
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 11px 20px;
  color: var(--muted);
  font-size: 13px;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  transition: all 0.12s;
  &:hover { border-color: var(--border2); color: var(--text); }
`

const GenerateBtn = styled.button`
  background: var(--accent);
  border: none;
  border-radius: 10px;
  padding: 11px 24px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  transition: all 0.15s;
  &:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
  &:active:not(:disabled) { transform: translateY(0); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`
