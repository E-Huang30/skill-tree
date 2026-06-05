const BASE = import.meta.env.VITE_API_URL ?? ''

export async function runSimulation(userId, targetRole, sourceTreeId = null) {
  const res = await fetch(`${BASE}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, target_role: targetRole, source_tree_id: sourceTreeId }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
