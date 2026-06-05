import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { getTrees } from '../api/trees'
import { useTheme } from '../context/ThemeContext'
import CreateTreeModal from './CreateTreeModal'
import CreateUserModal from './CreateUserModal'
import AboutModal from './AboutModal'

export default function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()

  const [trees, setTrees]               = useState([])
  const [showCreate, setShowCreate]     = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showAbout, setShowAbout]       = useState(false)

  const match    = location.pathname.match(/\/trees\/(\d+)/)
  const activeId = match ? match[1] : null

  function loadTrees(userId) {
    getTrees(userId).then(setTrees).catch(console.error)
  }

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) setShowUserModal(true)
    else loadTrees(userId)
  }, [])

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
          <LogoRow>
            <div>
              <LogoTop>BLUESCRIPT</LogoTop>
              <LogoSub>SKILL OS</LogoSub>
            </div>
            <ThemeToggle onClick={toggleTheme} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
              {isDark ? '○' : '●'}
            </ThemeToggle>
          </LogoRow>
        </Logo>

        <SectionLabel>CAREER TREES</SectionLabel>

        <TreeList>
          {trees.length === 0 ? (
            <EmptyNote>NO TREES YET.<br />GENERATE YOUR FIRST ONE.</EmptyNote>
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
        <AboutBtn onClick={() => setShowAbout(true)}>? HOW THIS WORKS</AboutBtn>
      </Sidebar>

      <MainContent>
        <Outlet />
      </MainContent>

      {showUserModal && <CreateUserModal onCreated={handleUserCreated} />}
      {showCreate    && <CreateTreeModal onClose={() => setShowCreate(false)} onCreated={handleTreeCreated} />}
      {showAbout     && <AboutModal onClose={() => setShowAbout(false)} />}
    </Shell>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const Shell = styled.div`
  display: flex;
  height: 100%;
  background: var(--bg);
  overflow: hidden;
`

const Sidebar = styled.nav`
  width: 232px;
  min-width: 232px;
  background: var(--panel);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const Logo = styled.div`
  padding: 18px 18px 14px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
`

const LogoRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`

const LogoTop = styled.div`
  font-size: 11px;
  color: var(--accent);
  letter-spacing: 2.5px;
  font-weight: 700;
`

const LogoSub = styled.div`
  font-size: 9px;
  color: var(--muted);
  letter-spacing: 3px;
  margin-top: 2px;
`

const ThemeToggle = styled.button`
  background: none;
  border: 1px solid var(--border);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  color: var(--muted);
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.12s;
  &:hover { border-color: var(--accent); color: var(--accent); }
`

const SectionLabel = styled.div`
  padding: 14px 18px 6px;
  font-size: 8px;
  color: var(--muted);
  letter-spacing: 3px;
  flex-shrink: 0;
`

const TreeList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 4px 10px;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
`

const EmptyNote = styled.div`
  padding: 10px 4px;
  font-size: 9px;
  color: var(--dim);
  letter-spacing: 1px;
  line-height: 1.8;
`

const TreeItem = styled.div`
  padding: 9px 10px;
  border-radius: 5px;
  cursor: pointer;
  border: 1px solid transparent;
  border-left: 2px solid transparent;
  margin-bottom: 3px;
  transition: all 0.12s;

  ${({ $active }) => $active ? `
    background: var(--card);
    border-color: var(--border2);
    border-left-color: var(--accent);
  ` : `
    &:hover { background: var(--card); }
  `}
`

const TreeName = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${p => p.$active ? 'var(--accent)' : 'var(--text2)'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TreeRole = styled.div`
  font-size: 9px;
  color: var(--muted);
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const NewBtn = styled.button`
  margin: 10px 10px 4px;
  padding: 9px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 5px;
  color: var(--muted);
  font-size: 9px;
  font-family: inherit;
  cursor: pointer;
  letter-spacing: 1.5px;
  flex-shrink: 0;
  transition: all 0.12s;
  &:hover { background: var(--card); border-color: var(--accent); color: var(--accent); }
`

const AboutBtn = styled.button`
  margin: 0 10px 10px;
  padding: 7px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 5px;
  color: var(--dim);
  font-size: 8px;
  font-family: inherit;
  cursor: pointer;
  letter-spacing: 1px;
  flex-shrink: 0;
  transition: all 0.12s;
  &:hover { color: var(--muted); border-color: var(--border); }
`

const MainContent = styled.main`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`
