import { useState } from "react"
import { Route, Routes } from "react-router"

import Layout from "./shared/Layout/Layout"
import DashboardPage from "./features/dashboard/DashboardPage"
import ProductsPage from "./features/products/ProductsPage"
import InventoryPage from "./features/inventory/InventoryPage"
import ExpirationsPage from "./features/expirations/ExpirationsPage"
import UsersPage from "./features/users/UsersPage"




// import InventoryPracticePage from "./features/inventory/InventoryPracticePage.tsx";

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
                    element={<DashboardPage products={products}
                    />}
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

                {/*<Route*/}
                {/*    path="/inventory-practice"*/}
                {/*    element={<InventoryPracticePage products={products}/>}*/}
                {/*        />*/}

                <Route
                    path="/expirations"
                    element={<ExpirationsPage products={products} />}
                />

                <Route
                    path="/users"
                    element={<UsersPage />}
                />


            </Routes>
        </Layout>
    )
}

export default App