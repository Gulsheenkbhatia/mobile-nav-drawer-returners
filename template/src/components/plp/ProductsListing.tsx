import type { PlpProduct } from '../../types/plp'
import { ProductTile } from './ProductTile'
import styles from './ProductTile.module.css'

type ProductsListingProps = {
  products: PlpProduct[]
}

export function ProductsListing({ products }: ProductsListingProps) {
  return (
    <section aria-label="Product results">
      <div className={styles.grid}>
        {products.map((product, index) => (
          <ProductTile key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  )
}
