import {CalendarClock, LayoutDashboard, Package, Users, Warehouse} from "lucide-react";
import {NavLink} from "react-router";

const Sidebar = () => {



    return (
            <aside className="w-64 shrink-0 bg-gray-900 p-4 text-white">
                <nav className="flex flex-col gap-2">

                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) => {
                            const baseClasses =
                                "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left"
                            if (isActive) {
                                return `${baseClasses} bg-purple-600`
                            }
                            return `${baseClasses} hover:bg-gray-800`
                        }}
                    >
                        <LayoutDashboard className="h-5 w-5 shrink-0" />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/products"
                        className={({ isActive }) => {
                            const baseClasses =
                                "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left"

                            if (isActive) {
                                return `${baseClasses} bg-purple-600`
                            }

                            return `${baseClasses} hover:bg-gray-800`
                        }}
                    >
                        <Package className="h-5 w-5 shrink-0" />
                        <span>Products</span>
                    </NavLink>

                    <NavLink
                        to="/inventory"
                        className={({ isActive }) => {
                            const baseClasses =
                                "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left"

                            if (isActive) {
                                return `${baseClasses} bg-purple-600`
                            }

                            return `${baseClasses} hover:bg-gray-800`
                        }}
                    >
                        <Warehouse className="h-5 w-5 shrink-0" />
                        <span>Inventory</span>
                    </NavLink>

                   <NavLink
                       to="/expirations"
                       className={({ isActive }) => {
                           const baseClasses =
                               "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left"

                           if (isActive) {
                               return `${baseClasses} bg-purple-600`
                           }

                           return `${baseClasses} hover:bg-gray-800`
                       }}
                   >
                        <CalendarClock className="h-5 w-5 shrink-0"/>
                        <span>Expirations</span>
                   </NavLink>

                  <NavLink
                      to="/users"
                      className={({ isActive }) => {
                          const baseClasses =
                              "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left"

                          if (isActive) {
                              return `${baseClasses} bg-purple-600`
                          }

                          return `${baseClasses} hover:bg-gray-800`
                      }}
                  >
                        <Users className="h-5 w-5 shrink-0"/>
                        <span>Users</span>
                  </NavLink>


                </nav>
                </aside>



    )
}
export default Sidebar;