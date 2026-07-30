import type { PlpPageData } from '../../types/plp'
import { PlpCategoryStrip } from './PlpCategoryStrip'
import { ProductsListing } from './ProductsListing'
import styles from './PlpInteractive.module.css'

function FilterSortGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 15.975 12.1549"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="0.173641"
        y="1.69297"
        width="15.3522"
        height="0.852717"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.347283"
      />
      <rect
        x="0.173641"
        y="5.73018"
        width="15.6277"
        height="0.852717"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.347283"
      />
      <rect
        x="0.173641"
        y="9.89755"
        width="15.6277"
        height="0.852717"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.347283"
      />
      <circle
        cx="4.54776"
        cy="1.82315"
        r="1.30223"
        fill="var(--color-neutral-light)"
        stroke="currentColor"
        strokeWidth="1.04185"
      />
      <path
        d="M4.61035 8.90337C5.36418 8.90337 5.97544 9.51481 5.97559 10.2686C5.97559 11.0225 5.36427 11.6338 4.61035 11.6338C3.85656 11.6337 3.24512 11.0224 3.24512 10.2686C3.24527 9.5149 3.85665 8.90352 4.61035 8.90337Z"
        fill="var(--color-neutral-light)"
        stroke="currentColor"
        strokeWidth="1.04185"
      />
      <path
        d="M11.1064 4.68788C11.8602 4.68788 12.4715 5.29932 12.4716 6.05312C12.4716 6.80704 11.8603 7.41835 11.1064 7.41835C10.3526 7.4182 9.74113 6.80695 9.74113 6.05312C9.74128 5.29942 10.3527 4.68803 11.1064 4.68788Z"
        fill="var(--color-neutral-light)"
        stroke="currentColor"
        strokeWidth="1.04185"
      />
    </svg>
  )
}

type PlpInteractiveProps = {
  data: PlpPageData
}

export function PlpInteractive({ data }: PlpInteractiveProps) {
  const countLabel = `${data.totalCount} Products`

  return (
    <>
      <PlpCategoryStrip
        title={data.categoryName}
        count={countLabel}
        categories={data.categoryPills}
        activeCategory={data.activeCategoryPill}
      />

      <div className={styles.filterSortRow}>
        <button
          type="button"
          className={styles.filterSortBtn}
          aria-disabled="true"
          tabIndex={-1}
        >
          <FilterSortGlyph className={styles.filterSortIcon} />
          <span className={styles.filterSortLabel}>Filter/Sort</span>
        </button>
      </div>

      <ProductsListing products={data.products} />

      <section className={styles.seo} aria-label="About">
        <h2 className={styles.seoTitle}>Women&apos;s Handbags &amp; Purses</h2>
        <p className={styles.seoText}>
          Discover the latest women&apos;s handbags from Coach, from the iconic
          Tabby shoulder bag to Brooklyn, Rogue and everyday crossbody styles.
          Each bag is crafted from refined leathers with signature hardware —
          designed to move from day to night.
        </p>
        <p className={styles.seoText}>
          Explore shoulder bags, totes, crossbody bags, bucket bags and more.
          Enjoy complimentary shipping and free returns on all orders.
        </p>
      </section>
    </>
  )
}
