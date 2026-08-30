import { apiRequest } from "../../shared/api/api-client"

import type {
    CreateProductInput,
    ProductFilters,
    ProductRecord,
    UpdateProductInput,
} from "./types"

const buildProductsPath = (
    filters: ProductFilters
): string => {
    const searchParams =
        new URLSearchParams()

    if (filters.search?.trim()) {
        searchParams.set(
            "search",
            filters.search.trim()
        )
    }

    if (filters.categoryId) {
        searchParams.set(
            "categoryId",
            filters.categoryId
        )
    }

    if (
        filters.isFavorite !== undefined
    ) {
        searchParams.set(
            "isFavorite",
            String(filters.isFavorite)
        )
    }

    if (filters.minPrice !== undefined) {
        searchParams.set(
            "minPrice",
            String(filters.minPrice)
        )
    }

    if (filters.maxPrice !== undefined) {
        searchParams.set(
            "maxPrice",
            String(filters.maxPrice)
        )
    }

    if (filters.sortBy) {
        searchParams.set(
            "sortBy",
            filters.sortBy
        )
    }

    if (filters.sortOrder) {
        searchParams.set(
            "sortOrder",
            filters.sortOrder
        )
    }

    const queryString =
        searchParams.toString()

    return queryString
        ? `/products?${queryString}`
        : "/products"
}

export const getProducts = async (
    accessToken: string,
    filters: ProductFilters = {}
): Promise<ProductRecord[]> => {
    return apiRequest<ProductRecord[]>(
        buildProductsPath(filters),
        accessToken
    )
}

export const createProduct = async (
    accessToken: string,
    input: CreateProductInput
): Promise<void> => {
    await apiRequest<unknown>(
        "/products",
        accessToken,
        {
            method: "POST",
            body: JSON.stringify(input),
        }
    )
}

export const updateProduct = async (
    accessToken: string,
    productId: string,
    input: UpdateProductInput
): Promise<void> => {
    await apiRequest<unknown>(
        `/products/${productId}`,
        accessToken,
        {
            method: "PUT",
            body: JSON.stringify(input),
        }
    )
}

export const deactivateProduct = async (
    accessToken: string,
    productId: string
): Promise<void> => {
    await apiRequest<unknown>(
        `/products/${productId}`,
        accessToken,
        {
            method: "DELETE",
        }
    )
}