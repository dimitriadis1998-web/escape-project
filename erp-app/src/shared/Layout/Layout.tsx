import Header from "./Header"
import Footer from "./Footer"
import type { LayoutProps } from "../types"

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="container mx-auto flex-1">
                {children}
            </main>

            <Footer />
        </div>
    )
}

export default Layout