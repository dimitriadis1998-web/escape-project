import Header from "./Header"
import Footer from "./Footer"
import type { LayoutProps } from "../types"
import Sidebar from "./Sidebar";

const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="flex min-h-screen">
            <Sidebar/>
            <div className="flex flex-1 flex-col ">
              <Header />
              <main className="container mx-auto flex-1">
                {children}
              </main>
              <Footer />
            </div>
        </div>
    )
}

export default Layout