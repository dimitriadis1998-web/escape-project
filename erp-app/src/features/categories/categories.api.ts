import { apiRequest } from "../../shared/api/api-client"

import type { Category } from "./types"

export const getCategories = async (
    accessToken: string
): Promise<Category[]> => {
    return apiRequest<Category[]>(
        "/categories",
        accessToken
    )
}