import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

export default function Navbar({ onLogoClick }) {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <Nav $scrolled={scrolled}>
      <Logo onClick={onLogoClick} title="Click 5 times...">
        <LogoHex>⬡</LogoHex>
        <LogoText>SkillForge</LogoText>
        <LogoBadge>OS</LogoBadge>
      </Logo>

      <NavLinks>
        <NavA href="#features">Features</NavA>
        <NavA href="#how-it-works">How It Works</NavA>
        <NavA href="#pricing">Pricing</NavA>
      </NavLinks>

      <NavEnd>
        <LaunchBtn onClick={() => navigate('/app')}>
          Launch App →
        </LaunchBtn>
      </NavEnd>
    </Nav>
  )
}

const Nav = styled.nav`
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 48px;
  z-index: 1000;
  transition: background 0.3s, border-color 0.3s, backdrop-filter 0.3s;
  ${p => p.$scrolled ? `
    background: rgba(2,11,20,0.88);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0,245,255,0.12);
  ` : ''}
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  flex: 1;
  user-select: none;
`

const LogoHex = styled.div`
  font-size: 24px;
  color: #00f5ff;
  line-height: 1;
  filter: drop-shadow(0 0 6px #00f5ff88);
`

const LogoText = styled.div`
  font-family: 'Orbitron', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #c8eeff;
  letter-spacing: 1px;
`

const LogoBadge = styled.div`
  font-family: 'Share Tech Mono', monospace;
  font-size: 9px;
  color: #00f5ff;
  border: 1px solid rgba(0,245,255,0.35);
  border-radius: 3px;
  padding: 1px 5px;
  letter-spacing: 1.5px;
`

const NavLinks = styled.div`
  display: flex;
  gap: 36px;
  align-items: center;
`

const NavA = styled.a`
  font-family: 'Exo 2', sans-serif;
  font-size: 13px;
  color: #3a6a85;
  text-decoration: none;
  letter-spacing: 0.5px;
  transition: color 0.2s;
  &:hover { color: #c8eeff; }
`

const NavEnd = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`

const LaunchBtn = styled.button`
  background: transparent;
  border: 1px solid rgba(0,245,255,0.3);
  border-radius: 6px;
  padding: 8px 22px;
  color: #00f5ff;
  font-family: 'Share Tech Mono', monospace;
  font-size: 12px;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: all 0.2s;
  &:hover {
    background: rgba(0,245,255,0.08);
    border-color: #00f5ff;
    box-shadow: 0 0 20px rgba(0,245,255,0.3);
  }
`
