const BASE = import.meta.env.VITE_API_URL ?? ''

export async function createUser(email, username) {
  const res = await fetch(`${BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username })
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function getUser(id) {
  const res = await fetch(`${BASE}/users/${id}`)
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
