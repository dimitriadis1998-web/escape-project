import { apiRequest } from "../../shared/api/api-client"

import type {
    CreateInventoryBatchInput,
    InventoryBatch,
    UpdateInventoryBatchInput,
} from "./types"

export const getInventoryBatches = async (
    accessToken: string
): Promise<InventoryBatch[]> => {
    return apiRequest<InventoryBatch[]>(
        "/inventory-batches",
        accessToken
    )
}

export const createInventoryBatch = async (
    accessToken: string,
    input: CreateInventoryBatchInput
): Promise<void> => {
    await apiRequest<unknown>(
        "/inventory-batches",
        accessToken,
        {
            method: "POST",
            body: JSON.stringify(input),
        }
    )
}

export const updateInventoryBatch = async (
    accessToken: string,
    batchId: string,
    input: UpdateInventoryBatchInput
): Promise<void> => {
    await apiRequest<unknown>(
        `/inventory-batches/${batchId}`,
        accessToken,
        {
            method: "PUT",
            body: JSON.stringify(input),
        }
    )
}

export const deleteInventoryBatch = async (
    accessToken: string,
    batchId: string
): Promise<void> => {
    await apiRequest<unknown>(
        `/inventory-batches/${batchId}`,
        accessToken,
        {
            method: "DELETE",
        }
    )
}