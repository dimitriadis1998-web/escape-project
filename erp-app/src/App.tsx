import Layout from "./shared/Layout/Layout";
import { Route , Routes} from "react-router"
import DashboardPage from "./features/dashboard/DashboardPage"
import ProductsPage from "./features/products/ProductsPage"
import InventoryPage from "./features/inventory/InventoryPage";
import SettingsPage from "./features/settings/SettingsPage";
import UsersPage from "./features/users/UsersPage";
import ExpirationsPage from "./features/expirations/ExpirationsPage";


function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<DashboardPage/>} />
                <Route path="/products" element={<ProductsPage/>} />
                <Route path="/inventory" element ={<InventoryPage/>} />
                <Route path="/expirations" element ={<ExpirationsPage/>} />
                <Route path="/users" element ={<UsersPage/>} />
                <Route path="/settings" element ={<SettingsPage/>} />

            </Routes>
        </Layout>





    )
}

export default App