export type PlpProductColor = {
  id: string
  text: string
  image: { src: string; alt: string }
  orderable: boolean
}

export type PlpProduct = {
  id: string
  masterId: string
  name: string
  price: string
  salePrice?: string
  discountPercent?: number
  url: string | null
  linkable: boolean
  image: { src: string; alt: string }
  rating?: number
  reviewCount?: number
  colors?: PlpProductColor[]
  badge?: string
}

export type PlpPageData = {
  categoryName: string
  breadcrumbs: { label: string; href?: string }[]
  totalCount: number
  products: PlpProduct[]
  categoryPills: string[]
  activeCategoryPill?: string
}
