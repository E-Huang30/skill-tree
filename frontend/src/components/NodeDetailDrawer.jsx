import { useState } from 'react'
import styled from 'styled-components'
import { updateNode } from '../api/nodes'

const Drawer = styled.div`
  position: absolute; top: 0; right: 0; bottom: 0; width: 360px;
  background: #1a1a2e; border-left: 1px solid #2a2a3e;
  padding: 24px; overflow-y: auto; z-index: 10;
  display: flex; flex-direction: column; gap: 20px;
`
const Row = styled.div`display: flex; justify-content: space-between; align-items: center;`
const DrawerTitle = styled.h2`font-size: 18px; font-weight: 600;`
const CloseButton = styled.button`
  background: transparent; border: none; color: #666; cursor: pointer;
  font-size: 22px; line-height: 1;
  &:hover { color: #f0f0f0; }
`
const Description = styled.p`font-size: 14px; color: #aaa; line-height: 1.5;`
const Label = styled.label`font-size: 12px; color: #666; display: block; margin-bottom: 6px;`
const Value = styled.p`font-size: 14px; color: #ccc;`
const Select = styled.select`
  background: #0f0f23; border: 1px solid #2a2a3e; border-radius: 6px;
  padding: 8px 12px; color: #f0f0f0; font-size: 14px; width: 100%;
  &:focus { outline: none; border-color: #4f46e5; }
`
const SaveButton = styled.button`
  background: #4f46e5; color: white; border: none; border-radius: 6px;
  padding: 10px; cursor: pointer; font-size: 14px; font-weight: 600;
  &:hover { background: #4338ca; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

const STATUSES = ['locked', 'available', 'in_progress', 'complete']

export default function NodeDetailDrawer({ node, onClose, onSaved }) {
  const [status, setStatus] = useState(node.status)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const updated = await updateNode(node.id, { status })
      onSaved(updated)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Drawer>
      <Row>
        <DrawerTitle>{node.title}</DrawerTitle>
        <CloseButton onClick={onClose}>×</CloseButton>
      </Row>
      {node.description && <Description>{node.description}</Description>}
      <div>
        <Label>Estimated hours</Label>
        <Value>{node.estimated_hours}h</Value>
      </div>
      {node.branch_label && (
        <div>
          <Label>Branch</Label>
          <Value>{node.branch_label}</Value>
        </div>
      )}
      <div>
        <Label>Status</Label>
        <Select value={status} onChange={e => setStatus(e.target.value)}>
          {STATUSES.map(s => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </Select>
      </div>
      <SaveButton onClick={handleSave} disabled={saving || status === node.status}>
        {saving ? 'Saving...' : 'Save changes'}
      </SaveButton>
    </Drawer>
  )
}
