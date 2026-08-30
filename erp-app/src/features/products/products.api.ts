import { apiRequest } from "../../shared/api/api-client"

import type {
    CreateProductInput,
    ProductRecord,
    UpdateProductInput,
} from "./types"

export const getProducts = async (
    accessToken: string
): Promise<ProductRecord[]> => {
    return apiRequest<ProductRecord[]>(
        "/products",
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