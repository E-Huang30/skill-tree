const BASE = import.meta.env.VITE_API_URL ?? ''

export async function getTrees(userId) {
  const res = await fetch(`${BASE}/trees?user_id=${userId}`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function getTree(id) {
  const res = await fetch(`${BASE}/trees/${id}`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function generateTree(userId, targetRole, context = '') {
  const res = await fetch(`${BASE}/trees/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, target_role: targetRole, context })
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function getTreeBudget(id) {
  const res = await fetch(`${BASE}/trees/${id}/budget`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function deleteTree(id) {
  const res = await fetch(`${BASE}/trees/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
