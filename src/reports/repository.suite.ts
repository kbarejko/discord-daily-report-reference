import { describe, expect, it } from 'vitest'

import type { ReportRepository } from './types'

const base = {
  discordUserId: 'u1',
  day: '2026-10-07',
  done: 'x',
  hours: 7,
  problems: null,
  plan: null,
}

/** The contract as tests. Every implementation runs the same suite (#16). */
export function describeReportRepository(name: string, make: () => Promise<ReportRepository>) {
  describe(name, () => {
    it('saves a report and finds it by user and day', async () => {
      const repo = await make()
      const saved = await repo.upsert(base)
      expect(saved.id).toBeTruthy()
      expect(await repo.findByUserAndDay('u1', '2026-10-07')).toEqual(saved)
      expect(await repo.findByUserAndDay('u1', '2026-10-08')).toBeNull()
    })

    it('replaces the same day instead of adding a second report (D7)', async () => {
      const repo = await make()
      const first = await repo.upsert(base)
      const second = await repo.upsert({ ...base, hours: 8 })
      expect(second.id).toBe(first.id)
      expect(await repo.listByUser('u1', { from: '2026-10-01', to: '2026-10-31' })).toHaveLength(1)
      expect((await repo.findByUserAndDay('u1', '2026-10-07'))?.hours).toBe(8)
    })

    it('lists a date range in day order and only for that user', async () => {
      const repo = await make()
      await repo.upsert({ ...base, day: '2026-10-09' })
      await repo.upsert({ ...base, day: '2026-10-07' })
      await repo.upsert({ ...base, discordUserId: 'u2', day: '2026-10-08' })
      const days = (await repo.listByUser('u1', { from: '2026-10-07', to: '2026-10-08' })).map(
        (r) => r.day,
      )
      expect(days).toEqual(['2026-10-07'])
    })

    it('knows who reported on a day', async () => {
      const repo = await make()
      await repo.upsert(base)
      await repo.upsert({ ...base, discordUserId: 'u2' })
      expect((await repo.listUserIdsWithReport('2026-10-07')).sort()).toEqual(['u1', 'u2'])
      expect(await repo.listUserIdsWithReport('2026-10-08')).toEqual([])
    })
  })
}
