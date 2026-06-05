const BASE = import.meta.env.VITE_API_URL ?? ''

export async function updateNode(id, { status, user_resources, branch_label } = {}) {
  const res = await fetch(`${BASE}/nodes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, user_resources, branch_label })
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function injectNode(treeId, title, description, parentNodeId) {
  const res = await fetch(`${BASE}/nodes/inject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tree_id: treeId, title, description, parent_node_id: parentNodeId })
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
