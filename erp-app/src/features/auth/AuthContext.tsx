import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react"

import { loginRequest } from "./auth.api"

import type {
    AuthenticatedUser,
    AuthSession,
    LoginFormValues,
} from "./types"

const AUTH_STORAGE_KEY = "erp-auth-session"

type AuthContextValue = {
    user: AuthenticatedUser | null
    accessToken: string | null
    isAuthenticated: boolean
    login: (
        credentials: LoginFormValues
    ) => Promise<void>
    logout: () => void
}

type AuthProviderProps = {
    children: ReactNode
}

const AuthContext =
    createContext<AuthContextValue | undefined>(
        undefined
    )

const getStoredSession = (): AuthSession | null => {
    const storedSession = localStorage.getItem(
        AUTH_STORAGE_KEY
    )

    if (!storedSession) {
        return null
    }

    try {
        const parsedSession = JSON.parse(
            storedSession
        ) as AuthSession

        if (
            typeof parsedSession.accessToken !==
            "string" ||
            !parsedSession.user ||
            typeof parsedSession.user.id !==
            "string"
        ) {
            localStorage.removeItem(
                AUTH_STORAGE_KEY
            )
            return null
        }

        return parsedSession
    } catch {
        localStorage.removeItem(
            AUTH_STORAGE_KEY
        )
        return null
    }
}

export const AuthProvider = ({
                                 children,
                             }: AuthProviderProps) => {
    const [session, setSession] =
        useState<AuthSession | null>(
            getStoredSession
        )

    const login = async (
        credentials: LoginFormValues
    ): Promise<void> => {
        const authSession =
            await loginRequest(credentials)

        localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify(authSession)
        )

        setSession(authSession)
    }

    const logout = (): void => {
        localStorage.removeItem(
            AUTH_STORAGE_KEY
        )

        setSession(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user: session?.user ?? null,
                accessToken:
                    session?.accessToken ?? null,
                isAuthenticated:
                    session !== null,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        )
    }

    return context
}