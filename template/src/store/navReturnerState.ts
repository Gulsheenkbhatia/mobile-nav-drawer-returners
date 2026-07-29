import type { BrandId } from '../components/nav/NavSearchExposed'

export type NavReturnerStackEntry = {
  id: string
  title: string
}

export type NavReturnerClickedDepth = 0 | 1 | 2

/** Last nav row selected at any tier — drives returner highlight. */
export type NavReturnerSelection = {
  linkId: string
  label: string
  href?: string
  brand: BrandId
  /** Drill path at the time of the click. */
  stack: NavReturnerStackEntry[]
  clickedDepth: NavReturnerClickedDepth
}

export type NavReturnerPersistedState = {
  brand: BrandId
  /** Drill position when the nav drawer was last closed. */
  drillStack: NavReturnerStackEntry[]
  selection: NavReturnerSelection | null
}

const STORAGE_KEY = 'coach-nav-returner-v1'

function inferClickedDepth(
  linkId: string,
  stack: NavReturnerStackEntry[],
): NavReturnerClickedDepth {
  if (stack.length >= 2) return 2
  if (stack.length === 1) {
    return linkId === stack[0]?.id ? 0 : 1
  }
  return 0
}

function normalizeSelection(
  raw: Partial<NavReturnerSelection> & {
    linkId: string
    label: string
    brand: BrandId
    stack: NavReturnerStackEntry[]
  },
): NavReturnerSelection {
  return {
    linkId: raw.linkId,
    label: raw.label,
    href: raw.href,
    brand: raw.brand,
    stack: raw.stack,
    clickedDepth:
      raw.clickedDepth ?? inferClickedDepth(raw.linkId, raw.stack),
  }
}

function parsePersistedState(raw: unknown): NavReturnerPersistedState | null {
  if (!raw || typeof raw !== 'object') return null

  const data = raw as Record<string, unknown>

  // Legacy: flat NavReturnerSelection without drillStack
  if (data.linkId && data.brand && Array.isArray(data.stack)) {
    const selection = normalizeSelection(
      data as NavReturnerSelection,
    )
    return {
      brand: selection.brand,
      drillStack: selection.stack,
      selection,
    }
  }

  if (!data.brand || typeof data.brand !== 'string') return null

  const drillStack = Array.isArray(data.drillStack)
    ? (data.drillStack as NavReturnerStackEntry[])
    : []

  const selectionRaw = data.selection
  const selection =
    selectionRaw &&
    typeof selectionRaw === 'object' &&
    'linkId' in selectionRaw
      ? normalizeSelection(selectionRaw as NavReturnerSelection)
      : null

  return {
    brand: data.brand as BrandId,
    drillStack,
    selection,
  }
}

export function saveNavReturnerState(state: NavReturnerPersistedState): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore quota / private mode errors in prototype.
  }
}

export function readNavReturnerState(): NavReturnerPersistedState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return parsePersistedState(JSON.parse(raw))
  } catch {
    return null
  }
}

export function saveNavReturner(selection: NavReturnerSelection): void {
  const existing = readNavReturnerState()
  saveNavReturnerState({
    brand: selection.brand,
    drillStack: existing?.drillStack ?? selection.stack,
    selection,
  })
}

export function saveNavDrillPosition(
  brand: BrandId,
  drillStack: NavReturnerStackEntry[],
): void {
  const existing = readNavReturnerState()
  saveNavReturnerState({
    brand,
    drillStack,
    selection: existing?.brand === brand ? existing.selection : null,
  })
}

export function readNavReturner(): NavReturnerSelection | null {
  return readNavReturnerState()?.selection ?? null
}

export function clearNavReturner(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // noop
  }
}

export function getNavReturnerForBrand(
  brand: BrandId,
): NavReturnerPersistedState | null {
  const state = readNavReturnerState()
  if (!state || state.brand !== brand) return null
  return state
}
