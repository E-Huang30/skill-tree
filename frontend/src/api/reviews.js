const BASE = import.meta.env.VITE_API_URL ?? ''

export async function getReviews() {
  const res = await fetch(`${BASE}/reviews`)
  if (!res.ok) throw new Error('Failed to load reviews')
  return res.json()
}

export async function submitReview({ name, rating, text }) {
  const res = await fetch(`${BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, rating, text }),
  })
  if (!res.ok) throw new Error('Failed to submit review')
  return res.json()
}
