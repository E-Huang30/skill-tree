import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

const Card = styled.div`
  background: #1a1a2e; border: 1px solid #2a2a3e; border-radius: 12px;
  padding: 20px; cursor: pointer; transition: border-color 0.15s;
  border-top: 4px solid ${p => p.$color || '#4f46e5'};
  &:hover { border-color: ${p => p.$color || '#4f46e5'}; }
`
const Title = styled.h3`font-size: 16px; font-weight: 600; margin-bottom: 4px;`
const Role = styled.p`font-size: 13px; color: #888; margin-bottom: 8px;`
const Meta = styled.p`font-size: 12px; color: #555;`

export default function TreeCard({ tree }) {
  const navigate = useNavigate()

  return (
    <Card $color={tree.color_theme} onClick={() => navigate(`/trees/${tree.id}`)}>
      <Title>{tree.title}</Title>
      <Role>{tree.target_role}</Role>
      <Meta>Created {new Date(tree.created_at).toLocaleDateString()}</Meta>
    </Card>
  )
}
