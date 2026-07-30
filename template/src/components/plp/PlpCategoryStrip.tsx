import styles from './PlpCategoryStrip.module.css'

const CATEGORIES = [
  'New',
  'Shoulder Bags',
  'Totes',
  'Crossbody Bags',
  'Backpacks',
  'Satchels',
  'View All',
]

type PlpCategoryStripProps = {
  title: string
  count: string
}

/** PLP title + category pills — no duplicate brand tab bar (header is NavSearchExposed). */
export function PlpCategoryStrip({ title, count }: PlpCategoryStripProps) {
  return (
    <>
      <div className={styles.title}>
        <h1 className={styles.titleText}>{title}</h1>
        <span className={styles.titleCount}>{count}</span>
      </div>

      <div className={styles.pillsWrap}>
        <span className={styles.fadeLeft} aria-hidden="true" />
        <nav className={styles.pills} aria-label="Categories">
          {CATEGORIES.map((cat) => (
            <button key={cat} type="button" className={styles.pill}>
              {cat}
            </button>
          ))}
        </nav>
        <span className={styles.fadeRight} aria-hidden="true" />
      </div>
    </>
  )
}
