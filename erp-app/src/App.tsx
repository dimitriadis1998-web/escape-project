import { useState } from "react"
import { Route, Routes } from "react-router"

import Layout from "./shared/Layout/Layout"
import DashboardPage from "./features/dashboard/DashboardPage"
import ProductsPage from "./features/products/ProductsPage"
import InventoryPage from "./features/inventory/InventoryPage"
import ExpirationsPage from "./features/expirations/ExpirationsPage"
import UsersPage from "./features/users/UsersPage"
import SettingsPage from "./features/settings/SettingsPage"

import type { Product } from "./features/products/types"

const initialProducts: Product[] = [
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
]

function App() {
    const [products, setProducts] =
        useState<Product[]>(initialProducts)

    return (
        <Layout>
            <Routes>
                <Route
                    path="/"
                    element={<DashboardPage />}
                />

                <Route
                    path="/products"
                    element={
                        <ProductsPage
                            products={products}
                            setProducts={setProducts}
                        />
                    }
                />

                <Route
                    path="/inventory"
                    element={
                        <InventoryPage products={products} />
                    }
                />

                <Route
                    path="/expirations"
                    element={<ExpirationsPage />}
                />

                <Route
                    path="/users"
                    element={<UsersPage />}
                />

                <Route
                    path="/settings"
                    element={<SettingsPage />}
                />
            </Routes>
        </Layout>
    )
}

export default App