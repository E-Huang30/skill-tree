import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { generateTree } from '../api/trees'

const Overlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.75);
  display: flex; align-items: center; justify-content: center; z-index: 100;
`
const Modal = styled.div`
  background: #1a1a2e; border-radius: 12px; padding: 32px;
  width: 480px; display: flex; flex-direction: column; gap: 16px;
`
const Title = styled.h2`font-size: 20px; font-weight: 700;`
const Hint = styled.p`font-size: 14px; color: #888;`
const Input = styled.input`
  background: #0f0f23; border: 1px solid #2a2a3e; border-radius: 6px;
  padding: 10px 14px; color: #f0f0f0; font-size: 14px; width: 100%;
  &:focus { outline: none; border-color: #4f46e5; }
`
const Textarea = styled.textarea`
  background: #0f0f23; border: 1px solid #2a2a3e; border-radius: 6px;
  padding: 10px 14px; color: #f0f0f0; font-size: 14px; width: 100%;
  resize: vertical; min-height: 80px;
  &:focus { outline: none; border-color: #4f46e5; }
`
const Row = styled.div`display: flex; gap: 12px; justify-content: flex-end;`
const Button = styled.button`
  background: ${p => p.$secondary ? 'transparent' : '#4f46e5'};
  color: ${p => p.$secondary ? '#888' : 'white'};
  border: ${p => p.$secondary ? '1px solid #2a2a3e' : 'none'};
  border-radius: 6px; padding: 10px 20px; cursor: pointer;
  font-size: 14px; font-weight: 600;
  &:hover { background: ${p => p.$secondary ? '#0f0f23' : '#4338ca'}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

export default function CreateTreeModal({ onClose, onCreated }) {
  const [role, setRole] = useState('')
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    const userId = localStorage.getItem('userId')
    if (!userId) return
    setLoading(true)
    setError('')
    try {
      const tree = await generateTree(userId, role, context)
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
        <Title>Generate Skill Tree</Title>
        <Hint>AI will build a personalized learning path for your target role.</Hint>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input
            placeholder="Target role (e.g. Frontend Engineer)"
            value={role}
            onChange={e => setRole(e.target.value)}
            required
          />
          <Textarea
            placeholder="Optional context (e.g. I already know React and TypeScript)"
            value={context}
            onChange={e => setContext(e.target.value)}
          />
          {error && <p style={{ color: '#f87171', fontSize: 13 }}>{error}</p>}
          <Row>
            <Button type="button" $secondary onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading || !role}>
              {loading ? 'Generating...' : 'Generate'}
            </Button>
          </Row>
        </form>
      </Modal>
    </Overlay>
  )
}
