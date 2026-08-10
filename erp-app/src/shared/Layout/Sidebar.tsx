import {
    CalendarClock,
    LayoutDashboard,
    Package,
    Users,
    Warehouse,
} from "lucide-react"
import { NavLink } from "react-router"

const Sidebar = () => {
    return (
        <aside className="w-16 shrink-0 bg-gray-900 p-2 text-white md:w-64 md:p-4">
            <nav className="flex flex-col gap-2">
                <NavLink
                    to="/"
                    end
                    title="Dashboard"
                    className={({ isActive }) => {
                        const baseClasses =
                            "flex w-full items-center justify-center gap-3 rounded-lg px-3 py-3 text-left md:justify-start"

                        if (isActive) {
                            return `${baseClasses} bg-purple-600`
                        }

                        return `${baseClasses} hover:bg-gray-800`
                    }}
                >
                    <LayoutDashboard className="h-5 w-5 shrink-0" />

                    <span className="hidden md:inline">
                        Dashboard
                    </span>
                </NavLink>

                <NavLink
                    to="/products"
                    title="Products"
                    className={({ isActive }) => {
                        const baseClasses =
                            "flex w-full items-center justify-center gap-3 rounded-lg px-3 py-3 text-left md:justify-start"

                        if (isActive) {
                            return `${baseClasses} bg-purple-600`
                        }

                        return `${baseClasses} hover:bg-gray-800`
                    }}
                >
                    <Package className="h-5 w-5 shrink-0" />

                    <span className="hidden md:inline">
                        Products
                    </span>
                </NavLink>

                <NavLink
                    to="/inventory"
                    title="Inventory"
                    className={({ isActive }) => {
                        const baseClasses =
                            "flex w-full items-center justify-center gap-3 rounded-lg px-3 py-3 text-left md:justify-start"

                        if (isActive) {
                            return `${baseClasses} bg-purple-600`
                        }

                        return `${baseClasses} hover:bg-gray-800`
                    }}
                >
                    <Warehouse className="h-5 w-5 shrink-0" />

                    <span className="hidden md:inline">
                        Inventory
                    </span>
                </NavLink>

                <NavLink
                    to="/expirations"
                    title="Expirations"
                    className={({ isActive }) => {
                        const baseClasses =
                            "flex w-full items-center justify-center gap-3 rounded-lg px-3 py-3 text-left md:justify-start"

                        if (isActive) {
                            return `${baseClasses} bg-purple-600`
                        }

                        return `${baseClasses} hover:bg-gray-800`
                    }}
                >
                    <CalendarClock className="h-5 w-5 shrink-0" />

                    <span className="hidden md:inline">
                        Expirations
                    </span>
                </NavLink>

                <NavLink
                    to="/users"
                    title="Users"
                    className={({ isActive }) => {
                        const baseClasses =
                            "flex w-full items-center justify-center gap-3 rounded-lg px-3 py-3 text-left md:justify-start"

                        if (isActive) {
                            return `${baseClasses} bg-purple-600`
                        }

                        return `${baseClasses} hover:bg-gray-800`
                    }}
                >
                    <Users className="h-5 w-5 shrink-0" />

                    <span className="hidden md:inline">
                        Users
                    </span>
                </NavLink>
            </nav>
        </aside>
    )
}

export default Sidebar