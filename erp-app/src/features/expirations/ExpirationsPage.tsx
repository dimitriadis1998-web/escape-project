import type { Product } from "../products/types"

type ExpirationsPageProps = {
    products: Product[]
}

const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24

const getDaysUntilExpiration = (
    expirationDate: string
) => {
    const today = new Date()

    today.setHours(0, 0, 0, 0)

    const expiration = new Date(
        `${expirationDate}T00:00:00`
    )

    const differenceInMilliseconds =
        expiration.getTime() - today.getTime()

    return Math.ceil(
        differenceInMilliseconds / MILLISECONDS_PER_DAY
    )
}

const getExpirationStatus = (daysLeft: number) => {
    if (daysLeft < 0) {
        return {
            label: "Expired",
            className: "bg-red-100 text-red-700",
        }
    }

    if (daysLeft <= 7) {
        return {
            label: "Expires Soon",
            className: "bg-yellow-100 text-yellow-700",
        }
    }

    return {
        label: "Safe",
        className: "bg-green-100 text-green-700",
    }
}

const getDaysLeftLabel = (daysLeft: number) => {
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

const ExpirationsPage = ({
                             products,
                         }: ExpirationsPageProps) => {
    return (
        <section className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-gray-800">
                    EXPIRATIONS
                </h1>

                <p className="mt-1 text-sm font-bold text-gray-600">
                    Monitor product expiration dates
                </p>
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
                    {products.length === 0 ? (
                        <tr>
                            <td
                                colSpan={6}
                                className="px-4 py-8 text-center text-sm text-gray-500"
                            >
                                No products found
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => {
                            const daysLeft =
                                getDaysUntilExpiration(
                                    product.expirationDate
                                )

                            const expirationStatus =
                                getExpirationStatus(daysLeft)

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

                                    <td className="px-4 py-4 text-sm text-gray-700">
                                        {product.expirationDate}
                                    </td>

                                    <td className="px-4 py-4 text-sm text-gray-700">
                                        {getDaysLeftLabel(daysLeft)}
                                    </td>

                                    <td className="px-4 py-4 text-sm">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${expirationStatus.className}`}
                                            >
                                                {expirationStatus.label}
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