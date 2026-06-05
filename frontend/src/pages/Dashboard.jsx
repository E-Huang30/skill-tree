import styled from 'styled-components'

const Empty = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #080812;
  gap: 10px;
`

const Msg = styled.div`
  font-size: 11px;
  color: #1e2a3a;
  letter-spacing: 2.5px;
  text-transform: uppercase;
`

const Sub = styled.div`
  font-size: 9px;
  color: #141e2e;
  letter-spacing: 1px;
`

export default function Dashboard() {
  return (
    <Empty>
      <Msg>SELECT A TREE</Msg>
      <Sub>or generate a new one from the sidebar</Sub>
    </Empty>
  )
}
