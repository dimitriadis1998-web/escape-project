import { UserRound } from "lucide-react"

const Header = () => {
    return (
        <header className="flex h-16 w-full items-center justify-between border-b border-purple-800 bg-purple-700 px-6 text-white">
            <div>
                <h2 className="text-lg font-bold text-white">
                    Escape ERP
                </h2>

                <p className="text-xs text-purple-100">
                    Inventory Management System
                </p>
            </div>

            <div className="flex items-center gap-3 border-l border-white/20 pl-4">
                <div className="text-right leading-tight">
                    <p className="text-sm font-semibold text-white">
                        Kiriakos
                    </p>

                    <p className="mt-0.5 text-xs text-purple-100">
                        Admin
                    </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-purple-700 shadow-sm">
                    <UserRound className="h-5 w-5" />
                </div>
            </div>
        </header>
    )
}

export default Header