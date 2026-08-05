import { Pencil, Plus, Trash2 } from "lucide-react"
import { useState, type ChangeEvent, type FormEvent } from "react"
import type { Product } from "./types"

const initialFormValues = {
    name: "",
    category: "",
    price: "",
    quantity: "",
    expirationDate: "",
}

const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([
        {
            id: "1",
            name: "Pepsi Max 500ml",
            category: "Drinks",
            price: 1.2,
            quantity: 24,
            expirationDate: "2026-08-10",
        },
        {
            id: "2",
            name: "Molto Bueno",
            category: "Snacks",
            price: 1.5,
            quantity: 12,
            expirationDate: "2026-08-15",
        },
    ])

    const [isFormOpen, setIsFormOpen] = useState(false)

    const [formValues, setFormValues] = useState(initialFormValues)

    const [editingProductId, setEditingProductId] =
        useState<string | null>(null)

    const handleOpenAddForm = () => {
        setEditingProductId(null)
        setFormValues(initialFormValues)
        setIsFormOpen(true)
    }

    const handleEditClick = (product: Product) => {
        setEditingProductId(product.id)

        setFormValues({
            name: product.name,
            category: product.category,
            price: product.price.toString(),
            quantity: product.quantity.toString(),
            expirationDate: product.expirationDate,
        })

        setIsFormOpen(true)
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target

        setFormValues((prevState) => {
            return {
                ...prevState,
                [name]: value,
            }
        })
    }

    const handleCloseForm = () => {
        setFormValues(initialFormValues)
        setEditingProductId(null)
        setIsFormOpen(false)
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const productValues = {
            name: formValues.name,
            category: formValues.category,
            price: Number(formValues.price),
            quantity: Number(formValues.quantity),
            expirationDate: formValues.expirationDate,
        }

        if (editingProductId !== null) {
            setProducts((prevState) => {
                return prevState.map((product) => {
                    if (product.id === editingProductId) {
                        return {
                            ...product,
                            ...productValues,
                        }
                    }

                    return product
                })
            })
        } else {
            const newProduct: Product = {
                id: crypto.randomUUID(),
                ...productValues,
            }

            setProducts((prevState) => {
                return [...prevState, newProduct]
            })
        }

        handleCloseForm()
    }

    const handleDelete = (id: string) => {
        setProducts((prevState) => {
            return prevState.filter((product) => {
                return product.id !== id
            })
        })
    }

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
                    onClick={handleOpenAddForm}
                    className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Product</span>
                </button>
            </div>

            {isFormOpen && (
                <form
                    onSubmit={handleSubmit}
                    className="mb-6 rounded-xl border border-gray-200 bg-white p-6"
                >
                    <h2 className="mb-4 text-lg font-bold text-gray-800">
                        {editingProductId !== null
                            ? "Edit Product"
                            : "Add New Product"}
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-700">
                                Name
                            </span>

                            <input
                                type="text"
                                name="name"
                                value={formValues.name}
                                onChange={handleChange}
                                required
                                placeholder="Product name"
                                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-purple-500"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-700">
                                Category
                            </span>

                            <input
                                type="text"
                                name="category"
                                value={formValues.category}
                                onChange={handleChange}
                                required
                                placeholder="Product category"
                                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-purple-500"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-700">
                                Price
                            </span>

                            <input
                                type="number"
                                name="price"
                                value={formValues.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-purple-500"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-700">
                                Quantity
                            </span>

                            <input
                                type="number"
                                name="quantity"
                                value={formValues.quantity}
                                onChange={handleChange}
                                required
                                min="0"
                                placeholder="0"
                                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-purple-500"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-700">
                                Expiration date
                            </span>

                            <input
                                type="date"
                                name="expirationDate"
                                value={formValues.expirationDate}
                                onChange={handleChange}
                                required
                                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-purple-500"
                            />
                        </label>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleCloseForm}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                        >
                            {editingProductId === null && (
                                <Plus className="h-5 w-5" />
                            )}

                            <span>
                                {editingProductId !== null
                                    ? "Update Product"
                                    : "Save Product"}
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
                                        onClick={() =>
                                            handleEditClick(product)
                                        }
                                        aria-label={`Edit ${product.name}`}
                                        className="rounded-lg p-2 text-gray-500 hover:bg-purple-100 hover:text-purple-700"
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(product.id)
                                        }
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