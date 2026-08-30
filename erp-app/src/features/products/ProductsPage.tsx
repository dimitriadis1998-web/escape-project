import {
    Heart,
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
import { getCategories } from "../categories/categories.api"
import {
    createProduct,
    deactivateProduct,
    getProducts,
    updateProduct,
} from "./products.api"

import type { Category } from "../categories/types"
import type { ProductRecord } from "./types"

type ProductFormValues = {
    name: string
    sku: string
    barcode: string
    description: string
    price: string
    categoryId: string
    isFavorite: boolean
}

const initialFormValues: ProductFormValues = {
    name: "",
    sku: "",
    barcode: "",
    description: "",
    price: "",
    categoryId: "",
    isFavorite: false,
}

const getErrorMessage = (
    error: unknown
): string => {
    return error instanceof Error
        ? error.message
        : "Something went wrong"
}

const ProductsPage = () => {
    const { accessToken, user } = useAuth()

    const [products, setProducts] =
        useState<ProductRecord[]>([])

    const [categories, setCategories] =
        useState<Category[]>([])

    const [formValues, setFormValues] =
        useState<ProductFormValues>(
            initialFormValues
        )

    const [editingProductId, setEditingProductId] =
        useState<string | null>(null)

    const [isFormOpen, setIsFormOpen] =
        useState(false)

    const [isLoading, setIsLoading] =
        useState(true)

    const [isSubmitting, setIsSubmitting] =
        useState(false)

    const [error, setError] = useState("")

    const canManageProducts =
        user?.role === "admin" ||
        user?.role === "editor"

    const refreshProducts =
        async (): Promise<void> => {
            if (!accessToken) {
                return
            }

            const productData =
                await getProducts(accessToken)

            setProducts(productData)
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
                        productData,
                        categoryData,
                    ] = await Promise.all([
                        getProducts(accessToken),
                        getCategories(accessToken),
                    ])

                    if (isActive) {
                        setProducts(productData)
                        setCategories(categoryData)
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
        setEditingProductId(null)
        setFormValues(initialFormValues)
        setError("")
        setIsFormOpen(true)
    }

    const handleEditClick = (
        product: ProductRecord
    ) => {
        setEditingProductId(product._id)

        setFormValues({
            name: product.name,
            sku: product.sku,
            barcode: product.barcode ?? "",
            description:
                product.description ?? "",
            price: product.price.toString(),
            categoryId:
            product.categoryId._id,
            isFavorite: product.isFavorite,
        })

        setError("")
        setIsFormOpen(true)
    }

    const handleChange = (
        event: ChangeEvent<
            | HTMLInputElement
            | HTMLTextAreaElement
            | HTMLSelectElement
        >
    ) => {
        const { name, value } = event.target

        setFormValues((previousValues) => ({
            ...previousValues,
            [name]: value,
        }))
    }

    const handleFavoriteChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setFormValues((previousValues) => ({
            ...previousValues,
            isFavorite: event.target.checked,
        }))
    }

    const handleCloseForm = () => {
        setFormValues(initialFormValues)
        setEditingProductId(null)
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
            name: formValues.name.trim(),
            sku: formValues.sku
                .trim()
                .toUpperCase(),
            barcode:
                formValues.barcode.trim() ||
                undefined,
            description:
                formValues.description.trim() ||
                undefined,
            price: Number(formValues.price),
            categoryId: formValues.categoryId,
            isFavorite:
            formValues.isFavorite,
        }

        try {
            if (editingProductId) {
                await updateProduct(
                    accessToken,
                    editingProductId,
                    input
                )
            } else {
                await createProduct(
                    accessToken,
                    input
                )
            }

            await refreshProducts()
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
        product: ProductRecord
    ): Promise<void> => {
        if (!accessToken) {
            return
        }

        const shouldDelete = window.confirm(
            `Deactivate ${product.name}?`
        )

        if (!shouldDelete) {
            return
        }

        setError("")

        try {
            await deactivateProduct(
                accessToken,
                product._id
            )

            await refreshProducts()
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
                        PRODUCTS
                    </h1>

                    <p className="mt-1 text-sm font-bold text-gray-600">
                        Manage your store products
                    </p>
                </div>

                {canManageProducts && (
                    <button
                        type="button"
                        onClick={handleOpenAddForm}
                        className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Add Product</span>
                    </button>
                )}
            </div>

            {error && (
                <p className="mb-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-700">
                    {error}
                </p>
            )}

            {isFormOpen && (
                <form
                    onSubmit={handleSubmit}
                    className="mb-6 rounded-xl border border-gray-200 bg-white p-6"
                >
                    <h2 className="mb-4 text-lg font-bold text-gray-800">
                        {editingProductId
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
                                disabled={isSubmitting}
                                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-purple-500"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-700">
                                SKU
                            </span>

                            <input
                                type="text"
                                name="sku"
                                value={formValues.sku}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                                className="rounded-lg border border-gray-300 px-3 py-2 uppercase outline-none focus:border-purple-500"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-700">
                                Barcode
                            </span>

                            <input
                                type="text"
                                name="barcode"
                                value={
                                    formValues.barcode
                                }
                                onChange={handleChange}
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
                                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-purple-500"
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-700">
                                Category
                            </span>

                            <select
                                name="categoryId"
                                value={
                                    formValues.categoryId
                                }
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-purple-500"
                            >
                                <option value="">
                                    Select category
                                </option>

                                {categories.map(
                                    (category) => (
                                        <option
                                            key={
                                                category._id
                                            }
                                            value={
                                                category._id
                                            }
                                        >
                                            {
                                                category.name
                                            }
                                        </option>
                                    )
                                )}
                            </select>
                        </label>

                        <label className="flex flex-col gap-1 md:col-span-2">
                            <span className="text-sm font-medium text-gray-700">
                                Description
                            </span>

                            <textarea
                                name="description"
                                value={
                                    formValues.description
                                }
                                onChange={handleChange}
                                disabled={isSubmitting}
                                rows={3}
                                className="rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-purple-500"
                            />
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={
                                    formValues.isFavorite
                                }
                                onChange={
                                    handleFavoriteChange
                                }
                                disabled={isSubmitting}
                                className="h-4 w-4 accent-purple-600"
                            />

                            <span className="text-sm font-medium text-gray-700">
                                Favorite product
                            </span>
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
                                categories.length === 0
                            }
                            className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-400"
                        >
                            {!editingProductId && (
                                <Plus className="h-5 w-5" />
                            )}

                            <span>
                                {isSubmitting
                                    ? "Saving..."
                                    : editingProductId
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
                            SKU
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Category
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Price
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Favorite
                        </th>

                        {canManageProducts && (
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
                                    canManageProducts
                                        ? 6
                                        : 5
                                }
                                className="px-4 py-8 text-center text-sm text-gray-500"
                            >
                                Loading products...
                            </td>
                        </tr>
                    ) : products.length === 0 ? (
                        <tr>
                            <td
                                colSpan={
                                    canManageProducts
                                        ? 6
                                        : 5
                                }
                                className="px-4 py-8 text-center text-sm text-gray-500"
                            >
                                No products found
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr
                                key={product._id}
                                className="border-t border-gray-200"
                            >
                                <td className="px-4 py-4 text-sm font-medium text-gray-800">
                                    {product.name}
                                </td>

                                <td className="px-4 py-4 text-sm text-gray-700">
                                    {product.sku}
                                </td>

                                <td className="px-4 py-4 text-sm text-gray-700">
                                    {
                                        product
                                            .categoryId
                                            .name
                                    }
                                </td>

                                <td className="px-4 py-4 text-sm text-gray-700">
                                    {product.price.toLocaleString(
                                        "el-GR",
                                        {
                                            style:
                                                "currency",
                                            currency:
                                                "EUR",
                                        }
                                    )}
                                </td>

                                <td className="px-4 py-4">
                                    <Heart
                                        className={
                                            product.isFavorite
                                                ? "h-5 w-5 fill-purple-600 text-purple-600"
                                                : "h-5 w-5 text-gray-400"
                                        }
                                    />
                                </td>

                                {canManageProducts && (
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEditClick(
                                                        product
                                                    )
                                                }
                                                aria-label={`Edit ${product.name}`}
                                                className="rounded-lg p-2 text-gray-500 hover:bg-purple-100 hover:text-purple-700"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    void handleDelete(
                                                        product
                                                    )
                                                }
                                                aria-label={`Deactivate ${product.name}`}
                                                className="rounded-lg p-2 text-gray-500 hover:bg-red-100 hover:text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default ProductsPage