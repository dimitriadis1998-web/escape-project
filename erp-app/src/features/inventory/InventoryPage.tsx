import {
    Pencil,
    Plus,
    Trash2,
} from "lucide-react"
import {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react"

import { useAuth } from "../auth/AuthContext"
import { getProducts } from "../products/products.api"
import {
    createInventoryBatch,
    deleteInventoryBatch,
    getInventoryBatches,
    updateInventoryBatch,
} from "./inventory.api"

import type { ProductRecord } from "../products/types"
import type { InventoryBatch } from "./types"

type InventoryFormValues = {
    batchNumber: string
    productId: string
    quantity: string
    expirationDate: string
    receivedAt: string
}

const getToday = (): string => {
    return new Date()
        .toISOString()
        .slice(0, 10)
}

const initialFormValues: InventoryFormValues = {
    batchNumber: "",
    productId: "",
    quantity: "",
    expirationDate: "",
    receivedAt: getToday(),
}

const getErrorMessage = (
    error: unknown
): string => {
    return error instanceof Error
        ? error.message
        : "Something went wrong"
}

const getStockStatus = (
    quantity: number
) => {
    if (quantity === 0) {
        return {
            label: "Out of Stock",
            className:
                "bg-red-100 text-red-700",
        }
    }

    if (quantity <= 5) {
        return {
            label: "Low Stock",
            className:
                "bg-yellow-100 text-yellow-700",
        }
    }

    return {
        label: "In Stock",
        className:
            "bg-green-100 text-green-700",
    }
}

const formatDateForInput = (
    date: string
): string => {
    return date.slice(0, 10)
}

const formatDisplayDate = (
    date: string
): string => {
    return new Date(date).toLocaleDateString(
        "el-GR"
    )
}

const InventoryPage = () => {
    const { accessToken, user } = useAuth()

    const [batches, setBatches] =
        useState<InventoryBatch[]>([])

    const [products, setProducts] =
        useState<ProductRecord[]>([])

    const [formValues, setFormValues] =
        useState<InventoryFormValues>(
            initialFormValues
        )

    const [editingBatchId, setEditingBatchId] =
        useState<string | null>(null)

    const [isFormOpen, setIsFormOpen] =
        useState(false)

    const [isLoading, setIsLoading] =
        useState(true)

    const [isSubmitting, setIsSubmitting] =
        useState(false)

    const [error, setError] = useState("")

    const canManageInventory =
        user?.role === "admin" ||
        user?.role === "editor"

    const totalQuantity = batches.reduce(
        (total, batch) => {
            return total + batch.quantity
        },
        0
    )

    const lowStockCount = batches.filter(
        (batch) => {
            return (
                batch.quantity > 0 &&
                batch.quantity <= 5
            )
        }
    ).length

    const outOfStockCount = batches.filter(
        (batch) => batch.quantity === 0
    ).length

    const getBatchProduct = (
        batch: InventoryBatch
    ) => {
        if (
            typeof batch.productId ===
            "string"
        ) {
            return products.find(
                (product) =>
                    product._id ===
                    batch.productId
            )
        }

        return batch.productId
    }

    const refreshBatches =
        async (): Promise<void> => {
            if (!accessToken) {
                return
            }

            const batchData =
                await getInventoryBatches(
                    accessToken
                )

            setBatches(batchData)
        }

    useEffect(() => {
        if (!accessToken) {
            return
        }

        let isActive = true

        const loadData =
            async (): Promise<void> => {
                setIsLoading(true)
                setError("")

                try {
                    const [
                        batchData,
                        productData,
                    ] = await Promise.all([
                        getInventoryBatches(
                            accessToken
                        ),
                        getProducts(
                            accessToken
                        ),
                    ])

                    if (isActive) {
                        setBatches(batchData)
                        setProducts(productData)
                    }
                } catch (loadError) {
                    if (isActive) {
                        setError(
                            getErrorMessage(
                                loadError
                            )
                        )
                    }
                } finally {
                    if (isActive) {
                        setIsLoading(false)
                    }
                }
            }

        void loadData()

        return () => {
            isActive = false
        }
    }, [accessToken])

    const handleOpenAddForm = () => {
        setEditingBatchId(null)
        setFormValues({
            ...initialFormValues,
            receivedAt: getToday(),
        })
        setError("")
        setIsFormOpen(true)
    }

    const handleEditClick = (
        batch: InventoryBatch
    ) => {
        const productId =
            typeof batch.productId ===
            "string"
                ? batch.productId
                : batch.productId._id

        setEditingBatchId(batch._id)

        setFormValues({
            batchNumber:
            batch.batchNumber,
            productId,
            quantity:
                batch.quantity.toString(),
            expirationDate:
                formatDateForInput(
                    batch.expirationDate
                ),
            receivedAt:
                formatDateForInput(
                    batch.receivedAt
                ),
        })

        setError("")
        setIsFormOpen(true)
    }

    const handleChange = (
        event: ChangeEvent<
            HTMLInputElement |
            HTMLSelectElement
        >
    ) => {
        const { name, value } = event.target

        setFormValues(
            (previousValues) => ({
                ...previousValues,
                [name]: value,
            })
        )
    }

    const handleCloseForm = () => {
        setEditingBatchId(null)
        setFormValues({
            ...initialFormValues,
            receivedAt: getToday(),
        })
        setIsFormOpen(false)
        setError("")
    }

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        event.preventDefault()

        if (!accessToken) {
            setError(
                "Authentication is required"
            )
            return
        }

        setIsSubmitting(true)
        setError("")

        const input = {
            batchNumber:
                formValues.batchNumber
                    .trim()
                    .toUpperCase(),
            productId:
            formValues.productId,
            quantity: Number(
                formValues.quantity
            ),
            expirationDate:
            formValues.expirationDate,
            receivedAt:
                formValues.receivedAt ||
                undefined,
        }

        try {
            if (editingBatchId) {
                await updateInventoryBatch(
                    accessToken,
                    editingBatchId,
                    input
                )
            } else {
                await createInventoryBatch(
                    accessToken,
                    input
                )
            }

            await refreshBatches()
            handleCloseForm()
        } catch (submitError) {
            setError(
                getErrorMessage(submitError)
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (
        batch: InventoryBatch
    ): Promise<void> => {
        if (!accessToken) {
            return
        }

        const shouldDelete = window.confirm(
            `Permanently delete batch ${batch.batchNumber}?`
        )

        if (!shouldDelete) {
            return
        }

        setError("")

        try {
            await deleteInventoryBatch(
                accessToken,
                batch._id
            )

            await refreshBatches()
        } catch (deleteError) {
            setError(
                getErrorMessage(deleteError)
            )
        }
    }

    return (
        <section className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-800">
                        INVENTORY
                    </h1>

                    <p className="mt-1 text-sm font-bold text-gray-600">
                        Manage inventory batches and stock
                    </p>
                </div>

                {canManageInventory && (
                    <button
                        type="button"
                        onClick={handleOpenAddForm}
                        className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Add Batch</span>
                    </button>
                )}
            </div>

            {error && (
                <p className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-700">
                    {error}
                </p>
            )}

            <div className="mb-6 grid gap-4 sm:grid-cols-4">
                <article className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-sm font-medium text-gray-500">
                        Total Batches
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-800">
                        {batches.length}
                    </p>
                </article>

                <article className="rounded-xl border border-purple-200 bg-purple-50 p-4">
                    <p className="text-sm font-medium text-purple-700">
                        Total Units
                    </p>
                    <p className="mt-2 text-2xl font-bold text-purple-800">
                        {totalQuantity}
                    </p>
                </article>

                <article className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                    <p className="text-sm font-medium text-yellow-700">
                        Low Stock Batches
                    </p>
                    <p className="mt-2 text-2xl font-bold text-yellow-800">
                        {lowStockCount}
                    </p>
                </article>

                <article className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-700">
                        Empty Batches
                    </p>
                    <p className="mt-2 text-2xl font-bold text-red-800">
                        {outOfStockCount}
                    </p>
                </article>
            </div>

            {isFormOpen && (
                <form
                    onSubmit={handleSubmit}
                    className="mb-6 rounded-xl border border-gray-200 bg-white p-6"
                >
                    <h2 className="mb-4 text-lg font-bold text-gray-800">
                        {editingBatchId
                            ? "Edit Inventory Batch"
                            : "Add Inventory Batch"}
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-700">
                                Product
                            </span>

                            <select
                                name="productId"
                                value={
                                    formValues.productId
                                }
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-purple-500"
                            >
                                <option value="">
                                    Select product
                                </option>

                                {products.map(
                                    (product) => (
                                        <option
                                            key={
                                                product._id
                                            }
                                            value={
                                                product._id
                                            }
                                        >
                                            {product.name} —{" "}
                                            {product.sku}
                                        </option>
                                    )
                                )}
                            </select>
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-700">
                                Batch Number
                            </span>

                            <input
                                type="text"
                                name="batchNumber"
                                value={
                                    formValues.batchNumber
                                }
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                                className="rounded-lg border border-gray-300 px-3 py-2 uppercase outline-none focus:border-purple-500"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-700">
                                Quantity
                            </span>

                            <input
                                type="number"
                                name="quantity"
                                value={
                                    formValues.quantity
                                }
                                onChange={handleChange}
                                required
                                min="0"
                                step="1"
                                disabled={isSubmitting}
                                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-purple-500"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-700">
                                Expiration Date
                            </span>

                            <input
                                type="date"
                                name="expirationDate"
                                value={
                                    formValues.expirationDate
                                }
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-purple-500"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-700">
                                Received At
                            </span>

                            <input
                                type="date"
                                name="receivedAt"
                                value={
                                    formValues.receivedAt
                                }
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-purple-500"
                            />
                        </label>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleCloseForm}
                            disabled={isSubmitting}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                products.length === 0
                            }
                            className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-400"
                        >
                            {!editingBatchId && (
                                <Plus className="h-5 w-5" />
                            )}

                            <span>
                                {isSubmitting
                                    ? "Saving..."
                                    : editingBatchId
                                        ? "Update Batch"
                                        : "Save Batch"}
                            </span>
                        </button>
                    </div>
                </form>
            )}

            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                <table className="w-full">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Product
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            SKU
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Batch
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Expiration
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Status
                        </th>

                        {canManageInventory && (
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                                Actions
                            </th>
                        )}
                    </tr>
                    </thead>

                    <tbody>
                    {isLoading ? (
                        <tr>
                            <td
                                colSpan={
                                    canManageInventory
                                        ? 7
                                        : 6
                                }
                                className="px-4 py-8 text-center text-sm text-gray-500"
                            >
                                Loading inventory...
                            </td>
                        </tr>
                    ) : batches.length === 0 ? (
                        <tr>
                            <td
                                colSpan={
                                    canManageInventory
                                        ? 7
                                        : 6
                                }
                                className="px-4 py-8 text-center text-sm text-gray-500"
                            >
                                No inventory batches found
                            </td>
                        </tr>
                    ) : (
                        batches.map((batch) => {
                            const product =
                                getBatchProduct(batch)

                            const stockStatus =
                                getStockStatus(
                                    batch.quantity
                                )

                            return (
                                <tr
                                    key={batch._id}
                                    className="border-t border-gray-200"
                                >
                                    <td className="px-4 py-4 text-sm font-medium text-gray-800">
                                        {product?.name ??
                                            "Unknown product"}
                                    </td>

                                    <td className="px-4 py-4 text-sm text-gray-700">
                                        {product?.sku ??
                                            "—"}
                                    </td>

                                    <td className="px-4 py-4 text-sm text-gray-700">
                                        {
                                            batch.batchNumber
                                        }
                                    </td>

                                    <td className="px-4 py-4 text-sm text-gray-700">
                                        {
                                            batch.quantity
                                        }
                                    </td>

                                    <td className="px-4 py-4 text-sm text-gray-700">
                                        {formatDisplayDate(
                                            batch.expirationDate
                                        )}
                                    </td>

                                    <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${stockStatus.className}`}
                                            >
                                                {
                                                    stockStatus.label
                                                }
                                            </span>
                                    </td>

                                    {canManageInventory && (
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEditClick(
                                                            batch
                                                        )
                                                    }
                                                    aria-label={`Edit ${batch.batchNumber}`}
                                                    className="rounded-lg p-2 text-gray-500 hover:bg-purple-100 hover:text-purple-700"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        void handleDelete(
                                                            batch
                                                        )
                                                    }
                                                    aria-label={`Delete ${batch.batchNumber}`}
                                                    className="rounded-lg p-2 text-gray-500 hover:bg-red-100 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            )
                        })
                    )}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default InventoryPage