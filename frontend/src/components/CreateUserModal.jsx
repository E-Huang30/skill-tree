import { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { createUser } from '../api/users'

const fadeIn  = keyframes`from{opacity:0}to{opacity:1}`
const slideUp = keyframes`
  from { opacity: 0; transform: translateY(28px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
`

const FEATURES = [
  { icon: '◈', text: 'AI-generated skill trees for any role' },
  { icon: '→', text: 'Auto-unlock next steps as you progress' },
  { icon: '▶', text: 'Curated resources for every skill' },
  { icon: '↗', text: 'Pivot simulator: analyze career gaps' },
]

export default function CreateUserModal({ onCreated }) {
  const [email, setEmail]       = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const user = await createUser(email, username)
      localStorage.setItem('userId', user.id)
      onCreated(user)
    } catch {
      setError('Could not create account. Try a different email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Overlay>
      <Modal>
        {/* Left panel */}
        <Left>
          <Brand>
            <BrandName>BLUESCRIPT</BrandName>
            <BrandSub>SKILL OS</BrandSub>
          </Brand>

          <Tagline>
            Map your path from<br />
            where you are to<br />
            where you want to be.
          </Tagline>

          <FeatureList>
            {FEATURES.map(f => (
              <FeatureRow key={f.text}>
                <FIcon>{f.icon}</FIcon>
                <FText>{f.text}</FText>
              </FeatureRow>
            ))}
          </FeatureList>
        </Left>

        {/* Right panel */}
        <Right>
          <FormHead>Get started</FormHead>
          <FormSub>Create your free account</FormSub>

          <form onSubmit={handleSubmit}>
            <FieldStack>
              <Label>EMAIL</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </FieldStack>

            <FieldStack>
              <Label>USERNAME</Label>
              <Input
                placeholder="yourname"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </FieldStack>

            {error && <ErrorMsg>{error}</ErrorMsg>}

            <SubmitBtn type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Start Learning →'}
            </SubmitBtn>

            <Fine>No credit card required. Free to use.</Fine>
          </form>
        </Right>
      </Modal>
    </Overlay>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
  animation: ${fadeIn} 0.2s ease both;
`

const Modal = styled.div`
  display: flex;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 40px 100px rgba(0,0,0,0.6);
  animation: ${slideUp} 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
  width: 680px;
`

const Left = styled.div`
  background: var(--accent);
  width: 260px;
  min-width: 260px;
  padding: 36px 30px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Brand = styled.div``

const BrandName = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
  letter-spacing: 3px;
  font-family: 'Courier New', monospace;
`

const BrandSub = styled.div`
  font-size: 9px;
  color: rgba(255,255,255,0.55);
  letter-spacing: 3px;
  margin-top: 2px;
  font-family: 'Courier New', monospace;
`

const Tagline = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  line-height: 1.4;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
`

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
`

const FeatureRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`

const FIcon = styled.div`
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  flex-shrink: 0;
  width: 18px;
  margin-top: 1px;
`

const FText = styled.div`
  font-size: 12px;
  color: rgba(255,255,255,0.8);
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
`

const Right = styled.div`
  flex: 1;
  background: var(--panel);
  padding: 36px 30px;
`

const FormHead = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
`

const FormSub = styled.p`
  font-size: 13px;
  color: var(--muted);
  margin-top: 4px;
  margin-bottom: 22px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
`

const FieldStack = styled.div`margin-bottom: 14px;`

const Label = styled.div`
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--muted);
  margin-bottom: 6px;
  font-family: 'Courier New', monospace;
`

const Input = styled.input`
  width: 100%;
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 11px 13px;
  color: var(--text);
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  outline: none;
  transition: border-color 0.12s;
  &:focus { border-color: var(--accent); }
  &::placeholder { color: var(--dim); }
`

const ErrorMsg = styled.div`
  font-size: 11px;
  color: #f87171;
  margin-bottom: 12px;
  font-family: 'Courier New', monospace;
`

const SubmitBtn = styled.button`
  width: 100%;
  background: var(--accent);
  border: none;
  border-radius: 10px;
  padding: 13px;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 4px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  transition: all 0.15s;
  &:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
  &:active:not(:disabled) { transform: translateY(0); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

const Fine = styled.div`
  font-size: 10px;
  color: var(--dim);
  text-align: center;
  margin-top: 10px;
  font-family: 'Courier New', monospace;
`
