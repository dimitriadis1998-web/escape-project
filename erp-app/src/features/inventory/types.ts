export type InventoryBatchProduct = {
    _id: string
    name: string
    sku: string
}

export type InventoryBatch = {
    _id: string
    batchNumber: string
    tenantId: string
    productId:
        | InventoryBatchProduct
        | string
    quantity: number
    expirationDate: string
    receivedAt: string
    createdAt: string
    updatedAt: string
}

export type CreateInventoryBatchInput = {
    batchNumber: string
    productId: string
    quantity: number
    expirationDate: string
    receivedAt?: string
}

export type UpdateInventoryBatchInput = {
    batchNumber?: string
    productId?: string
    quantity?: number
    expirationDate?: string
    receivedAt?: string
}