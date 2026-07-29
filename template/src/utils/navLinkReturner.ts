import type { NavReturnerSelection } from '../store/navReturnerState'

/** Returner highlight class — paired with --nav-link-returner-bg in coach-tokens.css */
export const NAV_LINK_RETURNER_CLASS = 'v1-nav-link--returner'
export const NAV_ROW_RETURNER_CLASS = 'v3-nav-row--returner'

export type NavReturnerDepth = 'l1' | 'l2' | 'l3'

export type NavReturnerHighlightContext = {
  categoryId?: string
  subCategoryId?: string
}

function depthToNumber(depth: NavReturnerDepth): number {
  if (depth === 'l1') return 0
  if (depth === 'l2') return 1
  return 2
}

/** During drill-back exit, the revealed tier is `exitingIndex` — not `stack.length`. */
export function getEffectiveDrillDepth(
  stackLength: number,
  exitingIndex: number | null,
): number {
  return exitingIndex !== null ? exitingIndex : stackLength
}

/**
 * Returner row id for the current drill depth — highlights the clicked row at its
 * tier, and parent path entries when backing up (coach.com returner screenshots).
 */
export function getReturnerHighlightId(
  depth: NavReturnerDepth,
  drillDepth: number,
  selection: NavReturnerSelection | null,
  context?: NavReturnerHighlightContext,
): string | null {
  if (!selection?.stack.length) return null

  const targetDepth = depthToNumber(depth)
  if (drillDepth !== targetDepth) return null

  const { linkId, stack, clickedDepth } = selection

  if (context?.categoryId && stack[0]?.id !== context.categoryId) return null
  if (depth === 'l3' && context?.subCategoryId && stack[1]?.id !== context.subCategoryId) {
    return null
  }

  if (clickedDepth === targetDepth) return linkId
  if (clickedDepth > targetDepth) return stack[targetDepth]?.id ?? null
  return null
}

export function isNavLinkReturnerHighlight(
  linkId: string | undefined,
  returnerHighlightId: string | null | undefined,
): boolean {
  return Boolean(linkId && returnerHighlightId && linkId === returnerHighlightId)
}

export function navLinkReturnerClass(
  linkId: string | undefined,
  returnerHighlightId: string | null | undefined,
): string {
  return isNavLinkReturnerHighlight(linkId, returnerHighlightId)
    ? NAV_ROW_RETURNER_CLASS
    : ''
}
