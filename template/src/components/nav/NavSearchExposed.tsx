import { BrandTabList } from './BrandTabList'
import { BagIconV2, MenuSearchIconV2 } from './HeaderIcons'

export type BrandId = 'coach' | 'outlet'

export type NavSearchExposedProps = {
  activeBrand: BrandId
  onBrandChange: (brand: BrandId) => void
  bagCount?: number
  /** When true, show the numeric badge on the bag icon even when count is 0 (retail header). */
  alwaysShowBagBadge?: boolean
  onMenuSearchClick?: () => void
  onBagClick?: () => void
  onCoachHomeClick?: () => void
}

export function NavSearchExposed({
  activeBrand,
  onBrandChange,
  bagCount = 1,
  alwaysShowBagBadge = false,
  onMenuSearchClick,
  onBagClick,
  onCoachHomeClick,
}: NavSearchExposedProps) {
  const showBagBadge = alwaysShowBagBadge || bagCount > 0
  return (
    <header className="nav-exposed">
      <div className="nav-exposed__top">
        <BrandTabList
          activeBrand={activeBrand}
          onBrandChange={onBrandChange}
          onCoachHomeClick={onCoachHomeClick}
        />

        <div className="nav-exposed__icons">
          <button
            type="button"
            className="nav-exposed__icon-btn"
            aria-label={`Bag, ${bagCount} items`}
            onClick={onBagClick}
          >
            <span className="nav-exposed__bag-wrap">
              <BagIconV2 />
              {showBagBadge && (
                <span className="nav-exposed__bag-badge">{bagCount}</span>
              )}
            </span>
          </button>
          <button
            type="button"
            className="nav-exposed__icon-btn"
            aria-label="Menu"
            onClick={onMenuSearchClick}
          >
            <MenuSearchIconV2 />
          </button>
        </div>
      </div>
    </header>
  )
}
