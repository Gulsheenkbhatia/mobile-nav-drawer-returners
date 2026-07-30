import type { PlpPageData } from '../../types/plp'
import { PlpInteractive } from './PlpInteractive'
import styles from './CoachPlpPage.module.css'

type CoachPlpPageProps = {
  data: PlpPageData
}

/** Mobile PLP v3 — ported from Coach-Header-banner-main (no duplicate header chrome). */
export function CoachPlpPage({ data }: CoachPlpPageProps) {
  return (
    <main className={styles.plpPage}>
      <PlpInteractive data={data} />
    </main>
  )
}
