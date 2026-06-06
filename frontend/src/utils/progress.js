// ── Streak tracking ────────────────────────────────────────────────────────────

export function getStreak(userId) {
  if (!userId) return { days: 0, lastDate: null, longest: 0 }
  try {
    return JSON.parse(localStorage.getItem(`streak_${userId}`)) || { days: 0, lastDate: null, longest: 0 }
  } catch {
    return { days: 0, lastDate: null, longest: 0 }
  }
}

export function markActiveToday(userId) {
  if (!userId) return { days: 0, lastDate: null, longest: 0 }
  const today = new Date().toISOString().slice(0, 10)
  const data = getStreak(userId)
  if (data.lastDate === today) return data

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const days = data.lastDate === yesterday ? (data.days || 0) + 1 : 1
  const longest = Math.max(data.longest || 0, days)
  const updated = { days, lastDate: today, longest }
  localStorage.setItem(`streak_${userId}`, JSON.stringify(updated))
  window.dispatchEvent(new Event('streak-updated'))
  return updated
}

// ── Resource progress ──────────────────────────────────────────────────────────

function rpKey(userId, nodeId, idx) {
  return `rp_${userId}_${nodeId}_${idx}`
}

export function getResourceProgress(userId, nodeId, idx) {
  if (!userId || nodeId == null || idx == null) return { done: false, seconds: 0 }
  try {
    return JSON.parse(localStorage.getItem(rpKey(userId, nodeId, idx))) || { done: false, seconds: 0 }
  } catch {
    return { done: false, seconds: 0 }
  }
}

export function saveResourceProgress(userId, nodeId, idx, data) {
  if (!userId || nodeId == null || idx == null) return
  localStorage.setItem(rpKey(userId, nodeId, idx), JSON.stringify(data))
}

export function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}
