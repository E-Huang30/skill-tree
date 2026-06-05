import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createUser, getUser } from './users'

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

describe('createUser', () => {
  it('posts to /users and returns user', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1, email: 'a@b.com', username: 'alice' })
    })
    const user = await createUser('a@b.com', 'alice')
    expect(user.id).toBe(1)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/users'),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('throws when response is not ok', async () => {
    fetch.mockResolvedValue({ ok: false, text: async () => 'email already exists' })
    await expect(createUser('a@b.com', 'alice')).rejects.toThrow('email already exists')
  })
})

describe('getUser', () => {
  it('fetches user by id', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 5, username: 'bob' })
    })
    const user = await getUser(5)
    expect(user.username).toBe('bob')
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/users/5'))
  })

  it('throws when user not found', async () => {
    fetch.mockResolvedValue({ ok: false, text: async () => 'not found' })
    await expect(getUser(999)).rejects.toThrow('not found')
  })
})
