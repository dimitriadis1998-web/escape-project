import type {
    AuthSession,
    LoginFormValues,
} from "./types"

const API_URL =
    import.meta.env.VITE_API_URL ??
    "http://localhost:3000/api"

type LoginApiResponse = {
    success: boolean
    message?: string
    data?: AuthSession
}

export const loginRequest = async (
    credentials: LoginFormValues
): Promise<AuthSession> => {
    const response = await fetch(
        `${API_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        }
    )

    const responseBody =
        (await response.json()) as LoginApiResponse

    if (!response.ok || !responseBody.data) {
        throw new Error(
            responseBody.message ??
            "Login failed"
        )
    }

    return responseBody.data
}