const API_URL =
    import.meta.env.VITE_API_URL ??
    "http://localhost:3000/api"

type ApiResponse<T> = {
    success: boolean
    message?: string
    data?: T
}

export const apiRequest = async <T>(
    path: string,
    accessToken: string,
    options: RequestInit = {}
): Promise<T> => {
    const headers = new Headers(options.headers)

    headers.set(
        "Authorization",
        `Bearer ${accessToken}`
    )

    if (options.body) {
        headers.set(
            "Content-Type",
            "application/json"
        )
    }

    const response = await fetch(
        `${API_URL}${path}`,
        {
            ...options,
            headers,
        }
    )

    const responseBody =
        (await response.json()) as ApiResponse<T>

    if (!response.ok) {
        throw new Error(
            responseBody.message ??
            "Request failed"
        )
    }

    if (responseBody.data === undefined) {
        throw new Error(
            "The server returned an invalid response"
        )
    }

    return responseBody.data
}