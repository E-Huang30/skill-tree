import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import styled, { keyframes } from 'styled-components'

// ── Design tokens ─────────────────────────────────────────────────────────────
const BLUE       = '#2563eb'
const BLUE_DARK  = '#1d4ed8'
const BLUE_LIGHT = '#eff6ff'
const BLUE_BDR   = '#bfdbfe'
const TEXT       = '#0f172a'
const TEXT2      = '#475569'
const MUTED      = '#94a3b8'
const BORDER     = '#e2e8f0'
const BG_ALT     = '#f8faff'

const STATS = [
  { value: '12,000+', label: 'Trees Generated'  },
  { value: '98,000+', label: 'Skills Mapped'     },
  { value: '4,200+',  label: 'Active Learners'   },
  { value: '500K+',   label: 'Hours Saved'       },
]

const FEATURES = [
  { emoji: '🗺️', title: 'AI Skill Trees',          desc: 'Tell Claude your target role. Get a full 8–15 node learning roadmap in under 30 seconds, personalised to your background.' },
  { emoji: '🔓', title: 'Auto-Progression',         desc: 'Complete a skill and the next ones unlock immediately. You always know the single next thing to work on.' },
  { emoji: '📚', title: 'Curated Resources',        desc: 'Every node ships with exact Khan Academy lessons, freeCodeCamp paths, and YouTube tutorials — with a "start here" note.' },
  { emoji: '↗️', title: 'Pivot Simulator',          desc: 'Switching careers? See your readiness %, transferable skills, and the precise gaps to close for any new role.' },
  { emoji: '📊', title: 'Progress Tracking',        desc: 'Track hours invested, completion %, and time estimates. Know exactly when you\'ll be job-ready.' },
  { emoji: '🌿', title: 'Branching Specialisations',desc: 'Fork your path — front-end vs back-end, analytics vs ML. Pick the branch that fits your goal.' },
]

const STEPS = [
  { n: '01', title: 'Set Your Target Role', desc: 'Type any job title — "Frontend Engineer", "Data Analyst", "UX Designer". Claude maps your full learning path in seconds.' },
  { n: '02', title: 'Learn Node by Node',   desc: 'Work through curated resources for each skill. Every node comes with exact lessons and a clear starting point.' },
  { n: '03', title: 'Unlock Your Future',   desc: 'Mark a skill complete and the next tier lights up. Watch your tree turn green as you progress toward your goal.' },
]

const HOW_DETAILS = [
  { icon: '✓', text: 'Click any glowing node to see its resources' },
  { icon: '✓', text: 'Mark complete to automatically unlock the next skills' },
  { icon: '✓', text: 'Track your total hours and progress percentage' },
  { icon: '✓', text: 'Branch into specialisations as your skills grow' },
]

// ── Micro-components ──────────────────────────────────────────────────────────

function SkillTreeSVG() {
  const nodes = [
    { id: 'a', x: 160, y: 40,  label: 'HTML & CSS',   s: 'done'  },
    { id: 'b', x: 80,  y: 150, label: 'JavaScript',   s: 'done'  },
    { id: 'c', x: 240, y: 150, label: 'Dev Tools',    s: 'avail' },
    { id: 'd', x: 40,  y: 270, label: 'React',        s: 'avail' },
    { id: 'e', x: 160, y: 270, label: 'Node.js',      s: 'lock'  },
    { id: 'f', x: 290, y: 270, label: 'TypeScript',   s: 'lock'  },
    { id: 'g', x: 100, y: 390, label: 'REST APIs',    s: 'lock'  },
    { id: 'h', x: 260, y: 390, label: 'Databases',    s: 'lock'  },
  ]
  const edges = [
    ['a','b'],['a','c'],
    ['b','d'],['b','e'],['c','f'],
    ['d','g'],['e','g'],['e','h'],['f','h'],
  ]
  const C = { done: '#22c55e', avail: BLUE, lock: '#cbd5e1' }
  const BG = { done: '#f0fdf4', avail: BLUE_LIGHT, lock: '#f8fafc' }

  return (
    <TreeSVGWrap>
      <svg viewBox="0 0 340 450" width="320" height="430">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {edges.map(([a, b]) => {
          const from = nodes.find(n => n.id === a)
          const to   = nodes.find(n => n.id === b)
          return (
            <line key={`${a}${b}`}
              x1={from.x} y1={from.y + 22}
              x2={to.x}   y2={to.y - 22}
              stroke={to.s === 'lock' ? '#e2e8f0' : BLUE_BDR}
              strokeWidth="1.5"
              strokeDasharray={to.s === 'lock' ? '4 4' : undefined}
            />
          )
        })}
        {nodes.map(n => (
          <g key={n.id}>
            {n.s === 'avail' && (
              <circle cx={n.x} cy={n.y} r="26" fill="none" stroke={BLUE} strokeWidth="1" opacity="0.25">
                <animate attributeName="r" from="22" to="30" dur="2.2s" repeatCount="indefinite"/>
                <animate attributeName="opacity" from="0.25" to="0" dur="2.2s" repeatCount="indefinite"/>
              </circle>
            )}
            <circle cx={n.x} cy={n.y} r="20"
              fill={BG[n.s]}
              stroke={C[n.s]}
              strokeWidth={n.s === 'lock' ? 1.5 : 2}
              filter={n.s !== 'lock' ? 'url(#glow)' : undefined}
            />
            <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize="12"
              fill={C[n.s]} fontWeight="700">
              {n.s === 'done' ? '✓' : n.s === 'avail' ? '◆' : '🔒'}
            </text>
            <text x={n.x} y={n.y + 38} textAnchor="middle" fontSize="9.5"
              fontFamily="system-ui,sans-serif" fontWeight="600"
              fill={n.s === 'lock' ? MUTED : n.s === 'done' ? '#15803d' : BLUE}>
              {n.label}
            </text>
          </g>
        ))}
      </svg>
      <SVGGradient />
    </TreeSVGWrap>
  )
}

function AppPreviewMockup() {
  return (
    <MockupShell>
      <MockupChrome>
        <Dot $c="#ef4444"/><Dot $c="#f59e0b"/><Dot $c="#22c55e"/>
        <MockupURL>skillos.io/trees/42</MockupURL>
      </MockupChrome>
      <MockupBody>
        {/* Sidebar */}
        <MockupSide>
          <SideLabel>CAREER TREES</SideLabel>
          <SideItem $active>Frontend Eng.</SideItem>
          <SideItem>Data Analyst</SideItem>
          <SideItem>UX Designer</SideItem>
        </MockupSide>
        {/* Canvas */}
        <MockupCanvas>
          <CanvasNode $s="done">HTML &amp; CSS<br/><small>✓ MASTERED</small></CanvasNode>
          <CanvasArrow>↓</CanvasArrow>
          <CanvasNode $s="avail">JavaScript<br/><small>◆ START HERE</small></CanvasNode>
          <CanvasArrow>↓</CanvasArrow>
          <CanvasNode $s="lock">React<br/><small>🔒 LOCKED</small></CanvasNode>
        </MockupCanvas>
        {/* Inspector */}
        <MockupInspect>
          <InspLabel>// NODE INSPECTOR</InspLabel>
          <InspTitle>JavaScript</InspTitle>
          <InspRow>freeCodeCamp · 50h</InspRow>
          <InspRes>◈ JS Algorithms &amp; DS</InspRes>
          <InspNote>Start: Basic JavaScript →</InspNote>
          <InspStatus>Status: In Progress</InspStatus>
        </MockupInspect>
      </MockupBody>
    </MockupShell>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function Landing() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const el = document.getElementById('lnd-root')
    if (!el) return
    const fn = () => setScrolled(el.scrollTop > 48)
    el.addEventListener('scroll', fn, { passive: true })
    return () => el.removeEventListener('scroll', fn)
  }, [])

  const go = () => navigate('/app')

  return (
    <Page id="lnd-root">
      {/* ── Navbar ── */}
      <Nav $scrolled={scrolled}>
        <NavWrap>
          <NavLogo onClick={go}>
            <LogoHex>⬡</LogoHex>
            <LogoName>SkillOS</LogoName>
          </NavLogo>
          <NavLinks>
            <NLink href="#features">Features</NLink>
            <NLink href="#how">How It Works</NLink>
            <NLink href="#preview">The App</NLink>
          </NavLinks>
          <NavEnd>
            <GhostNavBtn onClick={go}>Log In</GhostNavBtn>
            <PrimaryNavBtn onClick={go}>Get Started Free →</PrimaryNavBtn>
          </NavEnd>
        </NavWrap>
      </Nav>

      {/* ── Hero ── */}
      <HeroSection>
        <HeroLeft
          as={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <HeroBadge>AI-Powered Career Intelligence</HeroBadge>
          <HeroH1>
            Build Your Future.<br />
            <HeroBlue>One Skill at a Time.</HeroBlue>
          </HeroH1>
          <HeroP>
            Generate a personalised skill tree for any career, follow curated
            learning paths with exact lesson links, and unlock your next skill
            the moment you complete the current one.
          </HeroP>
          <HeroCTAs>
            <PrimaryBtn onClick={go}>Start Building Free →</PrimaryBtn>
            <OutlineBtn href="#how">See How It Works ↓</OutlineBtn>
          </HeroCTAs>
          <StatsRow>
            {STATS.map(s => (
              <StatBox key={s.label}>
                <StatV>{s.value}</StatV>
                <StatL>{s.label}</StatL>
              </StatBox>
            ))}
          </StatsRow>
        </HeroLeft>

        <HeroRight
          as={motion.div}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <SkillTreeSVG />
        </HeroRight>
      </HeroSection>

      {/* ── Features ── */}
      <AltSection id="features">
        <SecCenter>
          <SecTag>CAPABILITIES</SecTag>
          <SecH2>Everything you need to level up.</SecH2>
          <SecSub>Six tools. One system. Zero guesswork on what to learn next.</SecSub>
        </SecCenter>
        <FeatureGrid>
          {FEATURES.map((f, i) => (
            <FCard
              key={f.title}
              as={motion.div}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              whileHover={{ y: -5, transition: { duration: 0.18 } }}
            >
              <FEmoji>{f.emoji}</FEmoji>
              <FTitle>{f.title}</FTitle>
              <FDesc>{f.desc}</FDesc>
            </FCard>
          ))}
        </FeatureGrid>
      </AltSection>

      {/* ── How it works ── */}
      <PlainSection id="how">
        <SecCenter>
          <SecTag>PROCESS</SecTag>
          <SecH2>Three steps to career clarity.</SecH2>
        </SecCenter>
        <StepsRow>
          {STEPS.map((s, i) => (
            <StepCard
              key={s.n}
              as={motion.div}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
            >
              {i < STEPS.length - 1 && <StepConnector>→</StepConnector>}
              <StepN>{s.n}</StepN>
              <StepTitle>{s.title}</StepTitle>
              <StepDesc>{s.desc}</StepDesc>
            </StepCard>
          ))}
        </StepsRow>
      </PlainSection>

      {/* ── App preview ── */}
      <AltSection id="preview">
        <PreviewInner>
          <PreviewLeft
            as={motion.div}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55 }}
          >
            <SecTag>THE APP</SecTag>
            <PreviewH2>Your career path, visualised.</PreviewH2>
            <PreviewP>
              An interactive skill tree maps every step of your journey.
              Glowing nodes are ready to unlock. Grey nodes wait behind them.
              Click any node to see curated resources and mark your progress.
            </PreviewP>
            <CheckList>
              {HOW_DETAILS.map(h => (
                <CheckItem key={h.text}>
                  <CheckIcon>✓</CheckIcon>
                  {h.text}
                </CheckItem>
              ))}
            </CheckList>
            <PrimaryBtn onClick={go} style={{ marginTop: 28 }}>
              Open Your Skill Map →
            </PrimaryBtn>
          </PreviewLeft>

          <PreviewRight
            as={motion.div}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <AppPreviewMockup />
          </PreviewRight>
        </PreviewInner>
      </AltSection>

      {/* ── CTA Banner ── */}
      <CTASection>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center' }}
        >
          <CTAH2>Ready to map your future?</CTAH2>
          <CTAP>Generate your personalised skill tree in 30 seconds. Free, forever.</CTAP>
          <CTABtn onClick={go}>Build Your Skill Tree →</CTABtn>
        </motion.div>
      </CTASection>

      {/* ── Footer ── */}
      <FooterBar>
        <FooterWrap>
          <FooterBrand>⬡ SkillOS</FooterBrand>
          <FooterNote>AI-powered career skill trees. Build your path, one skill at a time.</FooterNote>
          <FooterLinks>
            <FA href="#features">Features</FA>
            <FA href="#how">How It Works</FA>
            <FA onClick={go} style={{ cursor: 'pointer' }}>Launch App</FA>
          </FooterLinks>
        </FooterWrap>
      </FooterBar>
    </Page>
  )
}

// ── Animations ─────────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`

// ── Page shell ────────────────────────────────────────────────────────────────

const Page = styled.div`
  height: 100%;
  overflow-y: auto;
  background: #ffffff;
  color: ${TEXT};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  * { box-sizing: border-box; }
  a { text-decoration: none; color: inherit; }
`

// ── Navbar ────────────────────────────────────────────────────────────────────

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 200;
  height: 64px;
  background: ${p => p.$scrolled ? 'rgba(255,255,255,0.94)' : '#fff'};
  backdrop-filter: ${p => p.$scrolled ? 'blur(14px)' : 'none'};
  border-bottom: 1px solid ${p => p.$scrolled ? BORDER : 'transparent'};
  transition: background 0.25s, border-color 0.25s;
`
const NavWrap = styled.div`
  max-width: 1160px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 32px;
  gap: 40px;
`
const NavLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  flex: 1;
  user-select: none;
`
const LogoHex = styled.span`font-size: 22px; color: ${BLUE};`
const LogoName = styled.span`
  font-size: 17px;
  font-weight: 800;
  color: ${TEXT};
  letter-spacing: -0.4px;
`
const NavLinks = styled.div`
  display: flex;
  gap: 32px;
  @media (max-width: 700px) { display: none; }
`
const NLink = styled.a`
  font-size: 14px;
  color: ${TEXT2};
  font-weight: 500;
  transition: color 0.15s;
  &:hover { color: ${TEXT}; }
`
const NavEnd = styled.div`display: flex; gap: 8px; align-items: center;`
const GhostNavBtn = styled.button`
  background: none;
  border: none;
  color: ${TEXT2};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 7px;
  transition: color 0.15s;
  &:hover { color: ${TEXT}; }
`
const PrimaryNavBtn = styled.button`
  background: ${BLUE};
  border: none;
  border-radius: 8px;
  padding: 9px 18px;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, transform 0.1s;
  &:hover { background: ${BLUE_DARK}; transform: translateY(-1px); }
  &:active { transform: none; }
`

// ── Hero ──────────────────────────────────────────────────────────────────────

const HeroSection = styled.section`
  max-width: 1160px;
  margin: 0 auto;
  padding: 80px 32px 60px;
  display: flex;
  gap: 56px;
  align-items: center;
  @media (max-width: 920px) { flex-direction: column; padding: 56px 24px 40px; }
`
const HeroLeft = styled.div`flex: 1;`
const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${BLUE_LIGHT};
  border: 1px solid ${BLUE_BDR};
  border-radius: 20px;
  padding: 5px 14px;
  font-size: 12px;
  font-weight: 600;
  color: ${BLUE};
  letter-spacing: 0.2px;
  margin-bottom: 22px;
`
const HeroH1 = styled.h1`
  font-size: clamp(38px, 5vw, 62px);
  font-weight: 900;
  color: ${TEXT};
  line-height: 1.08;
  letter-spacing: -1.5px;
  margin-bottom: 20px;
`
const HeroBlue = styled.span`color: ${BLUE};`
const HeroP = styled.p`
  font-size: 17px;
  color: ${TEXT2};
  line-height: 1.78;
  max-width: 500px;
  margin-bottom: 36px;
`
const HeroCTAs = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 48px;
`
const PrimaryBtn = styled.button`
  background: ${BLUE};
  border: none;
  border-radius: 10px;
  padding: 13px 26px;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, transform 0.12s, box-shadow 0.15s;
  &:hover {
    background: ${BLUE_DARK};
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(37,99,235,0.28);
  }
  &:active { transform: none; box-shadow: none; }
`
const OutlineBtn = styled.a`
  border: 1.5px solid ${BORDER};
  border-radius: 10px;
  padding: 12px 22px;
  color: ${TEXT2};
  font-size: 15px;
  font-weight: 600;
  transition: all 0.15s;
  cursor: pointer;
  &:hover { border-color: ${BLUE}; color: ${BLUE}; }
`
const StatsRow = styled.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
  border-top: 1px solid #f1f5f9;
  padding-top: 24px;
`
const StatBox = styled.div``
const StatV = styled.div`
  font-size: 26px;
  font-weight: 900;
  color: ${TEXT};
  letter-spacing: -0.5px;
  line-height: 1;
`
const StatL = styled.div`
  font-size: 11px;
  color: ${MUTED};
  margin-top: 4px;
  font-weight: 500;
`

// ── Hero visual (skill tree SVG) ──────────────────────────────────────────────

const HeroRight = styled.div`
  flex-shrink: 0;
  @media (max-width: 920px) { width: 100%; display: flex; justify-content: center; }
`
const TreeSVGWrap = styled.div`
  position: relative;
  background: #fff;
  border: 1.5px solid ${BORDER};
  border-radius: 20px;
  padding: 28px 24px 16px;
  box-shadow: 0 24px 72px rgba(0,0,0,0.07), 0 4px 16px rgba(37,99,235,0.05);
`
const SVGGradient = styled.div`
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 70px;
  background: linear-gradient(to bottom, transparent, white);
  border-radius: 0 0 20px 20px;
  pointer-events: none;
`

// ── Sections layout ───────────────────────────────────────────────────────────

const AltSection = styled.section`
  background: ${BG_ALT};
  border-top: 1px solid ${BORDER};
  border-bottom: 1px solid ${BORDER};
  padding: 80px 32px 96px;
`
const PlainSection = styled.section`
  padding: 80px 32px 96px;
  max-width: 1100px;
  margin: 0 auto;
`
const SecCenter = styled.div`
  text-align: center;
  margin-bottom: 52px;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
`
const SecTag = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${BLUE};
  letter-spacing: 2.5px;
  text-transform: uppercase;
  margin-bottom: 12px;
`
const SecH2 = styled.h2`
  font-size: clamp(26px, 3.5vw, 42px);
  font-weight: 800;
  color: ${TEXT};
  letter-spacing: -0.5px;
  margin-bottom: 10px;
`
const SecSub = styled.div`font-size: 15px; color: ${TEXT2};`

// ── Features ─────────────────────────────────────────────────────────────────

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 1100px;
  margin: 0 auto;
  @media (max-width: 880px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`
const FCard = styled.div`
  background: #fff;
  border: 1.5px solid ${BORDER};
  border-radius: 14px;
  padding: 28px 26px;
  transition: border-color 0.15s, box-shadow 0.15s;
  &:hover { border-color: ${BLUE_BDR}; box-shadow: 0 12px 40px rgba(37,99,235,0.08); }
`
const FEmoji = styled.div`font-size: 28px; margin-bottom: 14px;`
const FTitle = styled.div`font-size: 15px; font-weight: 700; color: ${TEXT}; margin-bottom: 8px;`
const FDesc  = styled.div`font-size: 13px; color: ${TEXT2}; line-height: 1.72;`

// ── How it works ──────────────────────────────────────────────────────────────

const StepsRow = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: 700px) { flex-direction: column; }
`
const StepCard = styled.div`
  flex: 1;
  background: #fff;
  border: 1.5px solid ${BORDER};
  border-radius: 16px;
  padding: 32px 26px;
  position: relative;
  transition: border-color 0.15s;
  &:hover { border-color: ${BLUE_BDR}; }
`
const StepConnector = styled.div`
  position: absolute;
  right: -14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: ${BLUE_BDR};
  z-index: 1;
  @media (max-width: 700px) { display: none; }
`
const StepN = styled.div`
  font-size: 52px;
  font-weight: 900;
  color: ${BLUE};
  opacity: 0.1;
  line-height: 1;
  margin-bottom: 14px;
  letter-spacing: -2px;
`
const StepTitle = styled.div`font-size: 17px; font-weight: 700; color: ${TEXT}; margin-bottom: 10px;`
const StepDesc  = styled.div`font-size: 14px; color: ${TEXT2}; line-height: 1.75;`

// ── App preview ───────────────────────────────────────────────────────────────

const PreviewInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  gap: 64px;
  align-items: center;
  @media (max-width: 880px) { flex-direction: column; }
`
const PreviewLeft  = styled.div`flex: 1;`
const PreviewH2    = styled.h2`font-size: clamp(24px, 3vw, 36px); font-weight: 800; color: ${TEXT}; letter-spacing: -0.5px; margin: 12px 0 16px;`
const PreviewP     = styled.p`font-size: 15px; color: ${TEXT2}; line-height: 1.78; margin-bottom: 22px;`
const CheckList    = styled.div`display: flex; flex-direction: column; gap: 10px;`
const CheckItem    = styled.div`display: flex; gap: 10px; font-size: 14px; color: ${TEXT2};`
const CheckIcon    = styled.span`color: ${BLUE}; font-weight: 700; flex-shrink: 0;`
const PreviewRight = styled.div`flex-shrink: 0; @media (max-width: 880px) { width: 100%; }`

// ── App mockup ────────────────────────────────────────────────────────────────

const MockupShell = styled.div`
  background: #fff;
  border: 1.5px solid ${BORDER};
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 24px 72px rgba(0,0,0,0.09), 0 4px 16px rgba(37,99,235,0.06);
  width: 500px;
  @media (max-width: 880px) { width: 100%; }
`
const MockupChrome = styled.div`
  background: #f8fafc;
  border-bottom: 1px solid ${BORDER};
  height: 36px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 14px;
`
const Dot = styled.div`width: 10px; height: 10px; border-radius: 50%; background: ${p => p.$c}; opacity: 0.7;`
const MockupURL = styled.div`
  margin-left: 8px;
  font-size: 11px;
  color: ${MUTED};
  font-family: 'Courier New', monospace;
`
const MockupBody = styled.div`display: flex; height: 260px;`
const MockupSide = styled.div`
  width: 130px;
  background: #f8fafc;
  border-right: 1px solid ${BORDER};
  padding: 14px 10px;
  flex-shrink: 0;
`
const SideLabel = styled.div`
  font-size: 8px;
  color: ${MUTED};
  letter-spacing: 1.5px;
  margin-bottom: 8px;
  font-family: 'Courier New', monospace;
`
const SideItem = styled.div`
  font-size: 10px;
  padding: 6px 8px;
  border-radius: 5px;
  margin-bottom: 2px;
  font-weight: ${p => p.$active ? 700 : 500};
  color: ${p => p.$active ? BLUE : TEXT2};
  background: ${p => p.$active ? BLUE_LIGHT : 'transparent'};
  border-left: 2px solid ${p => p.$active ? BLUE : 'transparent'};
  cursor: default;
`
const MockupCanvas = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 16px;
`
const CanvasNode = styled.div`
  background: ${p => p.$s === 'done' ? '#f0fdf4' : p.$s === 'avail' ? BLUE_LIGHT : '#f8fafc'};
  border: 1.5px solid ${p => p.$s === 'done' ? '#86efac' : p.$s === 'avail' ? '#93c5fd' : BORDER};
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 10px;
  font-weight: 700;
  color: ${p => p.$s === 'done' ? '#15803d' : p.$s === 'avail' ? BLUE_DARK : MUTED};
  text-align: center;
  width: 136px;
  font-family: 'Courier New', monospace;
  small { font-size: 8px; font-weight: 400; display: block; margin-top: 2px; }
`
const CanvasArrow = styled.div`font-size: 12px; color: ${BORDER};`
const MockupInspect = styled.div`
  width: 130px;
  background: #f8fafc;
  border-left: 1px solid ${BORDER};
  padding: 12px 10px;
  flex-shrink: 0;
`
const InspLabel  = styled.div`font-size: 7px; color: ${MUTED}; letter-spacing: 1.5px; margin-bottom: 8px; font-family: 'Courier New', monospace;`
const InspTitle  = styled.div`font-size: 11px; font-weight: 700; color: ${BLUE}; margin-bottom: 5px;`
const InspRow    = styled.div`font-size: 9px; color: ${TEXT2}; margin-bottom: 7px; font-family: 'Courier New', monospace;`
const InspRes    = styled.div`font-size: 9px; color: ${BLUE}; font-weight: 600; margin-bottom: 3px;`
const InspNote   = styled.div`font-size: 8px; color: ${MUTED}; font-family: 'Courier New', monospace; margin-bottom: 10px;`
const InspStatus = styled.div`
  font-size: 8px;
  background: ${BLUE_LIGHT};
  border: 1px solid ${BLUE_BDR};
  color: ${BLUE};
  border-radius: 4px;
  padding: 3px 6px;
  font-family: 'Courier New', monospace;
`

// ── CTA section ───────────────────────────────────────────────────────────────

const CTASection = styled.section`
  background: linear-gradient(135deg, #1e40af 0%, ${BLUE} 55%, #3b82f6 100%);
  padding: 88px 32px;
  text-align: center;
`
const CTAH2 = styled.h2`
  font-size: clamp(28px, 4vw, 46px);
  font-weight: 900;
  color: #fff;
  letter-spacing: -1px;
  margin-bottom: 14px;
`
const CTAP = styled.p`
  font-size: 16px;
  color: rgba(255,255,255,0.72);
  margin-bottom: 32px;
  line-height: 1.6;
`
const CTABtn = styled.button`
  background: #fff;
  border: none;
  border-radius: 10px;
  padding: 15px 32px;
  color: ${BLUE};
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.12s, box-shadow 0.15s;
  &:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(0,0,0,0.2); }
  &:active { transform: none; }
`

// ── Footer ────────────────────────────────────────────────────────────────────

const FooterBar = styled.footer`background: #0f172a; padding: 40px 32px;`
const FooterWrap = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
`
const FooterBrand = styled.div`font-size: 15px; font-weight: 800; color: #fff; flex: 1;`
const FooterNote  = styled.div`font-size: 13px; color: #475569; flex: 2; text-align: center;`
const FooterLinks = styled.div`display: flex; gap: 24px; flex: 1; justify-content: flex-end;`
const FA = styled.a`
  font-size: 13px;
  color: #475569;
  transition: color 0.15s;
  &:hover { color: #fff; }
`
