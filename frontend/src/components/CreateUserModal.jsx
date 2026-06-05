import { useState } from 'react'
import styled from 'styled-components'
import { createUser } from '../api/users'

const Overlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.75);
  display: flex; align-items: center; justify-content: center; z-index: 100;
`
const Modal = styled.div`
  background: #1a1a2e; border-radius: 12px; padding: 32px;
  width: 400px; display: flex; flex-direction: column; gap: 16px;
`
const Title = styled.h2`font-size: 20px; font-weight: 700;`
const Hint = styled.p`font-size: 14px; color: #888;`
const Input = styled.input`
  background: #0f0f23; border: 1px solid #2a2a3e; border-radius: 6px;
  padding: 10px 14px; color: #f0f0f0; font-size: 14px; width: 100%;
  &:focus { outline: none; border-color: #4f46e5; }
`
const Button = styled.button`
  background: #4f46e5; color: white; border: none; border-radius: 6px;
  padding: 10px; cursor: pointer; font-size: 14px; font-weight: 600;
  &:hover { background: #4338ca; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`
const ErrorMsg = styled.p`color: #f87171; font-size: 13px;`

export default function CreateUserModal({ onCreated }) {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
        <Title>Welcome to Skill Tree</Title>
        <Hint>Create your account to get started.</Hint>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Get Started'}
          </Button>
        </form>
      </Modal>
    </Overlay>
  )
}
