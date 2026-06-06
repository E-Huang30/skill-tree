import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <Page>
      <Card>
        <TreeIcon>🌿</TreeIcon>
        <Title>No tree selected</Title>
        <Sub>Pick a career tree from the sidebar, or generate a new one to get started.</Sub>
        <Hint>← Click <strong>+ New Tree</strong> in the sidebar</Hint>
      </Card>
    </Page>
  )
}

const Page = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
`

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  max-width: 340px;
  padding: 48px 32px;
  background: #f8faff;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
`

const TreeIcon = styled.div`font-size: 48px; line-height: 1;`

const Title = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.3px;
`

const Sub = styled.div`
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
`

const Hint = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 20px;
  padding: 6px 16px;
`
