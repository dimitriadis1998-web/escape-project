import { createContext } from "react"

import type {
    AuthenticatedUser,
    LoginFormValues,
} from "./types"

export type AuthContextValue = {
    user: AuthenticatedUser | null
    accessToken: string | null
    isAuthenticated: boolean
    login: (
        credentials: LoginFormValues
    ) => Promise<void>
    logout: () => void
}

export const AuthContext =
    createContext<AuthContextValue | undefined>(
        undefined
    )