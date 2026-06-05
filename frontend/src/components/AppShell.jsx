import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { getTrees } from '../api/trees'
import CreateTreeModal from './CreateTreeModal'
import CreateUserModal from './CreateUserModal'

const Shell = styled.div`
  display: flex;
  height: 100%;
  background: #080812;
  overflow: hidden;
`

const Sidebar = styled.nav`
  width: 232px;
  min-width: 232px;
  background: #0b0b18;
  border-right: 1px solid #141424;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const Logo = styled.div`
  padding: 18px 18px 14px;
  border-bottom: 1px solid #141424;
  flex-shrink: 0;
`

const LogoTop = styled.div`
  font-size: 11px;
  color: #4a70b0;
  letter-spacing: 2.5px;
  font-weight: 700;
`

const LogoSub = styled.div`
  font-size: 9px;
  color: #2a3a55;
  letter-spacing: 3px;
  margin-top: 2px;
`

const SectionLabel = styled.div`
  padding: 14px 18px 6px;
  font-size: 8px;
  color: #2a3a55;
  letter-spacing: 3px;
  flex-shrink: 0;
`

const TreeList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 4px 10px;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: #141424; border-radius: 2px; }
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
    background: #0e1628;
    border-color: #1e3560;
    border-left-color: #4a80d8;
  ` : `
    &:hover { background: #0e0e1e; }
  `}
`

const TreeName = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${p => p.$active ? '#8ab4f8' : '#6a7a9a'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const TreeRole = styled.div`
  font-size: 9px;
  color: #2a3a55;
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const NewBtn = styled.button`
  margin: 10px;
  padding: 9px;
  background: transparent;
  border: 1px solid #141e2e;
  border-radius: 5px;
  color: #3a5888;
  font-size: 9px;
  font-family: inherit;
  cursor: pointer;
  letter-spacing: 1.5px;
  flex-shrink: 0;
  transition: all 0.12s;

  &:hover {
    background: #0e1628;
    border-color: #1e3560;
    color: #5a80c0;
  }
`

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
    }
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
          <LogoTop>BLUESCRIPT</LogoTop>
          <LogoSub>SKILL OS</LogoSub>
        </Logo>
        <SectionLabel>CAREER TREES</SectionLabel>
        <TreeList>
          {trees.length === 0 ? (
            <div style={{ padding: '10px 4px', fontSize: 9, color: '#1e2a3a', letterSpacing: 1, lineHeight: 1.8 }}>
              NO TREES YET.<br />GENERATE YOUR FIRST ONE.
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
