import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getTrees, generateTree, getTreeBudget } from './trees'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

describe('getTrees', () => {
  it('fetches trees for a user', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => [{ id: 1, title: 'SWE' }]
    })
    const trees = await getTrees(1)
    expect(trees).toHaveLength(1)
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('user_id=1'))
  })
})

describe('generateTree', () => {
  it('posts to /trees/generate with correct payload', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({ id: 2 }) })
    const tree = await generateTree(1, 'Frontend Engineer', 'I know React')
    expect(tree.id).toBe(2)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/trees/generate'),
      expect.objectContaining({ method: 'POST' })
    )
    const body = JSON.parse(fetch.mock.calls[0][1].body)
    expect(body.user_id).toBe(1)
    expect(body.target_role).toBe('Frontend Engineer')
    expect(body.context).toBe('I know React')
  })
})

describe('getTreeBudget', () => {
  it('fetches budget for a tree', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ estimated_weeks: 4, remaining_hours: 20 })
    })
    const budget = await getTreeBudget(3)
    expect(budget.estimated_weeks).toBe(4)
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/trees/3/budget'))
  })
})
