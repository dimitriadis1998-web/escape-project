import { Outlet } from "react-router"

import Header from "./Header"
import Footer from "./Footer"
import Sidebar from "./Sidebar"

import type { AuthenticatedUser } from "../../features/auth/types"

type LayoutProps = {
    user: AuthenticatedUser
    onLogout: () => void
}

const Layout = ({
                    user,
                    onLogout,
                }: LayoutProps) => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <div className="flex flex-1 flex-col">
                <Header
                    user={user}
                    onLogout={onLogout}
                />

                <main className="container mx-auto flex-1">
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    )
}

export default Layout