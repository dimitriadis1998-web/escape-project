import {CalendarClock, LayoutDashboard, Package, Settings, Users, Warehouse} from "lucide-react";

const Sidebar = () => {



    return (
            <aside className="w-64 shrink-0 bg-gray-900 p-4 text-white">
                <nav className="flex flex-col gap-2">
                    <button className="flex w-full items-center gap-3 rounded-lg bg-purple-600 px-3 py-3 text-left">
                        <LayoutDashboard className="h-5 w-5 shrink-0" />
                        <span>Dashboard</span>
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-gray-800">
                        <Package className="h-5 w-5 shrink-0"/>
                        <span>Products</span>
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-gray-800">
                        <Warehouse className="h-5 w-5 shrink-0"/>
                        <span>Inventory</span>
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-gray-800">
                        <CalendarClock className="h-5 w-5 shrink-0"/>
                        <span>Expirations</span>
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-gray-800">
                        <Users className="h-5 w-5 shrink-0"/>
                        <span>Users</span>
                    </button>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-gray-800">
                        <Settings className="h-5 w-5 shrink-0"/>
                        <span>Settings</span>
                    </button>


                </nav>
                </aside>



    )
}
export default Sidebar;