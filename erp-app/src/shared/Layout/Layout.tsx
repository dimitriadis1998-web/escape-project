import Header from "./Header"
import Footer from "./Footer"
import { Outlet } from "react-router"
import Sidebar from "./Sidebar";


type LayoutProps = {
    onLogout: () => void
}

const Layout = ({
                    onLogout,
                }: LayoutProps) => {
    return (
        <div className="flex min-h-screen">
            <Sidebar/>
            <div className="flex flex-1 flex-col ">
                <Header onLogout={onLogout} />
              <main className="container mx-auto flex-1">
                <Outlet/>
              </main>
              <Footer />
            </div>
        </div>
    )
}

export default Layout