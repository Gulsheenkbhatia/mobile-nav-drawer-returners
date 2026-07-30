import type { PlpProduct } from '../../types/plp'
import { QuickAddButton } from './QuickAddButton'
import styles from './ProductTile.module.css'

type ProductTileProps = {
  product: PlpProduct
  index: number
}

function formatPrice(price: string) {
  const num = parseFloat(price)
  const opts: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: Number.isInteger(num) ? 0 : 2,
  }
  return new Intl.NumberFormat('en-US', opts).format(num)
}

export function ProductTile({ product, index }: ProductTileProps) {
  const swatches =
    product.colors && product.colors.length > 0
      ? product.colors
      : [
          {
            id: product.id,
            text: product.name,
            image: product.image,
            orderable: true,
          },
        ]
  const segments = Math.min(Math.max(swatches.length, 3), 5)
  const onSale = Boolean(product.salePrice)

  const tileContent = (
    <>
      <div className={styles.imageWrapper}>
        <img
          src={product.image.src}
          alt={product.image.alt}
          className={styles.image}
          loading="lazy"
        />
        <div className={styles.sliderBar} aria-hidden="true">
          {Array.from({ length: segments }).map((_, i) => (
            <span
              key={i}
              className={`${styles.segment} ${i === 0 ? styles.segmentActive : ''}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.info}>
        <p className={styles.name}>{product.name}</p>

        <div className={styles.swatches} aria-label="Available colors">
          {swatches.slice(0, 5).map((color, i) => (
            <img
              key={color.id}
              src={color.image.src}
              alt={color.text}
              className={`${styles.swatch} ${i === 0 ? styles.swatchSelected : ''}`}
            />
          ))}
          {swatches.length > 5 && (
            <span className={styles.swatchMore}>+{swatches.length - 5}</span>
          )}
        </div>

        <div className={styles.pricing}>
          <div className={styles.priceRow}>
            <p className={styles.price}>
              {formatPrice(onSale ? product.salePrice! : product.price)}
            </p>
            {onSale && (
              <>
                <span className={styles.priceOriginal}>
                  {formatPrice(product.price)}
                </span>
                {product.discountPercent != null && (
                  <span className={styles.priceOff}>
                    ({product.discountPercent}% Off)
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        <QuickAddButton productName={product.name} />
      </div>
    </>
  )

  if (product.linkable && product.url) {
    return (
      <article className={styles.tile}>
        <a
          href={product.url}
          aria-label={`${product.name}, ${formatPrice(product.salePrice ?? product.price)}`}
          data-qa={`plp-tile-${index}`}
        >
          {tileContent}
        </a>
      </article>
    )
  }

  return (
    <article className={styles.tile} data-qa={`plp-tile-${index}`}>
      {tileContent}
    </article>
  )
}
