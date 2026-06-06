import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { getTrees } from '../api/trees'
import CreateTreeModal from './CreateTreeModal'
import CreateUserModal from './CreateUserModal'
import { getStreak } from '../utils/progress'

const Shell = styled.div`
  display: flex;
  height: 100%;
  background: #ffffff;
  overflow: hidden;
`

const Sidebar = styled.nav`
  width: 220px;
  min-width: 220px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const Logo = styled.div`
  padding: 18px 18px 14px;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 9px;
`

const LogoHex = styled.div`
  font-size: 20px;
  color: #2563eb;
  line-height: 1;
`

const LogoTop = styled.div`
  font-size: 14px;
  color: #0f172a;
  font-weight: 800;
  letter-spacing: -0.3px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
`

const LogoSub = styled.div`
  font-size: 9px;
  color: #94a3b8;
  letter-spacing: 1.5px;
  margin-top: 1px;
  font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
`

const SectionLabel = styled.div`
  padding: 14px 18px 6px;
  font-size: 9px;
  color: #94a3b8;
  letter-spacing: 2px;
  font-weight: 600;
  flex-shrink: 0;
  font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  text-transform: uppercase;
`

const TreeList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 4px 10px;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }
`

const TreeItem = styled.div`
  padding: 9px 10px;
  border-radius: 7px;
  cursor: pointer;
  border-left: 3px solid transparent;
  margin-bottom: 2px;
  transition: all 0.12s;
  font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;

  ${({ $active }) => $active ? `
    background: #eff6ff;
    border-left-color: #2563eb;
  ` : `
    &:hover { background: #f8fafc; }
  `}
`

const TreeName = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${p => p.$active ? '#2563eb' : '#334155'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TreeRole = styled.div`
  font-size: 10px;
  color: #94a3b8;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
`

const NewBtn = styled.button`
  margin: 10px;
  padding: 10px;
  background: #2563eb;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.12s, transform 0.1s;

  &:hover { background: #1d4ed8; transform: translateY(-1px); }
  &:active { transform: none; }
`

const StreakBar = styled.div`
  margin: 8px 10px 4px;
  background: linear-gradient(135deg, #fff7ed, #fffbeb);
  border: 1.5px solid #fed7aa;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`
const StreakFire = styled.div`font-size: 22px; line-height: 1;`
const StreakInfo = styled.div``
const StreakDays = styled.div`font-size: 13px; font-weight: 800; color: #c2410c; line-height: 1;`
const StreakSub  = styled.div`font-size: 10px; color: #fb923c; margin-top: 2px; font-weight: 500;`

const MainContent = styled.main`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

export default function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const [trees, setTrees] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [streak, setStreak] = useState({ days: 0, longest: 0 })

  const match = location.pathname.match(/\/trees\/(\d+)/)
  const activeId = match ? match[1] : null

  function loadTrees(userId) {
    getTrees(userId).then(setTrees).catch(console.error)
  }

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      setShowUserModal(true)
    } else {
      loadTrees(userId)
      setStreak(getStreak(userId))
    }

    const onStreakUpdate = () => {
      const uid = localStorage.getItem('userId')
      if (uid) setStreak(getStreak(uid))
    }
    window.addEventListener('streak-updated', onStreakUpdate)
    return () => window.removeEventListener('streak-updated', onStreakUpdate)
  }, [])

  // Reload sidebar when navigating back to dashboard (after tree creation)
  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (userId) loadTrees(userId)
  }, [location.pathname])

  function handleUserCreated(user) {
    setShowUserModal(false)
    loadTrees(user.id)
  }

  function handleTreeCreated(tree) {
    setTrees(prev => [tree, ...prev])
    setShowCreate(false)
    navigate(`/trees/${tree.id}`)
  }

  return (
    <Shell>
      <Sidebar>
        <Logo>
          <LogoHex>⬡</LogoHex>
          <div>
            <LogoTop>SkillOS</LogoTop>
            <LogoSub>CAREER PATHS</LogoSub>
          </div>
        </Logo>
        {streak.days > 0 && (
          <StreakBar>
            <StreakFire>🔥</StreakFire>
            <StreakInfo>
              <StreakDays>{streak.days} day{streak.days !== 1 ? 's' : ''}</StreakDays>
              <StreakSub>
                {streak.days === streak.longest && streak.days > 1 ? '🏆 Personal best!' : `Best: ${streak.longest}d`}
              </StreakSub>
            </StreakInfo>
          </StreakBar>
        )}
        <SectionLabel>CAREER TREES</SectionLabel>
        <TreeList>
          {trees.length === 0 ? (
            <div style={{ padding: '12px 6px', fontSize: 11, color: '#94a3b8', lineHeight: 1.7, fontFamily: 'system-ui, sans-serif' }}>
              No trees yet.<br />Create your first one below.
            </div>
          ) : (
            trees.map(tree => {
              const isActive = String(tree.id) === activeId
              return (
                <TreeItem
                  key={tree.id}
                  $active={isActive}
                  onClick={() => navigate(`/trees/${tree.id}`)}
                >
                  <TreeName $active={isActive}>{tree.title || tree.target_role}</TreeName>
                  <TreeRole>{tree.target_role}</TreeRole>
                </TreeItem>
              )
            })
          )}
        </TreeList>
        <NewBtn onClick={() => setShowCreate(true)}>+ NEW TREE</NewBtn>
      </Sidebar>

      <MainContent>
        <Outlet />
      </MainContent>

      {showUserModal && (
        <CreateUserModal onCreated={handleUserCreated} />
      )}
      {showCreate && (
        <CreateTreeModal
          onClose={() => setShowCreate(false)}
          onCreated={handleTreeCreated}
        />
      )}
    </Shell>
  )
}
