import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { getTrees } from '../api/trees'
import TreeCard from '../components/TreeCard'
import CreateTreeModal from '../components/CreateTreeModal'
import CreateUserModal from '../components/CreateUserModal'

const Page = styled.div`max-width: 1100px; margin: 0 auto; padding: 40px 24px;`
const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px;
`
const Heading = styled.h1`font-size: 24px; font-weight: 700;`
const AddButton = styled.button`
  background: #4f46e5; color: white; border: none; border-radius: 8px;
  padding: 10px 20px; cursor: pointer; font-size: 14px; font-weight: 600;
  &:hover { background: #4338ca; }
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`
const Empty = styled.p`color: #555; font-size: 15px; margin-top: 60px; text-align: center;`

export default function Dashboard() {
  const [trees, setTrees] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      setShowUserModal(true)
      return
    }
    getTrees(userId).then(setTrees).catch(console.error)
  }, [])

  function handleUserCreated(user) {
    setShowUserModal(false)
    getTrees(user.id).then(setTrees).catch(console.error)
  }

  function handleTreeCreated(tree) {
    setTrees(prev => [tree, ...prev])
    setShowCreate(false)
  }

  return (
    <Page>
      {showUserModal && <CreateUserModal onCreated={handleUserCreated} />}
      {showCreate && (
        <CreateTreeModal
          onClose={() => setShowCreate(false)}
          onCreated={handleTreeCreated}
        />
      )}
      <Header>
        <Heading>My Skill Trees</Heading>
        <AddButton onClick={() => setShowCreate(true)}>+ New Tree</AddButton>
      </Header>
      {trees.length === 0
        ? <Empty>No skill trees yet. Generate your first one.</Empty>
        : <Grid>{trees.map(t => <TreeCard key={t.id} tree={t} />)}</Grid>
      }
    </Page>
  )
}
