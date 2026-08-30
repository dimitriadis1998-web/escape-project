import { apiRequest } from "../../shared/api/api-client"

import type {
    RegisteredUser,
    RegisterUserInput,
    UpdateUserInput,
    UserRecord,
} from "./types"

export const getUsers = (
    accessToken: string
): Promise<UserRecord[]> => {
    return apiRequest<UserRecord[]>(
        "/users",
        accessToken
    )
}

export const registerUser = (
    accessToken: string,
    input: RegisterUserInput
): Promise<RegisteredUser> => {
    return apiRequest<RegisteredUser>(
        "/auth/register",
        accessToken,
        {
            method: "POST",
            body: JSON.stringify(input),
        }
    )
}

export const updateUser = (
    accessToken: string,
    userId: string,
    input: UpdateUserInput
): Promise<UserRecord> => {
    return apiRequest<UserRecord>(
        `/users/${userId}`,
        accessToken,
        {
            method: "PUT",
            body: JSON.stringify(input),
        }
    )
}

export const deactivateUser = (
    accessToken: string,
    userId: string
): Promise<UserRecord> => {
    return apiRequest<UserRecord>(
        `/users/${userId}`,
        accessToken,
        {
            method: "DELETE",
        }
    )
}