import {
    useEffect,
    useState,
} from "react"

import dashboardHero from "../../assets/images/dashboard-hero.png"

import { useAuth } from "../auth/AuthContext"
import { getProducts } from "../products/products.api"
import { getInventoryBatches } from "../inventory/inventory.api"
import { getDaysUntilExpiration } from "../../shared/utils/dateUtils"

import type { ProductRecord } from "../products/types"
import type { InventoryBatch } from "../inventory/types"

const getErrorMessage = (
    error: unknown
): string => {
    return error instanceof Error
        ? error.message
        : "Something went wrong"
}

const DashboardPage = () => {
    const { accessToken, user } = useAuth()

    const [products, setProducts] =
        useState<ProductRecord[]>([])

    const [batches, setBatches] =
        useState<InventoryBatch[]>([])

    const [isLoading, setIsLoading] =
        useState(true)

    const [error, setError] = useState("")

    useEffect(() => {
        if (!accessToken) {
            return
        }

        let isActive = true

        const loadDashboardData =
            async (): Promise<void> => {
                setIsLoading(true)
                setError("")

                try {
                    const [
                        productData,
                        batchData,
                    ] = await Promise.all([
                        getProducts(accessToken),
                        getInventoryBatches(
                            accessToken
                        ),
                    ])

                    if (isActive) {
                        setProducts(productData)
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

        void loadDashboardData()

        return () => {
            isActive = false
        }
    }, [accessToken])

    const stockByProductId =
        new Map<string, number>()

    batches.forEach((batch) => {
        const productId =
            typeof batch.productId ===
            "string"
                ? batch.productId
                : batch.productId._id

        const currentQuantity =
            stockByProductId.get(productId) ??
            0

        stockByProductId.set(
            productId,
            currentQuantity +
            batch.quantity
        )
    })

    const totalUnits = batches.reduce(
        (total, batch) =>
            total + batch.quantity,
        0
    )

    const outOfStockProducts =
        products.filter((product) => {
            const quantity =
                stockByProductId.get(
                    product._id
                ) ?? 0

            return quantity === 0
        })

    const lowStockProducts =
        products.filter((product) => {
            const quantity =
                stockByProductId.get(
                    product._id
                ) ?? 0

            return (
                quantity > 0 &&
                quantity <= 5
            )
        })

    const expiringWithinThirtyDays =
        batches.filter((batch) => {
            const daysLeft =
                getDaysUntilExpiration(
                    batch.expirationDate
                )

            return (
                daysLeft >= 0 &&
                daysLeft <= 30
            )
        })

    const expiringTomorrowBatches =
        batches.filter((batch) => {
            return (
                getDaysUntilExpiration(
                    batch.expirationDate
                ) === 1
            )
        })

    const getBatchProductName = (
        batch: InventoryBatch
    ): string => {
        if (
            typeof batch.productId !==
            "string"
        ) {
            return batch.productId.name
        }

        return (
            products.find(
                (product) =>
                    product._id ===
                    batch.productId
            )?.name ?? "Unknown product"
        )
    }

    const currentDate = new Date()

    return (
        <section className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-gray-800">
                    Welcome{" "}
                    {user?.name ?? "User"}
                </h1>

                <p className="mt-1 font-medium text-gray-500">
                    {currentDate.toLocaleDateString(
                        "el-GR"
                    )}
                </p>
            </div>

            {error && (
                <p className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-700">
                    {error}
                </p>
            )}

            <div className="flex min-h-56 items-center justify-between overflow-hidden rounded-2xl bg-linear-to-r from-purple-700 to-gray-800 p-8 text-white">
                <div>
                    <h2 className="text-2xl font-bold">
                        Manage your store with confidence
                    </h2>

                    <p className="mt-2 max-w-md text-sm text-purple-100">
                        Products, inventory and expirations in one place.
                    </p>
                </div>

                <img
                    src={dashboardHero}
                    alt="Store inventory management"
                    className="hidden h-48 w-auto object-contain md:block"
                />
            </div>

            {isLoading ? (
                <p className="mt-6 rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
                    Loading dashboard...
                </p>
            ) : (
                <>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <article className="rounded-xl border border-gray-200 bg-white p-4">
                            <p className="text-sm font-medium text-gray-500">
                                Total Products
                            </p>

                            <p className="mt-2 text-2xl font-bold text-gray-800">
                                {products.length}
                            </p>
                        </article>

                        <article className="rounded-xl border border-purple-200 bg-purple-50 p-4">
                            <p className="text-sm font-medium text-purple-700">
                                Total Stock Units
                            </p>

                            <p className="mt-2 text-2xl font-bold text-purple-800">
                                {totalUnits}
                            </p>
                        </article>

                        <article className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                            <p className="text-sm font-medium text-yellow-700">
                                Low Stock Products
                            </p>

                            <p className="mt-2 text-2xl font-bold text-yellow-800">
                                {
                                    lowStockProducts.length
                                }
                            </p>
                        </article>

                        <article className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                            <p className="text-sm font-medium text-orange-700">
                                Expiring Within 30 Days
                            </p>

                            <p className="mt-2 text-2xl font-bold text-orange-800">
                                {
                                    expiringWithinThirtyDays.length
                                }
                            </p>
                        </article>
                    </div>

                    <section className="mt-6">
                        <h2 className="text-xl font-bold text-gray-800">
                            Notifications
                        </h2>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                            <article className="rounded-xl border border-red-200 bg-red-50 p-4">
                                <h3 className="font-semibold text-red-700">
                                    Out Of Stock
                                </h3>

                                {outOfStockProducts.length >
                                0 ? (
                                    outOfStockProducts.map(
                                        (product) => (
                                            <p
                                                key={
                                                    product._id
                                                }
                                                className="mt-2 text-sm text-red-700"
                                            >
                                                {
                                                    product.name
                                                }{" "}
                                                is out of
                                                stock
                                            </p>
                                        )
                                    )
                                ) : (
                                    <p className="mt-2 text-sm text-red-700">
                                        There are no out-of-stock products
                                    </p>
                                )}
                            </article>

                            <article className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                                <h3 className="font-semibold text-yellow-700">
                                    Expiring Tomorrow
                                </h3>

                                {expiringTomorrowBatches.length >
                                0 ? (
                                    expiringTomorrowBatches.map(
                                        (batch) => (
                                            <p
                                                key={
                                                    batch._id
                                                }
                                                className="mt-2 text-sm text-yellow-700"
                                            >
                                                {getBatchProductName(
                                                    batch
                                                )}{" "}
                                                —{" "}
                                                {
                                                    batch.batchNumber
                                                }
                                            </p>
                                        )
                                    )
                                ) : (
                                    <p className="mt-2 text-sm text-yellow-700">
                                        No batches expire tomorrow
                                    </p>
                                )}
                            </article>
                        </div>
                    </section>
                </>
            )}
        </section>
    )
}

export default DashboardPage