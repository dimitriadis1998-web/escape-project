import {
    useEffect,
    useState,
    type ChangeEvent,
} from "react"

import { useAuth } from "../auth/AuthContext"
import { getExpiringInventoryBatches } from "../inventory/inventory.api"
import { getDaysUntilExpiration } from "../../shared/utils/dateUtils"

import type { InventoryBatch } from "../inventory/types"

const getErrorMessage = (
    error: unknown
): string => {
    return error instanceof Error
        ? error.message
        : "Something went wrong"
}

const getExpirationStatus = (
    daysLeft: number
) => {
    if (daysLeft < 0) {
        return {
            label: "Expired",
            className:
                "bg-red-100 text-red-700",
        }
    }

    if (daysLeft === 0) {
        return {
            label: "Expires Today",
            className:
                "bg-red-100 text-red-700",
        }
    }

    if (daysLeft <= 7) {
        return {
            label: "Urgent",
            className:
                "bg-orange-100 text-orange-700",
        }
    }

    if (daysLeft <= 30) {
        return {
            label: "Expires Soon",
            className:
                "bg-yellow-100 text-yellow-700",
        }
    }

    return {
        label: "Safe",
        className:
            "bg-green-100 text-green-700",
    }
}

const getDaysLeftLabel = (
    daysLeft: number
): string => {
    if (daysLeft < 0) {
        return `${Math.abs(daysLeft)} days ago`
    }

    if (daysLeft === 0) {
        return "Today"
    }

    if (daysLeft === 1) {
        return "1 day"
    }

    return `${daysLeft} days`
}

const formatDisplayDate = (
    date: string
): string => {
    return new Date(date).toLocaleDateString(
        "el-GR"
    )
}

const ExpirationsPage = () => {
    const { accessToken } = useAuth()

    const [batches, setBatches] =
        useState<InventoryBatch[]>([])

    const [selectedDays, setSelectedDays] =
        useState(365)

    const [isLoading, setIsLoading] =
        useState(true)

    const [error, setError] = useState("")

    const urgentCount = batches.filter(
        (batch) => {
            const daysLeft =
                getDaysUntilExpiration(
                    batch.expirationDate
                )

            return (
                daysLeft >= 0 &&
                daysLeft <= 7
            )
        }
    ).length

    const expiringSoonCount =
        batches.filter((batch) => {
            const daysLeft =
                getDaysUntilExpiration(
                    batch.expirationDate
                )

            return (
                daysLeft > 7 &&
                daysLeft <= 30
            )
        }).length

    const totalUnitsAtRisk = batches.reduce(
        (total, batch) => {
            return total + batch.quantity
        },
        0
    )

    useEffect(() => {
        if (!accessToken) {
            return
        }

        let isActive = true

        const loadExpiringBatches =
            async (): Promise<void> => {
                setIsLoading(true)
                setError("")

                try {
                    const batchData =
                        await getExpiringInventoryBatches(
                            accessToken,
                            selectedDays
                        )

                    if (isActive) {
                        setBatches(batchData)
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

        void loadExpiringBatches()

        return () => {
            isActive = false
        }
    }, [accessToken, selectedDays])

    const handleDaysChange = (
        event: ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedDays(
            Number(event.target.value)
        )
    }

    return (
        <section className="p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-800">
                        EXPIRATIONS
                    </h1>

                    <p className="mt-1 text-sm font-bold text-gray-600">
                        Monitor upcoming inventory expirations
                    </p>
                </div>

                <label className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                        Show next
                    </span>

                    <select
                        value={selectedDays}
                        onChange={handleDaysChange}
                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-purple-500"
                    >
                        <option value={7}>
                            7 days
                        </option>
                        <option value={30}>
                            30 days
                        </option>
                        <option value={90}>
                            90 days
                        </option>
                        <option value={365}>
                            365 days
                        </option>
                    </select>
                </label>
            </div>

            {error && (
                <p className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-700">
                    {error}
                </p>
            )}

            <div className="mb-6 grid gap-4 sm:grid-cols-4">
                <article className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-sm font-medium text-gray-500">
                        Expiring Batches
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-800">
                        {batches.length}
                    </p>
                </article>

                <article className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                    <p className="text-sm font-medium text-orange-700">
                        Within 7 Days
                    </p>

                    <p className="mt-2 text-2xl font-bold text-orange-800">
                        {urgentCount}
                    </p>
                </article>

                <article className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                    <p className="text-sm font-medium text-yellow-700">
                        Within 30 Days
                    </p>

                    <p className="mt-2 text-2xl font-bold text-yellow-800">
                        {expiringSoonCount}
                    </p>
                </article>

                <article className="rounded-xl border border-purple-200 bg-purple-50 p-4">
                    <p className="text-sm font-medium text-purple-700">
                        Units At Risk
                    </p>

                    <p className="mt-2 text-2xl font-bold text-purple-800">
                        {totalUnitsAtRisk}
                    </p>
                </article>
            </div>

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
                            Expiration Date
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Days Left
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Status
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {isLoading ? (
                        <tr>
                            <td
                                colSpan={7}
                                className="px-4 py-8 text-center text-sm text-gray-500"
                            >
                                Loading expirations...
                            </td>
                        </tr>
                    ) : batches.length === 0 ? (
                        <tr>
                            <td
                                colSpan={7}
                                className="px-4 py-8 text-center text-sm text-gray-500"
                            >
                                No batches expire within the selected period
                            </td>
                        </tr>
                    ) : (
                        batches.map((batch) => {
                            const daysLeft =
                                getDaysUntilExpiration(
                                    batch.expirationDate
                                )

                            const expirationStatus =
                                getExpirationStatus(
                                    daysLeft
                                )

                            const product =
                                typeof batch.productId ===
                                "string"
                                    ? null
                                    : batch.productId

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

                                    <td className="px-4 py-4 text-sm text-gray-700">
                                        {getDaysLeftLabel(
                                            daysLeft
                                        )}
                                    </td>

                                    <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${expirationStatus.className}`}
                                            >
                                                {
                                                    expirationStatus.label
                                                }
                                            </span>
                                    </td>
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

export default ExpirationsPage