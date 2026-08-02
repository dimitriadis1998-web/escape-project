import Layout from "./shared/Layout/Layout";
import { Route , Routes} from "react-router"
import DashboardPage from "./features/dashboard/DashboardPage"
import ProductsPage from "./features/products/ProductsPage"

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<DashboardPage/>} />
                <Route path="/products" element={<ProductsPage/>} />
            </Routes>
        </Layout>





    )
}

export default App