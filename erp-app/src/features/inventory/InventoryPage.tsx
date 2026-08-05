import type { Product } from "../products/types"

type InventoryPageProps = {
    products: Product[]
}

const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
        return {
            label: "Out of Stock",
            className: "bg-red-100 text-red-700",
        }
    }

    if (quantity <= 5) {
        return {
            label: "Low Stock",
            className: "bg-yellow-100 text-yellow-700",
        }
    }

    return {
        label: "In Stock",
        className: "bg-green-100 text-green-700",
    }
}

const InventoryPage = ({ products }: InventoryPageProps) => {
    const lowStockCount = products.filter((product) => {
        return product.quantity > 0 && product.quantity <= 5
    }).length

    const outOfStockCount = products.filter((product) => {
        return product.quantity === 0
    }).length

    return (
        <section className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-gray-800">
                    INVENTORY
                </h1>

                <p className="mt-1 text-sm font-bold text-gray-600">
                    Monitor your store stock levels
                </p>
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <p className="text-sm font-medium text-gray-500">
                        Total Products
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-800">
                        {products.length}
                    </p>
                </div>

                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                    <p className="text-sm font-medium text-yellow-700">
                        Low Stock
                    </p>

                    <p className="mt-2 text-2xl font-bold text-yellow-800">
                        {lowStockCount}
                    </p>
                </div>

                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-700">
                        Out of Stock
                    </p>

                    <p className="mt-2 text-2xl font-bold text-red-800">
                        {outOfStockCount}
                    </p>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                <table className="w-full">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Product
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Category
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Quantity
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Status
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td
                                colSpan={4}
                                className="px-4 py-8 text-center text-sm text-gray-500"
                            >
                                No products found
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => {
                            const stockStatus = getStockStatus(
                                product.quantity
                            )

                            return (
                                <tr
                                    key={product.id}
                                    className="border-t border-gray-200"
                                >
                                    <td className="px-4 py-4 text-sm font-medium text-gray-800">
                                        {product.name}
                                    </td>

                                    <td className="px-4 py-4 text-sm text-gray-700">
                                        {product.category}
                                    </td>

                                    <td className="px-4 py-4 text-sm text-gray-700">
                                        {product.quantity}
                                    </td>

                                    <td className="px-4 py-4 text-sm">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${stockStatus.className}`}
                                            >
                                                {stockStatus.label}
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

export default InventoryPage