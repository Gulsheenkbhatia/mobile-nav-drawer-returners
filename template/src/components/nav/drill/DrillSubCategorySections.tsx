import type { MenuLink, MenuSubCategorySection } from '../../../data/mobileMenuData'
import type { BrandId } from '../NavSearchExposed'
import {
  shouldShowSectionEyebrow,
  shouldShowDrillLeadingEyebrow,
  type NavEyebrowContext,
} from '../../../data/navEyebrowVisibility'
import { getV3L2LinkLabel } from '../../../data/v3ContentSpots'
import { CoachIconMask } from '../../CoachIconMask'
import {
  shouldDrillNavLink,
  shouldShowNavLinkChevron,
} from '../../../utils/navLinkChevron'
import { isNavigableMenuLink, resolveTerminalSubNavLink } from '../../../utils/navLinkNavigate'
import { toNavHeadlineCase } from '../../../utils/toNavHeadlineCase'
import { navLinkReturnerClass } from '../../../utils/navLinkReturner'
import {
  NavEnterGroup,
  getNavLinkEnterPreset,
  type NavAnimDirection,
} from '../v3/NavEnter'

const CHEVRON_RIGHT = '/assets/icons/chevron-right.svg'

type DrillSubCategorySectionsProps = {
  sections: MenuSubCategorySection[]
  className?: string
  screenTitle: string
  categoryId: string
  brand: BrandId
  /** Eyebrow from L2 content spots — shown on first section when it has no eyebrow. */
  leadingEyebrow?: string
  animDirection: NavAnimDirection
  mountKey: string
  returnerLinkId?: string | null
  onSelectSub: (subId: string, title: string) => void
  onNavigateLink?: (link: MenuLink) => void
}

/** L2 chevron sub-category lists — one or more sections with 32px between groups. */
export function DrillSubCategorySections({
  sections,
  className = 'v3-l2__sections',
  screenTitle,
  categoryId,
  brand,
  leadingEyebrow,
  animDirection,
  mountKey,
  returnerLinkId = null,
  onSelectSub,
  onNavigateLink,
}: DrillSubCategorySectionsProps) {
  const ctx: NavEyebrowContext = {
    depth: 'l2',
    screenTitle,
    sectionCount: sections.length,
  }

  const sectionBlocks = sections
    .map((section, sectionIndex) => {
      if (section.subCategories.length === 0) return null

      const showSectionEyebrow =
        shouldShowSectionEyebrow(section, ctx) && section.eyebrow
      const leading =
        sectionIndex === 0 &&
        shouldShowDrillLeadingEyebrow(ctx, leadingEyebrow) &&
        !showSectionEyebrow
          ? leadingEyebrow
          : null
      const eyebrowLabel =
        showSectionEyebrow && section.eyebrow ? section.eyebrow : leading

      return { section, eyebrowLabel, sectionIndex }
    })
    .filter((block): block is NonNullable<typeof block> => block !== null)

  if (sectionBlocks.length === 0) return null

  const phase = animDirection === 'exit' ? 'exit' : 'enter'
  const preset = getNavLinkEnterPreset('drill', phase)
  let staggerOffset = 0

  return (
    <div className={className}>
      {sectionBlocks.map(({ section, eyebrowLabel }) => {
        const animatedCount = section.subCategories.length
        const delay = preset.delay + staggerOffset * preset.stagger
        staggerOffset += phase === 'exit' ? animatedCount : animatedCount + (eyebrowLabel ? 1 : 0)

        return (
          <NavEnterGroup
            key={`${mountKey}-${section.id}`}
            as="ul"
            list
            delay={delay}
            stagger={preset.stagger}
            variant={preset.variant}
            direction={animDirection}
            className="v3-l2__section v3-l2__sub-list"
          >
            {eyebrowLabel && (
              <li className="v3-l2__eyebrow-item nav-enter-group__item--static">
                <p className="v3-l2__eyebrow">{toNavHeadlineCase(eyebrowLabel)}</p>
              </li>
            )}
            {section.subCategories.map((sub) => {
              const rowLabel = getV3L2LinkLabel(sub.id, sub.label)

              return (
                <li
                  key={sub.id}
                  className={navLinkReturnerClass(sub.id, returnerLinkId) || undefined}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (shouldDrillNavLink(sub.label, sub.id)) {
                        onSelectSub(sub.id, rowLabel)
                        return
                      }
                      const terminalLink = resolveTerminalSubNavLink(
                        categoryId,
                        sub.id,
                        brand,
                      )
                      if (terminalLink && isNavigableMenuLink(terminalLink)) {
                        onNavigateLink?.(terminalLink)
                      }
                    }}
                    className="v1-nav-link flex w-full items-center justify-between text-left"
                  >
                    <span className="min-w-0 flex-1 font-extended text-[16px] leading-[1.4] tracking-[0.2px] text-coach-black">
                      {toNavHeadlineCase(rowLabel)}
                    </span>
                    {shouldShowNavLinkChevron(sub.label, sub.id) && (
                      <CoachIconMask src={CHEVRON_RIGHT} size={16} />
                    )}
                  </button>
                </li>
              )
            })}
          </NavEnterGroup>
        )
      })}
    </div>
  )
}
