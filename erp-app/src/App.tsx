import { useState } from "react"
import {
    Navigate,
    Route,
    Routes,
} from "react-router"

import Layout from "./shared/Layout/Layout"
import DashboardPage from "./features/dashboard/DashboardPage"
import ProductsPage from "./features/products/ProductsPage"
import InventoryPage from "./features/inventory/InventoryPage"
import ExpirationsPage from "./features/expirations/ExpirationsPage"
import UsersPage from "./features/users/UsersPage"
import LoginPage from "./features/auth/LoginPage"
import NotFoundPage from "./features/not-found/NotFoundPage"
import { useAuth } from "./features/auth/AuthContext"

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
    const { user, logout } = useAuth()

    const [products] =
        useState<Product[]>(initialProducts)

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    user ? (
                        <Navigate
                            to="/"
                            replace
                        />
                    ) : (
                        <LoginPage />
                    )
                }
            />

            <Route
                element={
                    user ? (
                        <Layout
                            user={user}
                            onLogout={logout}
                        />
                    ) : (
                        <Navigate
                            to="/login"
                            replace
                        />
                    )
                }
            >
                <Route
                    index
                    element={
                        <DashboardPage
                            products={products}
                            userName={
                                user?.name ??
                                "User"
                            }
                        />
                    }
                />

                <Route
                    path="/products"
                    element={<ProductsPage />}
                />

                <Route
                    path="/inventory"
                    element={
                        <InventoryPage
                            products={products}
                        />
                    }
                />

                <Route
                    path="/expirations"
                    element={
                        <ExpirationsPage
                            products={products}
                        />
                    }
                />

                <Route
                    path="/users"
                    element={<UsersPage />}
                />

                <Route
                    path="*"
                    element={<NotFoundPage />}
                />
            </Route>
        </Routes>
    )
}

export default App