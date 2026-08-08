import dashboardHero from "../../assets/images/dashboard-hero.png"
import type { Product } from "../products/types"

type DashboardPageProps = {
    products: Product[]
}

const DashboardPage = ({
                           products,
                       }: DashboardPageProps) => {
    return (
        <section className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-gray-800">
                    Welcome User
                </h1>

                <p className="mt-1 font-medium text-gray-500">
                    Date
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

                <p className="mt-2 text-sm text-gray-600">
                    {products.length} products available
                </p>
            </section>
        </section>
    )
}

export default DashboardPage