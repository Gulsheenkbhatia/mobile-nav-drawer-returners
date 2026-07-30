import { CoachOutletLogo, CoachRetailLogo } from './CoachLogos'
import type { BrandId } from './NavSearchExposed'

type BrandTabListProps = {
  activeBrand: BrandId
  onBrandChange: (brand: BrandId) => void
  onCoachHomeClick?: () => void
  className?: string
}

/** Coach / Outlet tab pair — shared by header and flyout menu. */
export function BrandTabList({
  activeBrand,
  onBrandChange,
  onCoachHomeClick,
  className = 'nav-exposed__tabs',
}: BrandTabListProps) {
  const isCoachActive = activeBrand === 'coach'

  return (
    <div className={className} role="tablist" aria-label="Brand">
      <button
        type="button"
        role="tab"
        aria-selected={isCoachActive}
        data-qa="mobile_menu_tab_retail"
        className={`nav-exposed__tab ${isCoachActive ? 'nav-exposed__tab--active' : ''}`}
        onClick={() => {
          onBrandChange('coach')
          onCoachHomeClick?.()
        }}
      >
        <CoachRetailLogo className="nav-exposed__logo nav-exposed__logo--retail" />
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={!isCoachActive}
        data-qa="mobile_menu_tab_outlet"
        className={`nav-exposed__tab nav-exposed__tab--outlet ${!isCoachActive ? 'nav-exposed__tab--active' : ''}`}
        onClick={() => onBrandChange('outlet')}
      >
        <CoachOutletLogo className="nav-exposed__logo nav-exposed__logo--outlet" />
      </button>
    </div>
  )
}
