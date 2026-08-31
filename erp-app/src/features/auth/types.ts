export type UserRole =
    | "admin"
    | "reader"

export type LoginFormValues = {
    email: string
    password: string
}

export type AuthenticatedUser = {
    id: string
    name: string
    email: string
    role: UserRole
    tenantId: string
}

export type AuthSession = {
    accessToken: string
    tokenType: string
    user: AuthenticatedUser
}