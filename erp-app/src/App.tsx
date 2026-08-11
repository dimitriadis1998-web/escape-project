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

    const [isAuthenticated, setIsAuthenticated] =
        useState(false)

    const handleLogin = () => {
        setIsAuthenticated(true)
    }

    const handleLogout = () => {
        setIsAuthenticated(false)
    }

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    isAuthenticated ? (
                        <Navigate
                            to="/"
                            replace
                        />
                    ) : (
                        <LoginPage
                            onLogin={handleLogin}
                        />
                    )
                }
            />

            <Route
                element={
                    isAuthenticated ? (
                        <Layout onLogout={handleLogout} />
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
                        />
                    }
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