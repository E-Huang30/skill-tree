import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { getUser } from '../api/users'

const Nav = styled.nav`
  background: #1a1a2e; border-bottom: 1px solid #2a2a3e;
  padding: 0 24px; height: 56px;
  display: flex; align-items: center; justify-content: space-between;
`
const Logo = styled(Link)`font-size: 18px; font-weight: 700; color: #4f46e5;`
const UserChip = styled.div`
  background: #0f0f23; border: 1px solid #2a2a3e; border-radius: 20px;
  padding: 6px 14px; font-size: 13px; color: #aaa;
`

export default function Navbar() {
  const [username, setUsername] = useState('')

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) return
    getUser(userId).then(u => setUsername(u.username)).catch(() => {})
  }, [])

  return (
    <Nav>
      <Logo to="/">Skill Tree</Logo>
      {username && <UserChip>{username}</UserChip>}
    </Nav>
  )
}
