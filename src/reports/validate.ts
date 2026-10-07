import { messages } from '@/messages'

import type { NewReport } from './types'

/** What the form sends: strings, possibly empty. */
export type FormInput = { done: string; hours: string; problems?: string; plan?: string }

export type ReportFields = Pick<NewReport, 'done' | 'hours' | 'problems' | 'plan'>

export type Validation = { ok: true; value: ReportFields } | { ok: false; errors: string[] }

export const limits = { textMax: 1000, doneMin: 3, hoursMin: 0.25, hoursMax: 16 } as const

/** "7", "7.5", "7,5", "7 h", "7h" → 7 / 7.5; anything else → null. */
export function parseHours(text: string): number | null {
  const m = /^\s*(\d{1,2})(?:[.,](\d{1,2}))?\s*h?\s*$/i.exec(text)
  if (!m) return null
  return Number(`${m[1]}.${m[2] ?? '0'}`)
}

/** One place that decides what a valid report is (architecture §6.2). Returns errors, never throws. */
export function validateReport(input: FormInput): Validation {
  const errors: string[] = []
  const done = input.done.trim()
  if (done.length < limits.doneMin) errors.push(messages.validation.doneTooShort)
  if (done.length > limits.textMax) errors.push(messages.validation.doneTooLong)

  const hours = parseHours(input.hours)
  if (hours === null) errors.push(messages.validation.hoursNotANumber)
  else if (hours < limits.hoursMin || hours > limits.hoursMax)
    errors.push(messages.validation.hoursOutOfRange)

  const problems = (input.problems ?? '').trim()
  if (problems.length > limits.textMax) errors.push(messages.validation.problemsTooLong)
  const plan = (input.plan ?? '').trim()
  if (plan.length > limits.textMax) errors.push(messages.validation.planTooLong)

  if (errors.length > 0 || hours === null) return { ok: false, errors }
  return { ok: true, value: { done, hours, problems: problems || null, plan: plan || null } }
}
