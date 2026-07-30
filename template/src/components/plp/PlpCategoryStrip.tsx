import styles from './PlpCategoryStrip.module.css'

type PlpCategoryStripProps = {
  title: string
  count: string
  categories: string[]
  activeCategory?: string
}

/** PLP title + category pills — no duplicate brand tab bar (header is NavSearchExposed). */
export function PlpCategoryStrip({
  title,
  count,
  categories,
  activeCategory,
}: PlpCategoryStripProps) {
  return (
    <>
      <div className={styles.title}>
        <h1 className={styles.titleText}>{title}</h1>
        <span className={styles.titleCount}>{count}</span>
      </div>

      <div className={styles.pillsWrap}>
        <span className={styles.fadeLeft} aria-hidden="true" />
        <nav className={styles.pills} aria-label="Categories">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={styles.pill}
              aria-current={cat === activeCategory ? 'page' : undefined}
            >
              {cat}
            </button>
          ))}
        </nav>
        <span className={styles.fadeRight} aria-hidden="true" />
      </div>
    </>
  )
}
