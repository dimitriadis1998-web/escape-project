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
import { useAuth } from "./features/auth/useAuth"

function App() {
    const { user, logout } = useAuth()

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
                    element={<DashboardPage />}
                />

                <Route
                    path="/products"
                    element={<ProductsPage />}
                />

                <Route
                    path="/inventory"
                    element={<InventoryPage />}
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
                    path="*"
                    element={<NotFoundPage />}
                />
            </Route>
        </Routes>
    )
}

export default App