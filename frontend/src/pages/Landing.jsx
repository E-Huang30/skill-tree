import { useEffect, useState, useRef, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'

import Navbar          from '../components/landing/Navbar'
import Hero            from '../components/landing/Hero'
import BuildYourGoal   from '../components/landing/BuildYourGoal'
import FeaturesGrid    from '../components/landing/FeaturesGrid'
import HowItWorks      from '../components/landing/HowItWorks'
import SocialProof     from '../components/landing/SocialProof'
import PricingTeaser   from '../components/landing/PricingTeaser'
import FinalCTA        from '../components/landing/FinalCTA'
import Footer          from '../components/landing/Footer'

import ScrollProgress  from '../components/ui/ScrollProgress'
import CursorTrail     from '../components/ui/CursorTrail'
import MatrixRain      from '../components/ui/MatrixRain'

// Konami code sequence
const KONAMI = [
  'ArrowUp','ArrowUp',
  'ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight',
  'ArrowLeft','ArrowRight',
  'b','a',
]

export default function Landing() {
  const [matrixActive, setMatrixActive] = useState(false)
  const [badge, setBadge]               = useState(null)  // string | null
  const [logoClicks, setLogoClicks]     = useState(0)
  const konamiRef  = useRef(0)
  const idleRef    = useRef(null)
  const badgeTimer = useRef(null)

  function showBadge(text, duration = 5000) {
    clearTimeout(badgeTimer.current)
    setBadge(text)
    badgeTimer.current = setTimeout(() => setBadge(null), duration)
  }

  // ── Konami code listener ────────────────────────────────────────────────────
  const handleKey = useCallback(e => {
    if (e.key === KONAMI[konamiRef.current]) {
      konamiRef.current++
      if (konamiRef.current === KONAMI.length) {
        konamiRef.current = 0
        setMatrixActive(true)
        showBadge('⚡ CHEAT MODE ACTIVATED', 8000)
        setTimeout(() => setMatrixActive(false), 8000)
      }
    } else {
      konamiRef.current = 0
    }
  }, [])

  // ── Logo click counter easter egg ───────────────────────────────────────────
  const handleLogoClick = useCallback(() => {
    setLogoClicks(n => {
      const next = n + 1
      if (next >= 5) {
        showBadge('🔑 ADMIN MODE UNLOCKED', 4000)
        return 0
      }
      if (next === 3) showBadge(`${5 - next} more...`, 1500)
      return next
    })
  }, [])

  // ── Idle detection (30s) ────────────────────────────────────────────────────
  useEffect(() => {
    function resetIdle() {
      clearTimeout(idleRef.current)
      idleRef.current = setTimeout(() => {
        showBadge('💤 SYSTEM IDLE — tap to resume', 3000)
      }, 30000)
    }

    window.addEventListener('keydown', handleKey)
    window.addEventListener('mousemove', resetIdle, { passive: true })
    window.addEventListener('keydown',  resetIdle, { passive: true })
    window.addEventListener('scroll',   resetIdle, { passive: true })
    resetIdle()

    return () => {
      window.removeEventListener('keydown',  handleKey)
      window.removeEventListener('mousemove', resetIdle)
      window.removeEventListener('keydown',   resetIdle)
      window.removeEventListener('scroll',    resetIdle)
      clearTimeout(idleRef.current)
      clearTimeout(badgeTimer.current)
    }
  }, [handleKey])

  // Click anywhere while matrix is active to dismiss
  function handleRootClick() {
    if (matrixActive) {
      setMatrixActive(false)
      setBadge(null)
    }
  }

  return (
    <Root onClick={handleRootClick}>
      <ScrollProgress />
      <CursorTrail />
      <MatrixRain active={matrixActive} />

      {badge && (
        <BadgeOverlay key={badge}>
          <BadgeInner>{badge}</BadgeInner>
        </BadgeOverlay>
      )}

      <Navbar onLogoClick={handleLogoClick} />

      <main>
        <Hero />
        <Divider />
        <BuildYourGoal />
        <Divider />
        <FeaturesGrid />
        <Divider />
        <HowItWorks />
        <Divider />
        <SocialProof />
        <Divider />
        <PricingTeaser />
        <FinalCTA />
      </main>

      <Footer />
    </Root>
  )
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const Root = styled.div`
  /* Landing-page design tokens — scoped so they don't leak into AppShell */
  --lnd-bg:     #020b14;
  --lnd-neon:   #00f5ff;
  --lnd-purple: #7b2fff;
  --lnd-pink:   #ff2a6d;
  --lnd-gold:   #ffd700;
  --lnd-text:   #c8eeff;
  --lnd-muted:  #3a6a85;

  background: #020b14;
  color: #c8eeff;
  min-height: 100vh;
  overflow-x: hidden;

  /* Hide default cursor while cursor trail is active */
  cursor: none;
  * { box-sizing: border-box; }
  a, button { cursor: none; }
`

const Divider = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0,245,255,0.12), transparent);
`

const popIn = keyframes`
  from { opacity: 0; transform: translateX(-50%) translateY(-16px) scale(0.88); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0)      scale(1);   }
`

const BadgeOverlay = styled.div`
  position: fixed;
  top: 76px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9500;
  animation: ${popIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
  pointer-events: none;
`

const BadgeInner = styled.div`
  background: linear-gradient(135deg, #00f5ff, #7b2fff);
  color: #020b14;
  font-family: 'Orbitron', sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  padding: 10px 28px;
  border-radius: 6px;
  white-space: nowrap;
  box-shadow: 0 0 40px rgba(0,245,255,0.6), 0 8px 32px rgba(0,0,0,0.5);
`
