import {
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react"

import { useAuth } from "./AuthContext"

import type { LoginFormValues } from "./types"

const initialFormValues: LoginFormValues = {
    email: "",
    password: "",
}

const LoginPage = () => {
    const { login } = useAuth()

    const [formValues, setFormValues] =
        useState<LoginFormValues>(
            initialFormValues
        )

    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] =
        useState(false)

    const handleChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target

        setFormValues((previousValues) => ({
            ...previousValues,
            [name]: value,
        }))

        if (error) {
            setError("")
        }
    }

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        event.preventDefault()

        setError("")
        setIsSubmitting(true)

        try {
            await login({
                email: formValues.email
                    .trim()
                    .toLowerCase(),
                password: formValues.password,
            })
        } catch (loginError) {
            const message =
                loginError instanceof Error
                    ? loginError.message
                    : "Login failed"

            setError(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <h1 className="text-center text-3xl font-extrabold text-gray-900">
                    Welcome to ERP
                </h1>

                <p className="mt-2 text-center text-sm text-gray-500">
                    Sign in to manage your store
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-5"
                >
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={
                                formValues.email
                            }
                            onChange={handleChange}
                            placeholder="Enter your email address"
                            autoComplete="email"
                            required
                            disabled={isSubmitting}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={
                                formValues.password
                            }
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                            disabled={isSubmitting}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                        />
                    </div>

                    {error && (
                        <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-400"
                    >
                        {isSubmitting
                            ? "Signing in..."
                            : "Sign In"}
                    </button>
                </form>
            </div>
        </section>
    )
}

export default LoginPage