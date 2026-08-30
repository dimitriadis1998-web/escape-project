export type ManagedUserRole =
    | "admin"
    | "reader"

export type UserRecord = {
    _id: string
    name: string
    email: string
    role: ManagedUserRole
    tenantId: string
    isActive: boolean
    createdAt: string
    updatedAt: string
    __v?: number
}

export type RegisterUserInput = {
    name: string
    email: string
    password: string
    tenantId: string
}

export type RegisteredUser = {
    id: string
    name: string
    email: string
    role: ManagedUserRole
    tenantId: string
}

export type UpdateUserInput = {
    name?: string
    email?: string
    role?: ManagedUserRole
}

export type UserFormValues = {
    name: string
    email: string
    password: string
    role: ManagedUserRole
}