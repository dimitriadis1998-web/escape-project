export type Product = {
    id: string
    name: string
    category: string
    price: number
    quantity: number
    expirationDate: string
}

export type ProductCategory = {
    _id: string
    name: string
    slug: string
}

export type ProductRecord = {
    _id: string
    name: string
    sku: string
    barcode?: string
    description?: string
    price: number
    tenantId: string
    categoryId: ProductCategory
    isFavorite: boolean
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export type CreateProductInput = {
    name: string
    sku: string
    barcode?: string
    description?: string
    price: number
    categoryId: string
    isFavorite?: boolean
}

export type UpdateProductInput = {
    name?: string
    sku?: string
    barcode?: string
    description?: string
    price?: number
    categoryId?: string
    isFavorite?: boolean
}

export type ProductSortField =
    | "name"
    | "price"
    | "createdAt"

export type ProductSortOrder =
    | "asc"
    | "desc"

export type ProductFilters = {
    search?: string
    categoryId?: string
    isFavorite?: boolean
    minPrice?: number
    maxPrice?: number
    sortBy?: ProductSortField
    sortOrder?: ProductSortOrder
}