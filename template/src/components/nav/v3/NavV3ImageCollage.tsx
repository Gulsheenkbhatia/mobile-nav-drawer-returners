import { useEffect, useState, useRef, useCallback, type CSSProperties } from 'react'
import { InvokedMenuShell } from '../invoked/InvokedMenuShell'
import { useNavReturner } from '../NavReturnerContext'
import { DrillOverlay } from '../drill/DrillOverlay'
import { useDrillBack } from '../drill/useDrillBack'
import type { DrillStackEntry } from '../navDrillMotion'
import { NAV_DRAWER_CONTENT_DELAY_MS, NAV_DRILL_MS } from '../navDrillMotion'
import { SearchIcon16 } from '../HeaderIcons'
import {
  resolveV3CategoryDetail,
  resolveV3SubCategory,
} from '../../../data/v3CategoryFixtures'
import { DrillLinkSections } from '../drill/DrillLinkSections'
import { DrillSubCategorySections } from '../drill/DrillSubCategorySections'
import { resolveNavDrillL2Body } from '../../../data/navDrillSections'
import { getV3L1Categories } from '../../../data/v3L1Categories'
import type { MenuCategory, MenuCategoryDetail, MenuLink, MenuSubCategory } from '../../../data/mobileMenuData'
import {
  getV3L2ContentSpots,
  getV3L1ContentSpots,
  getL1ContentSpotsAnchorCategoryId,
  isL1ContentSpotsInline,
  hasV3L1ContentSpots,
  isL2ContentSpotsBelowSections,
  type V3L1ContentSpotsConfig,
  type V3L2ContentSpotsLayout,
  type V3L2ContentSpotAspectRatio,
  type V3L2ContentSpotsPlacement,
} from '../../../data/v3ContentSpots'
import type { BrandId } from '../NavSearchExposed'
import {
  NavEnterGroup,
  NAV_CONTENT_SPOTS_L1_ENTER,
  NAV_CONTENT_SPOTS_DRILL_ENTER,
  NAV_CONTENT_SPOTS_DRILL_EXIT,
  getNavLinkEnterPreset,
  type NavAnimDirection,
} from './NavEnter'
import { CoachIconMask } from '../../CoachIconMask'
import { CoachtopiaLogo, isCoachtopiaCategory } from '../CoachLogos'
import { toNavHeadlineCase } from '../../../utils/toNavHeadlineCase'
import { formatDrillTitle } from '../../../utils/navDrillTitle'
import { shouldShowNavLinkChevron } from '../../../utils/navLinkChevron'
import {
  getEffectiveDrillDepth,
  getReturnerHighlightId,
  navLinkReturnerClass,
} from '../../../utils/navLinkReturner'
import { useDrillReturnerSelect } from '../../../hooks/useDrillReturnerSelect'

const FOOTER_LINKS = ['Track Order', 'Help', '$USD', 'Login'] as const

const CHEVRON_RIGHT = '/assets/icons/chevron-right.svg'

function animMountKey(_direction: NavAnimDirection, enterKey: number): string {
  return String(enterKey)
}

const campaignImage = '/assets/figma/v3-campaign.png'

type NavV3ImageCollageProps = {
  open: boolean
  onClose: () => void
}

function ArrowBack() {
  return (
    <svg viewBox="0 0 24 24" width={24} height={24} fill="none" aria-hidden>
      <path
        d="M20 12H4m0 0 6.5-6.5M4 12l6.5 6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ContentSpotTile({
  src = campaignImage,
  hero = false,
  label = 'Copy Goes Here',
}: {
  src?: string
  hero?: boolean
  label?: string
}) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className={`v3-content-spots__tile ${hero ? 'v3-content-spots__tile--hero' : ''}`}
    >
      <img src={src} alt="" loading="lazy" />
      <div className="v3-content-spots__label">
        <span className="v3-content-spots__label-text">
          {toNavHeadlineCase(label)}
        </span>
      </div>
    </a>
  )
}

function L1ContentSpots({
  config,
  animDirection,
  enterKey,
}: {
  config: V3L1ContentSpotsConfig
  animDirection: NavAnimDirection
  enterKey: number
}) {
  const { layout, tiles, tileAspectRatio } = config
  const ratioClass =
    tileAspectRatio === '4:5' ? ' v3-content-spots--tile-ratio-4-5' : ''

  return (
    <NavEnterGroup
      key={animMountKey(animDirection, enterKey)}
      {...NAV_CONTENT_SPOTS_L1_ENTER}
      direction={animDirection}
      className={`v3-content-spots v3-content-spots--${layout}${ratioClass}`.trim()}
    >
      {tiles.map((tile, index) => (
        <ContentSpotTile
          key={`${tile.label}-${index}`}
          src={tile.image}
          hero={layout === 'l1-3' && index === 0}
          label={tile.label}
        />
      ))}
    </NavEnterGroup>
  )
}

function L1CategoryRow({
  cat,
  onSelect,
  returnerHighlightId = null,
  className,
  style,
}: {
  cat: MenuCategory
  onSelect: (id: string, title: string) => void
  returnerHighlightId?: string | null
  className?: string
  style?: CSSProperties
}) {
  const rowClassName = [
    className,
    navLinkReturnerClass(cat.id, returnerHighlightId),
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <li className={rowClassName || undefined} style={style} data-l1-category={cat.id}>
      <button
        type="button"
        data-nav-link-id={cat.id}
        onClick={() => onSelect(cat.id, cat.label)}
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

function L1Screen({
  menuBrand,
  onSelect,
  enterKey,
  listsMounted,
  staggerEnter,
  pendingEnter,
  returnerHighlightId = null,
}: {
  menuBrand: BrandId
  onSelect: (id: string, title: string) => void
  enterKey: number
  /** Keep L1 lists in the DOM while L2 covers them — avoids empty flash on drill back. */
  listsMounted: boolean
  /** True only for the initial L1 stagger — not when returning from L2. */
  staggerEnter: boolean
  /** Armed enter before --l1-ready — keeps items hidden during brand swap. */
  pendingEnter: boolean
  returnerHighlightId?: string | null
}) {
  const categories = getV3L1Categories(menuBrand)
  const l1ContentSpots = getV3L1ContentSpots(menuBrand)
  const hasL1ContentSpots = hasV3L1ContentSpots(menuBrand)
  const inlineAfterCategoryId = hasL1ContentSpots
    ? getL1ContentSpotsAnchorCategoryId(l1ContentSpots.placement)
    : null
  const showAboveCategories =
    hasL1ContentSpots && !isL1ContentSpotsInline(l1ContentSpots.placement)
  const l1LinkPreset = getNavLinkEnterPreset('l1', 'enter')
  const categoryRowCount = categories.length + (inlineAfterCategoryId ? 1 : 0)
  const utilityDelay = l1LinkPreset.delay + categoryRowCount * l1LinkPreset.stagger
  const contentAnimDirection: NavAnimDirection =
    staggerEnter || pendingEnter ? 'enter' : 'idle'
  const listMountKey = `l1-${enterKey}`

  return (
    <div className="v3-l1">
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

      {showAboveCategories && (
        <div className="v3-l1__content-spots-wrap">
          <L1ContentSpots
            config={l1ContentSpots}
            animDirection={contentAnimDirection}
            enterKey={enterKey}
          />
        </div>
      )}

      <div className="v3-l1__categories">
        {listsMounted && (
          <NavEnterGroup
            key={`${listMountKey}-categories`}
            as="ul"
            list
            delay={l1LinkPreset.delay}
            stagger={l1LinkPreset.stagger}
            variant={l1LinkPreset.variant}
            direction={contentAnimDirection}
            className="v3-l1__category-list"
          >
            {categories.flatMap((cat) => {
              const row = (
                <L1CategoryRow
                  key={cat.id}
                  cat={cat}
                  onSelect={onSelect}
                  returnerHighlightId={returnerHighlightId}
                />
              )

              if (inlineAfterCategoryId && cat.id === inlineAfterCategoryId) {
                return [
                  row,
                  <li
                    key={`${listMountKey}-content-spots`}
                    className="v3-l1__content-spots-list-item"
                  >
                    <L1ContentSpots
                      config={l1ContentSpots}
                      animDirection={contentAnimDirection}
                      enterKey={enterKey}
                    />
                  </li>,
                ]
              }

              return [row]
            })}
          </NavEnterGroup>
        )}

        {listsMounted && (
          <nav className="v3-l1__utility-section" aria-label="Account and support">
            <NavEnterGroup
              key={`${listMountKey}-utility`}
              as="ul"
              list
              delay={utilityDelay}
              stagger={l1LinkPreset.stagger}
              variant={l1LinkPreset.variant}
              direction={contentAnimDirection}
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
        )}
      </div>
    </div>
  )
}

function L2ContentSpots({
  layout,
  tiles,
  tileAspectRatio = '16:9',
  placement = 'above-sections',
  animDirection,
  enterKey,
}: {
  layout: V3L2ContentSpotsLayout
  tiles: { label: string; image?: string }[]
  tileAspectRatio?: V3L2ContentSpotAspectRatio
  placement?: V3L2ContentSpotsPlacement
  animDirection: NavAnimDirection
  enterKey: number
}) {
  const ratioClass =
    tileAspectRatio === '4:5' ? ' v3-content-spots--tile-ratio-4-5' : ''
  const positionClass =
    placement === 'below-sections'
      ? ' v3-content-spots--l2-below-sections'
      : ' v3-content-spots--l2-under-headline'

  return (
    <NavEnterGroup
      key={animMountKey(animDirection, enterKey)}
      {...(animDirection === 'exit'
        ? NAV_CONTENT_SPOTS_DRILL_EXIT
        : NAV_CONTENT_SPOTS_DRILL_ENTER)}
      direction={animDirection}
      className={`v3-content-spots v3-content-spots--${layout}${positionClass}${ratioClass}`.trim()}
    >
      {tiles.map((tile, i) => (
        <ContentSpotTile key={`${tile.label}-${i}`} src={tile.image} label={tile.label} />
      ))}
    </NavEnterGroup>
  )
}

function DrillHeader({
  title,
  onBack,
}: {
  title: string
  onBack: () => void
}) {
  return (
    <div className="v3-l2__header">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        className="v3-l2__header-back flex size-6 items-center justify-center text-coach-black"
      >
        <ArrowBack />
      </button>
      <h2
        className="v3-l2__header-title v1-nav-link font-extended text-[16px] leading-[1.4] tracking-[0.2px] text-coach-black"
        title={toNavHeadlineCase(title)}
      >
        {formatDrillTitle(title)}
      </h2>
    </div>
  )
}

function L2Screen({
  screenTitle,
  detail,
  onBack,
  onSelectSub,
  enterKey,
  animDirection,
  returnerLinkId = null,
  onNavigateLink,
}: {
  screenTitle: string
  detail: MenuCategoryDetail
  onBack: () => void
  onSelectSub: (subId: string, title: string) => void
  enterKey: number
  animDirection: NavAnimDirection
  returnerLinkId?: string | null
  onNavigateLink?: (link: MenuLink) => void
}) {
  const contentSpots = getV3L2ContentSpots(detail.id)
  const drillBody = resolveNavDrillL2Body(detail)
  const mountKey = animMountKey(animDirection, enterKey)
  const spotsBelow = contentSpots ? isL2ContentSpotsBelowSections(contentSpots) : false
  const spotsAbove = contentSpots && !spotsBelow
  const sectionsClassName = spotsAbove
    ? 'v3-l2__sections v3-l2__sections--after-content-spots'
    : 'v3-l2__sections'

  return (
    <div
      className={`v3-l2${contentSpots ? ' v3-l2--with-content-spots' : ''}${spotsBelow ? ' v3-l2--content-spots-below' : ''}`.trim()}
    >
      <DrillHeader title={screenTitle} onBack={onBack} />

      {spotsAbove && contentSpots && (
        <L2ContentSpots
          layout={contentSpots.layout}
          tiles={contentSpots.tiles}
          tileAspectRatio={contentSpots.tileAspectRatio}
          placement="above-sections"
          animDirection={animDirection}
          enterKey={enterKey}
        />
      )}

      {drillBody?.kind === 'sub-category-sections' && (
        <div className={spotsAbove ? 'v3-l2__category-block' : undefined}>
          <DrillSubCategorySections
            sections={drillBody.sections}
            className={sectionsClassName}
            screenTitle={screenTitle}
            leadingEyebrow={spotsAbove ? contentSpots?.eyebrow : undefined}
            animDirection={animDirection}
            mountKey={mountKey}
            returnerLinkId={returnerLinkId}
            onSelectSub={onSelectSub}
          />
        </div>
      )}

      {drillBody?.kind === 'flat-sections' && (
        <DrillLinkSections
          sections={drillBody.sections}
          className={sectionsClassName}
          depth="l2"
          screenTitle={screenTitle}
          animDirection={animDirection}
          mountKey={mountKey}
          returnerLinkId={returnerLinkId}
          onNavigateLink={onNavigateLink}
        />
      )}

      {spotsBelow && contentSpots && (
        <L2ContentSpots
          layout={contentSpots.layout}
          tiles={contentSpots.tiles}
          tileAspectRatio={contentSpots.tileAspectRatio}
          placement="below-sections"
          animDirection={animDirection}
          enterKey={enterKey}
        />
      )}
    </div>
  )
}

function L3Screen({
  screenTitle,
  sub,
  onBack,
  enterKey,
  animDirection,
  returnerLinkId = null,
  onNavigateLink,
}: {
  screenTitle: string
  sub: MenuSubCategory
  onBack: () => void
  enterKey: number
  animDirection: NavAnimDirection
  returnerLinkId?: string | null
  onNavigateLink?: (link: MenuLink) => void
}) {
  const mountKey = animMountKey(animDirection, enterKey)

  return (
    <div className="v3-l3">
      <DrillHeader title={screenTitle} onBack={onBack} />
      <DrillLinkSections
        sections={sub.sections}
        className="v3-l3__sections"
        depth="l3"
        screenTitle={screenTitle}
        animDirection={animDirection}
        mountKey={mountKey}
        returnerLinkId={returnerLinkId}
        onNavigateLink={onNavigateLink}
      />
    </div>
  )
}

function DrilldownBody({
  open,
  menuBrand,
  menuBodyRef,
}: {
  open: boolean
  menuBrand: BrandId
  menuBodyRef: React.RefObject<HTMLDivElement>
}) {
  const { selection, recordNavSelection } = useNavReturner()
  const [stack, setStack] = useState<DrillStackEntry[]>([])
  const [l1ListEnterKey, setL1ListEnterKey] = useState(0)
  const [l1ShouldEnter, setL1ShouldEnter] = useState(false)
  const [l1ContentReady, setL1ContentReady] = useState(false)
  const [l2AnimKey, setL2AnimKey] = useState(0)
  const [l3AnimKey, setL3AnimKey] = useState(0)
  const [l2ShouldEnter, setL2ShouldEnter] = useState(false)
  const [l3ShouldEnter, setL3ShouldEnter] = useState(false)
  const [l2StaggerReady, setL2StaggerReady] = useState(false)
  const [l3StaggerReady, setL3StaggerReady] = useState(false)
  const [exitingIndex, setExitingIndex] = useState<number | null>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const l1EnterTimerRef = useRef<number | null>(null)
  const prevMenuBrandRef = useRef(menuBrand)
  const [l1StaggerReady, setL1StaggerReady] = useState(false)
  const [exitStackHeight, setExitStackHeight] = useState<number | null>(null)
  const l1ScrollTopRef = useRef(0)

  const clearL1EnterTimer = useCallback(() => {
    if (l1EnterTimerRef.current !== null) {
      window.clearTimeout(l1EnterTimerRef.current)
      l1EnterTimerRef.current = null
    }
  }, [])

  /** Bump list/content enter keys; defer stagger until drawer lands (or run immediately when already open). */
  const armL1Enter = useCallback(
    (contentDelayMs: number) => {
      clearL1EnterTimer()
      setL1ShouldEnter(true)
      setL1ContentReady(false)
      setL1StaggerReady(false)
      setL1ListEnterKey((key) => key + 1)

      if (contentDelayMs <= 0) {
        setL1ContentReady(true)
        return
      }

      l1EnterTimerRef.current = window.setTimeout(() => {
        setL1ContentReady(true)
        l1EnterTimerRef.current = null
      }, contentDelayMs)
    },
    [clearL1EnterTimer],
  )

  /** Brand tab switch — re-stagger L1 without remounting search or clearing l1-ready prep. */
  const armL1BrandSwitch = useCallback(() => {
    clearL1EnterTimer()
    setStack([])
    setExitingIndex(null)
    setL2ShouldEnter(false)
    setL3ShouldEnter(false)
    setL2StaggerReady(false)
    setL3StaggerReady(false)
    setL1ShouldEnter(true)
    setL1StaggerReady(false)
    setL1ListEnterKey((key) => key + 1)
    menuBodyRef.current?.scrollTo(0, 0)
  }, [clearL1EnterTimer, menuBodyRef])

  /** Two frames after drawer lands — mount link lists so CSS stagger always fires. */
  useEffect(() => {
    if (!open || !l1ContentReady) {
      setL1StaggerReady(false)
      return
    }

    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setL1StaggerReady(true))
    })

    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [open, l1ContentReady, l1ListEnterKey])

  useEffect(() => {
    if (open) {
      l1ScrollTopRef.current = 0
      armL1Enter(NAV_DRAWER_CONTENT_DELAY_MS)
      return () => clearL1EnterTimer()
    }

    clearL1EnterTimer()
    setL1ContentReady(false)
    setL1StaggerReady(false)
    setStack([])
    setExitingIndex(null)
    setL1ShouldEnter(false)
    setL2ShouldEnter(false)
    setL3ShouldEnter(false)
    setL2StaggerReady(false)
    setL3StaggerReady(false)
  }, [open, armL1Enter, clearL1EnterTimer])

  useEffect(() => {
    if (!open) {
      prevMenuBrandRef.current = menuBrand
      return
    }
    if (prevMenuBrandRef.current === menuBrand) return
    prevMenuBrandRef.current = menuBrand
    armL1BrandSwitch()
  }, [menuBrand, open, armL1BrandSwitch])

  /** Arm L2 link stagger after overlay --entered (mirror L1 double rAF). */
  const handleL2Entered = useCallback(() => {
    setL2StaggerReady(false)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setL2StaggerReady(true))
    })
  }, [])

  /** Arm L3 link stagger after overlay --entered. */
  const handleL3Entered = useCallback(() => {
    setL3StaggerReady(false)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setL3StaggerReady(true))
    })
  }, [])

  useEffect(() => {
    if (!l2ShouldEnter || !l2StaggerReady) return
    const timer = window.setTimeout(() => setL2ShouldEnter(false), NAV_DRILL_MS)
    return () => window.clearTimeout(timer)
  }, [l2ShouldEnter, l2StaggerReady, l2AnimKey])

  useEffect(() => {
    if (!l3ShouldEnter || !l3StaggerReady) return
    const timer = window.setTimeout(() => setL3ShouldEnter(false), NAV_DRILL_MS)
    return () => window.clearTimeout(timer)
  }, [l3ShouldEnter, l3StaggerReady, l3AnimKey])

  const popStack = useDrillBack({
    depth: stack.length,
    exitingIndex,
    setExitingIndex,
    setDepth: (update) => {
      setStack((current) => {
        const nextDepth = update(current.length)
        return current.slice(0, nextDepth)
      })
    },
    onComplete: () => {
      setL3ShouldEnter(false)
    },
  })

  const handleBack = useCallback(() => {
    if (stackRef.current) {
      setExitStackHeight(stackRef.current.offsetHeight)
    }
    popStack()
  }, [popStack])

  /** L1 scroll — save on drill-in; restore when L2 slides away; defer stack height reset. */
  useEffect(() => {
    if (!open) return
    const body = menuBodyRef.current
    if (!body) return

    if (exitingIndex === 0) {
      body.scrollTo(0, l1ScrollTopRef.current)
      return
    }

    if (exitingIndex !== null) return

    if (stack.length === 0) {
      body.scrollTo(0, l1ScrollTopRef.current)
      if (exitStackHeight === null) return
      const frame = requestAnimationFrame(() => setExitStackHeight(null))
      return () => cancelAnimationFrame(frame)
    }

    body.scrollTo(0, 0)
  }, [stack.length, exitingIndex, open, menuBodyRef, exitStackHeight])

  const pushCategory = (categoryId: string, title: string) => {
    if (menuBodyRef.current) {
      l1ScrollTopRef.current = menuBodyRef.current.scrollTop
    }
    recordNavSelection({
      linkId: categoryId,
      label: title,
      brand: menuBrand,
      stack: [{ id: categoryId, title }],
      clickedDepth: 0,
    })
    setL1ShouldEnter(false)
    setL2ShouldEnter(true)
    setL3ShouldEnter(false)
    setL2StaggerReady(false)
    setStack([{ id: categoryId, title }])
    setL2AnimKey((key) => key + 1)
  }

  const pushSubCategory = (subId: string, title: string) => {
    setStack((current) => {
      const next = [...current, { id: subId, title }]
      recordNavSelection({
        linkId: subId,
        label: title,
        brand: menuBrand,
        stack: next,
        clickedDepth: 1,
      })
      return next
    })
    setL2ShouldEnter(false)
    setL3ShouldEnter(true)
    setL3StaggerReady(false)
    setL3AnimKey((key) => key + 1)
  }

  const l2AnimDirection: NavAnimDirection =
    exitingIndex === 0
      ? 'exit'
      : l2ShouldEnter && l2StaggerReady
        ? 'enter'
        : 'idle'

  const l3AnimDirection: NavAnimDirection =
    exitingIndex === 1
      ? 'exit'
      : l3ShouldEnter && l3StaggerReady
        ? 'enter'
        : 'idle'

  const categoryEntry = stack[0]
  const categoryId = categoryEntry?.id
  const l2Title = categoryEntry?.title ?? ''
  const subEntry = stack[1]
  const subId = subEntry?.id
  const l3Title = subEntry?.title ?? ''
  const categoryDetail = categoryId
    ? resolveV3CategoryDetail(categoryId, menuBrand)
    : null
  const subCategory =
    categoryId && subId
      ? resolveV3SubCategory(categoryId, subId, menuBrand)
      : undefined

  const effectiveDepth = getEffectiveDrillDepth(stack.length, exitingIndex)
  const l1ReturnerHighlightId = getReturnerHighlightId('l1', effectiveDepth, selection)
  const l2ReturnerHighlightId = categoryId
    ? getReturnerHighlightId('l2', effectiveDepth, selection, { categoryId })
    : null
  const l3ReturnerHighlightId =
    categoryId && subId
      ? getReturnerHighlightId('l3', effectiveDepth, selection, {
          categoryId,
          subCategoryId: subId,
        })
      : null

  const l2ReturnerStack = categoryEntry ? [categoryEntry] : []
  const { onNavigateLink: onL2NavigateLink } = useDrillReturnerSelect(
    menuBrand,
    l2ReturnerStack,
  )
  const { onNavigateLink: onL3NavigateLink } = useDrillReturnerSelect(
    menuBrand,
    stack,
  )

  const l1ListsMounted = open && exitingIndex !== 1
  const l1PendingEnter = l1ShouldEnter && !l1StaggerReady && exitingIndex === null
  const l1StaggerEnter =
    l1ListsMounted && l1ShouldEnter && l1StaggerReady && exitingIndex === null

  return (
    <div
      ref={stackRef}
      className="invoked-menu__stack"
      style={exitStackHeight ? { minHeight: exitStackHeight } : undefined}
    >
      <div
        className={`invoked-menu__base${stack.length > 0 && exitingIndex !== 0 ? ' invoked-menu__base--covered' : ''}${exitingIndex === 0 ? ' invoked-menu__base--revealing' : ''}${l1StaggerReady ? ' invoked-menu__base--l1-ready' : ''}`.trim()}
        aria-hidden={stack.length > 0 && exitingIndex !== 0}
      >
        <L1Screen
          menuBrand={menuBrand}
          onSelect={pushCategory}
          enterKey={l1ListEnterKey}
          listsMounted={l1ListsMounted}
          staggerEnter={l1StaggerEnter}
          pendingEnter={l1PendingEnter}
          returnerHighlightId={l1ReturnerHighlightId}
        />
      </div>

      {stack.length >= 1 && categoryDetail && (
        <DrillOverlay
          isTop={stack.length === 1 && exitingIndex === null}
          isExiting={exitingIndex === 0}
          isRevealed={exitingIndex === 1}
          contentKey={l2AnimKey}
          onEntered={handleL2Entered}
        >
          <L2Screen
            screenTitle={l2Title}
            detail={categoryDetail}
            onBack={handleBack}
            onSelectSub={pushSubCategory}
            enterKey={l2AnimKey}
            animDirection={l2AnimDirection}
            returnerLinkId={l2ReturnerHighlightId}
            onNavigateLink={onL2NavigateLink}
          />
        </DrillOverlay>
      )}

      {stack.length >= 2 && subCategory && (
        <DrillOverlay
          isTop={stack.length === 2 && exitingIndex === null}
          isExiting={exitingIndex === 1}
          isRevealed={false}
          contentKey={l3AnimKey}
          onEntered={handleL3Entered}
        >
          <L3Screen
            screenTitle={l3Title}
            sub={subCategory}
            onBack={handleBack}
            enterKey={l3AnimKey}
            animDirection={l3AnimDirection}
            returnerLinkId={l3ReturnerHighlightId}
            onNavigateLink={onL3NavigateLink}
          />
        </DrillOverlay>
      )}
    </div>
  )
}

/** MVP V3 — Nav + L1/L2 content spots (matches coach-nav.vercel.app V3). */
export function NavV3ImageCollage({ open, onClose }: NavV3ImageCollageProps) {
  return (
    <InvokedMenuShell open={open} onClose={onClose} aria-label="Shop navigation">
      {({ menuBrand, menuBodyRef }) => (
        <DrilldownBody open={open} menuBrand={menuBrand} menuBodyRef={menuBodyRef} />
      )}
    </InvokedMenuShell>
  )
}
