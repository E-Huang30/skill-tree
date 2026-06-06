import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import styled, { keyframes } from 'styled-components'

const COLORS = ['#2563eb','#22c55e','#f59e0b','#ec4899','#7c3aed','#06b6d4','#f97316','#84cc16']

const fall = keyframes`
  0%   { transform: translateY(-20px) rotate(0deg) scaleX(1);  opacity: 1; }
  50%  { transform: translateY(50vh)  rotate(360deg) scaleX(-1); opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg) scaleX(1);  opacity: 0; }
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`

const Piece = styled.div`
  position: absolute;
  top: -10px;
  border-radius: 2px;
  animation: ${fall} linear infinite;
  pointer-events: none;
`

const Card = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 48px 40px 40px;
  max-width: 420px;
  width: 90%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  box-shadow: 0 32px 80px rgba(0,0,0,0.3);
  position: relative;
  z-index: 1;
`

const BigEmoji = styled.div`
  font-size: 64px;
  line-height: 1;
  animation: ${keyframes`
    0%,100% { transform: rotate(-10deg) scale(1); }
    50%      { transform: rotate(10deg) scale(1.1); }
  `} 1.5s ease-in-out infinite;
`

const Title = styled.div`
  font-size: 32px;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.8px;
  line-height: 1;
`

const Role = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #2563eb;
  background: #eff6ff;
  border: 1.5px solid #bfdbfe;
  border-radius: 20px;
  padding: 6px 18px;
`

const StatsRow = styled.div`
  display: flex;
  gap: 24px;
  padding: 20px 24px;
  background: #f8fafc;
  border-radius: 14px;
  width: 100%;
  justify-content: center;
`

const StatItem = styled.div`text-align: center;`
const StatVal = styled.div`font-size: 28px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px;`
const StatLbl = styled.div`font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 3px;`

const Message = styled.div`
  font-size: 14px;
  color: #475569;
  line-height: 1.72;
  max-width: 320px;
`

const Buttons = styled.div`display: flex; gap: 10px; width: 100%;`

const ShareBtn = styled.button`
  flex: 1;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px;
  font-size: 13px;
  font-weight: 700;
  color: #334155;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.12s;
  &:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
`

const ContinueBtn = styled.button`
  flex: 1;
  background: #2563eb;
  border: none;
  border-radius: 10px;
  padding: 12px;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.12s, transform 0.1s;
  &:hover { background: #1d4ed8; transform: translateY(-1px); }
`

export default function CompletionCelebration({ tree, stats, onClose }) {
  const [copied, setCopied] = useState(false)

  const pieces = useMemo(() =>
    Array.from({ length: 55 }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      left: `${(i / 55) * 100 + (Math.random() - 0.5) * 8}%`,
      delay: `${Math.random() * 3}s`,
      width: `${6 + Math.random() * 8}px`,
      height: `${10 + Math.random() * 14}px`,
      duration: `${2.8 + Math.random() * 2.2}s`,
    }))
  , [])

  function handleShare() {
    const text = `🎉 I just completed the "${tree?.target_role}" learning path on SkillOS!\n✅ ${stats?.nodes} skills mastered · ⏱ ${stats?.totalHours}h studied\nBuild your own career skill tree at SkillOS.`
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <Overlay
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {pieces.map(p => (
        <Piece
          key={p.id}
          style={{
            left: p.left,
            background: p.color,
            width: p.width,
            height: p.height,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}

      <Card
        as={motion.div}
        initial={{ scale: 0.75, opacity: 0, y: 32 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 18 }}
      >
        <BigEmoji>🎉</BigEmoji>
        <Title>Path Complete!</Title>
        <Role>{tree?.target_role}</Role>

        <StatsRow>
          <StatItem>
            <StatVal>{stats?.totalHours}h</StatVal>
            <StatLbl>Estimated</StatLbl>
          </StatItem>
          <StatItem>
            <StatVal>{stats?.nodes}</StatVal>
            <StatLbl>Skills</StatLbl>
          </StatItem>
          <StatItem>
            <StatVal>100%</StatVal>
            <StatLbl>Complete</StatLbl>
          </StatItem>
        </StatsRow>

        <Message>
          Every skill on this path is mastered. You've put in the work — now go build something great. 🚀
        </Message>

        <Buttons>
          <ShareBtn onClick={handleShare}>
            {copied ? '✓ Copied to clipboard!' : '📋 Share Achievement'}
          </ShareBtn>
          <ContinueBtn onClick={onClose}>Continue →</ContinueBtn>
        </Buttons>
      </Card>
    </Overlay>
  )
}
