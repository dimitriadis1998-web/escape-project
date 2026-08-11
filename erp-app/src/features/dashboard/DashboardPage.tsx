import dashboardHero from "../../assets/images/dashboard-hero.png"
import type { Product } from "../products/types"
import { getDaysUntilExpiration } from "../../shared/utils/dateUtils"


type DashboardPageProps = {
    products: Product[],
    userName : string,
}

const DashboardPage = ({
                           products,
                           userName,
                       }: DashboardPageProps) => {
    const outOfStockProducts = products.filter((product) => {
        if (product.quantity === 0) {
            return true
        }

        return false
    })

    const expiringTomorrowProducts = products.filter((product) => {
        const daysLeft = getDaysUntilExpiration(
            product.expirationDate
        )

        return daysLeft === 1
    })

    const currentDate = new Date()

    return (
        <section className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-gray-800">
                    Welcome {userName}
                </h1>

                <p className="mt-1 font-medium text-gray-500">
                    {currentDate.toLocaleDateString()}
                </p>
            </div>

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

            <section className="mt-6">
                <h2 className="text-xl font-bold text-gray-800">
                    Notifications
                </h2>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <article className="rounded-xl border border-red-200 bg-red-50 p-4">
                        <h3 className="font-semibold text-red-700">
                            Out Of Stock
                        </h3>

                        {outOfStockProducts.length > 0 ? (
                            outOfStockProducts.map((product) => (
                                <p
                                    key={product.id}
                                    className="mt-2 text-sm text-red-700"
                                >
                                    {product.name} is out of stock
                                </p>
                            ))
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

                        {expiringTomorrowProducts.length > 0 ? (
                            expiringTomorrowProducts.map((product) => (
                                <p
                                    key={product.id}
                                    className="mt-2 text-sm text-yellow-700"
                                >
                                    {product.name} expires tomorrow
                                </p>
                            ))
                        ) : (
                            <p className="mt-2 text-sm text-yellow-700">
                                No products expire tomorrow
                            </p>
                        )}
                    </article>
                </div>
            </section>
        </section>
    )
}

export default DashboardPage