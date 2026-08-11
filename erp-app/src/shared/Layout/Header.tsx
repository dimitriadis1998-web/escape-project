import {
    LogOut,
    UserRound,
} from "lucide-react"

import type { AuthenticatedUser } from "../../features/auth/types"


type HeaderProps = {
    user: AuthenticatedUser
    onLogout: () => void
}

const Header = ({
                    user,
                    onLogout,
                }: HeaderProps) => {
    return (
        <header className="flex h-16 w-full items-center justify-between bg-purple-600 px-6 text-white">
            <div>
                <h2 className="text-lg font-bold">
                    Escape ERP
                </h2>

                <p className="text-xs text-purple-100">
                    Inventory Management System
                </p>
            </div>

            <div className="flex items-center gap-3 border-l border-white/20 pl-4">
                <div className="text-right leading-tight">
                    <p className="text-sm font-semibold text-white">
                        {user.name}
                    </p>

                    <p className="mt-0.5 text-xs text-purple-100">
                        {user.role}
                    </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-purple-700 shadow-sm">
                    <UserRound className="h-5 w-5" />
                </div>

                <button
                    type="button"
                    onClick={onLogout}
                    aria-label="Logout"
                    title="Logout"
                    className="rounded-lg p-2 text-purple-100 transition hover:bg-white/15 hover:text-white"
                >
                    <LogOut className="h-5 w-5" />
                </button>
            </div>
        </header>
    )
}

export default Header