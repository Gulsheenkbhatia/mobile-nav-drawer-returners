import { useEffect, useRef, useState } from 'react'
import styles from './ProductTile.module.css'

function BagPlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M6 7h10l-.7 11H6.7L6 7Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 7a2.5 2.5 0 0 1 5 0"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M11 10.5v4M9 12.5h4"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="m6 11.5 3.2 3.2L16 8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function QuickAddButton({ productName }: { productName: string }) {
  const [added, setAdded] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <button
      type="button"
      className={`${styles.addBtn} ${added ? styles.addBtnAdded : ''}`}
      aria-label={`Add ${productName} to bag`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setAdded(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setAdded(false), 1600)
      }}
    >
      {added ? (
        <>
          <CheckIcon className={styles.addBtnIcon} />
          Added
        </>
      ) : (
        <>
          <BagPlusIcon className={styles.addBtnIcon} />
          Add to Bag
        </>
      )}
    </button>
  )
}
