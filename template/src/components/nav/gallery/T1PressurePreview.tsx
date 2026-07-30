import { SearchIcon16 } from '../HeaderIcons'
import { CoachIconMask } from '../../CoachIconMask'
import { CoachtopiaLogo, isCoachtopiaCategory } from '../CoachLogos'
import { DrillLinkSections } from '../drill/DrillLinkSections'
import { DrillSubCategorySections } from '../drill/DrillSubCategorySections'
import { resolveNavDrillL2Body } from '../../../data/navDrillSections'
import { resolveV3CategoryDetail } from '../../../data/v3CategoryFixtures'
import type { MenuCategory } from '../../../data/mobileMenuData'
import {
  getL1ContentSpotsAnchorCategoryId,
  isL1ContentSpotsInline,
  isL2ContentSpotsBelowSections,
  type V3L1ContentSpotsConfig,
  type V3L2ContentSpotsConfig,
  type V3L2ContentSpotsPlacement,
} from '../../../data/v3ContentSpots'
import type { BrandId } from '../NavSearchExposed'
import {
  NavEnterGroup,
  NAV_CONTENT_SPOTS_L1_ENTER,
  NAV_CONTENT_SPOTS_DRILL_ENTER,
  getNavLinkEnterPreset,
} from '../v3/NavEnter'
import { toNavHeadlineCase } from '../../../utils/toNavHeadlineCase'
import { formatDrillTitle } from '../../../utils/navDrillTitle'
import { shouldShowNavLinkChevron } from '../../../utils/navLinkChevron'

const CHEVRON_RIGHT = '/assets/icons/chevron-right.svg'
const FOOTER_LINKS = ['Track Order', 'Help', '$USD', 'Login'] as const
const campaignImage = '/assets/figma/v3-campaign.png'

function ContentSpotTile({
  src,
  hero = false,
  label = 'Copy Goes Here',
  showImage = true,
}: {
  src?: string
  hero?: boolean
  label?: string
  showImage?: boolean
}) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className={`v3-content-spots__tile ${hero ? 'v3-content-spots__tile--hero' : ''} ${!showImage ? 'v3-content-spots__tile--no-image' : ''}`}
    >
      {showImage && <img src={src ?? campaignImage} alt="" loading="lazy" />}
      <div className="v3-content-spots__label">
        <span className="v3-content-spots__label-text">
          {toNavHeadlineCase(label)}
        </span>
      </div>
    </a>
  )
}

function L1ContentSpotsPreview({ config }: { config: V3L1ContentSpotsConfig }) {
  const { layout, tiles, tileAspectRatio } = config
  const ratioClass =
    tileAspectRatio === '4:5' ? ' v3-content-spots--tile-ratio-4-5' : ''

  return (
    <NavEnterGroup
      {...NAV_CONTENT_SPOTS_L1_ENTER}
      direction="idle"
      className={`v3-content-spots v3-content-spots--${layout}${ratioClass}`.trim()}
    >
      {tiles.map((tile, index) => (
        <ContentSpotTile
          key={`${tile.label}-${index}`}
          src={tile.image}
          hero={layout === 'l1-3' && index === 0}
          label={tile.label}
          showImage={Boolean(tile.image)}
        />
      ))}
    </NavEnterGroup>
  )
}

function L2ContentSpotsPreview({
  contentSpots,
}: {
  contentSpots: V3L2ContentSpotsConfig
}) {
  const ratioClass =
    contentSpots.tileAspectRatio === '4:5'
      ? ' v3-content-spots--tile-ratio-4-5'
      : ''
  const placement: V3L2ContentSpotsPlacement =
    contentSpots.placement ?? 'above-sections'
  const positionClass =
    placement === 'below-sections'
      ? ' v3-content-spots--l2-below-sections'
      : ' v3-content-spots--l2-under-headline'

  return (
    <NavEnterGroup
      {...NAV_CONTENT_SPOTS_DRILL_ENTER}
      direction="idle"
      className={`v3-content-spots v3-content-spots--${contentSpots.layout}${positionClass}${ratioClass}`.trim()}
    >
      {contentSpots.tiles.map((tile, i) => (
        <ContentSpotTile
          key={`${tile.label}-${i}`}
          src={tile.image}
          label={tile.label}
          showImage={Boolean(tile.image)}
        />
      ))}
    </NavEnterGroup>
  )
}

function L1CategoryRow({ cat }: { cat: MenuCategory }) {
  return (
    <li data-l1-category={cat.id}>
      <button
        type="button"
        className="v1-nav-link v3-l1__category-link flex w-full min-h-[28px] items-center justify-between text-left"
      >
        {isCoachtopiaCategory(cat.id) ? (
          <CoachtopiaLogo height={20} />
        ) : (
          <span className="min-w-0 flex-1 truncate font-extended text-[20px] leading-[1.2] tracking-[0.4px] text-coach-black">
            {toNavHeadlineCase(cat.label)}
          </span>
        )}
        {shouldShowNavLinkChevron(cat.label, cat.id) && (
          <CoachIconMask src={CHEVRON_RIGHT} size={16} />
        )}
      </button>
    </li>
  )
}

/** Static L1 menu preview for pressure testing scroll height with/without L1 collage. */
export function T1L1MenuPreview({
  brand,
  categories,
  l1ContentSpots,
}: {
  brand: BrandId
  categories: MenuCategory[]
  l1ContentSpots: V3L1ContentSpotsConfig | null
}) {
  const l1LinkPreset = getNavLinkEnterPreset('l1', 'enter')
  const inlineAfterCategoryId =
    l1ContentSpots && isL1ContentSpotsInline(l1ContentSpots.placement)
      ? getL1ContentSpotsAnchorCategoryId(l1ContentSpots.placement)
      : null
  const showAboveCategories =
    l1ContentSpots && !isL1ContentSpotsInline(l1ContentSpots.placement)
  const categoryRowCount = categories.length + (inlineAfterCategoryId ? 1 : 0)
  const utilityDelay =
    l1LinkPreset.delay + categoryRowCount * l1LinkPreset.stagger

  return (
    <div className="v3-l1 nav-t1-pressure__screen">
      <div className="invoked-menu__search-wrap">
        <label className="invoked-menu__search">
          <span className="invoked-menu__search-icon">
            <SearchIcon16 />
          </span>
          <input
            type="search"
            className="invoked-menu__search-input"
            placeholder="Search"
            aria-label="Search"
            readOnly
          />
        </label>
      </div>

      {showAboveCategories && l1ContentSpots && (
        <div className="v3-l1__content-spots-wrap">
          <L1ContentSpotsPreview config={l1ContentSpots} />
        </div>
      )}

      <div className="v3-l1__categories">
        <NavEnterGroup
          as="ul"
          list
          delay={l1LinkPreset.delay}
          stagger={l1LinkPreset.stagger}
          variant={l1LinkPreset.variant}
          direction="idle"
          className="v3-l1__category-list"
        >
          {categories.flatMap((cat) => {
            const row = <L1CategoryRow key={cat.id} cat={cat} />

            if (inlineAfterCategoryId && cat.id === inlineAfterCategoryId && l1ContentSpots) {
              return [
                row,
                <li key="l1-content-spots" className="v3-l1__content-spots-list-item">
                  <L1ContentSpotsPreview config={l1ContentSpots} />
                </li>,
              ]
            }

            return [row]
          })}
        </NavEnterGroup>

        <nav className="v3-l1__utility-section" aria-label="Account and support">
          <NavEnterGroup
            as="ul"
            list
            delay={utilityDelay}
            stagger={l1LinkPreset.stagger}
            variant={l1LinkPreset.variant}
            direction="idle"
            className="v3-l1__utility-list"
          >
            {FOOTER_LINKS.map((label) => (
              <li key={`utility-${label}`}>
                <button
                  type="button"
                  className="v1-utility-link flex items-center font-extended text-[12px] leading-[1.35] tracking-[0.2px]"
                >
                  {toNavHeadlineCase(label)}
                </button>
              </li>
            ))}
          </NavEnterGroup>
        </nav>
      </div>

      <div className="nav-t1-pressure__brand-badge" aria-hidden>
        {brand === 'coach' ? 'Coach' : 'Coach Outlet'}
      </div>
    </div>
  )
}

/** Static L2 drill preview for a single T1 category. */
export function T1L2DrillPreview({
  brand,
  categoryId,
  title,
  contentSpots,
}: {
  brand: BrandId
  categoryId: string
  title: string
  contentSpots?: V3L2ContentSpotsConfig
}) {
  const detail = resolveV3CategoryDetail(categoryId, brand)
  const drillBody = resolveNavDrillL2Body(detail)
  const spotsBelow = contentSpots ? isL2ContentSpotsBelowSections(contentSpots) : false
  const spotsAbove = contentSpots && !spotsBelow
  const sectionsClassName = spotsAbove
    ? 'v3-l2__sections v3-l2__sections--after-content-spots'
    : 'v3-l2__sections'

  return (
    <div
      className={`v3-l2 nav-t1-pressure__screen${contentSpots ? ' v3-l2--with-content-spots' : ''}${spotsBelow ? ' v3-l2--content-spots-below' : ''}`.trim()}
    >
      <div className="v3-l2__header">
        <button
          type="button"
          aria-label="Back"
          className="v3-l2__header-back flex size-6 items-center justify-center text-coach-black"
        >
          <svg viewBox="0 0 24 24" width={24} height={24} fill="none" aria-hidden>
            <path
              d="M20 12H4m0 0 6.5-6.5M4 12l6.5 6.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h2 className="v3-l2__header-title v1-nav-link font-extended text-[16px] leading-[1.4] tracking-[0.2px] text-coach-black">
          {formatDrillTitle(title)}
        </h2>
      </div>

      {spotsAbove && contentSpots && (
        <L2ContentSpotsPreview contentSpots={contentSpots} />
      )}

      {drillBody?.kind === 'sub-category-sections' && (
        <div className={spotsAbove ? 'v3-l2__category-block' : undefined}>
          <DrillSubCategorySections
            sections={drillBody.sections}
            className={sectionsClassName}
            screenTitle={title}
            categoryId={categoryId}
            brand={brand}
            leadingEyebrow={spotsAbove ? contentSpots?.eyebrow : undefined}
            animDirection="idle"
            mountKey="pressure"
            onSelectSub={() => {}}
          />
        </div>
      )}

      {drillBody?.kind === 'flat-sections' && (
        <DrillLinkSections
          sections={drillBody.sections}
          className={sectionsClassName}
          depth="l2"
          screenTitle={title}
          animDirection="idle"
          mountKey="pressure"
        />
      )}

      {spotsBelow && contentSpots && (
        <L2ContentSpotsPreview contentSpots={contentSpots} />
      )}
    </div>
  )
}
