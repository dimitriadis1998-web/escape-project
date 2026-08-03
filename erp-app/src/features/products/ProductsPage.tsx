import { Pencil, Plus, Trash2 } from "lucide-react"
import type { Product } from "./types"

const ProductsPage = () => {
    const products: Product[] = [
        {
            id: "1",
            name: "Pepsi Max 500ml",
            category: "Drinks",
            price: 1.2,
            quantity: 24,
            expirationDate: "10/08/2026",
        },
        {
            id: "2",
            name: "Molto Bueno",
            category: "Snacks",
            price: 1.5,
            quantity: 12,
            expirationDate: "15/08/2026",
        },
    ]

    return (
        <section className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-800">
                        PRODUCTS
                    </h1>

                    <p className="mt-1 text-sm font-bold text-gray-600">
                        Manage Your Store Products
                    </p>
                </div>

                <button
                    type="button"
                    className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Product</span>
                </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                <table className="w-full">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Name
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Category
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Price
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Quantity
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Expiration
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Actions
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {products.map((product) => (
                        <tr
                            key={product.id}
                            className="border-t border-gray-200"
                        >
                            <td className="px-4 py-4 text-sm text-gray-700">
                                {product.name}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-700">
                                {product.category}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-700">
                                €{product.price.toFixed(2)}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-700">
                                {product.quantity}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-700">
                                {product.expirationDate}
                            </td>

                            <td className="px-4 py-4 text-sm text-gray-700">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        aria-label={`Edit ${product.name}`}
                                        className="rounded-lg p-2 text-gray-500 hover:bg-purple-100 hover:text-purple-700"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>

                                    <button
                                        type="button"
                                        aria-label={`Delete ${product.name}`}
                                        className="rounded-lg p-2 text-gray-500 hover:bg-red-100 hover:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default ProductsPage