import {
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react"

import type { LoginFormValues } from "./types"

const initialFormValues: LoginFormValues = {
    email: "",
    password: "",
}

type LoginPageProps = {
    onLogin: () => void
}

const LoginPage = ({
                       onLogin,
                   }: LoginPageProps) => {
    const [formValues, setFormValues] =
        useState<LoginFormValues>(initialFormValues)

    const [error, setError] = useState("")

    const handleChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target

        setFormValues((prevValues) => {
            return {
                ...prevValues,
                [name]: value,
            }
        })
    }

    const handleSubmit = (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault()

        const hasValidCredentials =
            formValues.email === "admin@escape.gr" &&
            formValues.password === "1234"

        if (!hasValidCredentials) {
            setError("Invalid email or password")
            return
        }

        setError("")
        onLogin()
    }

    return (
        <section className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <h1 className="text-center text-3xl font-extrabold text-gray-900">
                    Welcome To Escape
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
                            value={formValues.email}
                            onChange={handleChange}
                            placeholder="Enter your email address"
                            autoComplete="email"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
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
                            value={formValues.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                        />
                    </div>

                    {error && (
                        <p className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-700"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </section>
    )
}

export default LoginPage