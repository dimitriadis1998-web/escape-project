import {
    useCallback,
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react"
import {
    Pencil,
    Plus,
    Trash2,
} from "lucide-react"

import { useAuth } from "../auth/AuthContext"

import {
    deactivateUser,
    getUsers,
    registerUser,
    updateUser,
} from "./users.api"

import type {
    ManagedUserRole,
    UserFormValues,
    UserRecord,
} from "./types"

const initialFormValues: UserFormValues = {
    name: "",
    email: "",
    password: "",
    role: "reader",
}

const getErrorMessage = (
    error: unknown
): string => {
    if (error instanceof Error) {
        return error.message
    }

    return "An unexpected error occurred"
}

const formatRole = (
    role: ManagedUserRole
): string => {
    return (
        role.charAt(0).toUpperCase() +
        role.slice(1)
    )
}

const UsersPage = () => {
    const {
        user: currentUser,
        accessToken,
    } = useAuth()

    const [users, setUsers] =
        useState<UserRecord[]>([])

    const [isLoading, setIsLoading] =
        useState(true)

    const [isSaving, setIsSaving] =
        useState(false)

    const [deactivatingUserId, setDeactivatingUserId] =
        useState<string | null>(null)

    const [isFormOpen, setIsFormOpen] =
        useState(false)

    const [editingUserId, setEditingUserId] =
        useState<string | null>(null)

    const [formValues, setFormValues] =
        useState<UserFormValues>(
            initialFormValues
        )

    const [error, setError] =
        useState("")

    const [successMessage, setSuccessMessage] =
        useState("")

    const isAdmin =
        currentUser?.role === "admin"

    const loadUsers =
        useCallback(async (): Promise<void> => {
            if (!accessToken || !isAdmin) {
                setIsLoading(false)
                return
            }

            setIsLoading(true)
            setError("")

            try {
                const userRecords =
                    await getUsers(accessToken)

                setUsers(userRecords)
            } catch (requestError) {
                setError(
                    getErrorMessage(requestError)
                )
            } finally {
                setIsLoading(false)
            }
        }, [accessToken, isAdmin])

    useEffect(() => {
        void loadUsers()
    }, [loadUsers])

    const resetForm = (): void => {
        setFormValues(initialFormValues)
        setEditingUserId(null)
        setIsFormOpen(false)
    }

    const handleOpenAddForm = (): void => {
        setError("")
        setSuccessMessage("")
        setEditingUserId(null)
        setFormValues(initialFormValues)
        setIsFormOpen(true)
    }

    const handleOpenEditForm = (
        selectedUser: UserRecord
    ): void => {
        setError("")
        setSuccessMessage("")
        setEditingUserId(selectedUser._id)

        setFormValues({
            name: selectedUser.name,
            email: selectedUser.email,
            password: "",
            role: selectedUser.role,
        })

        setIsFormOpen(true)
    }

    const handleFormChange = (
        event: ChangeEvent<
            HTMLInputElement |
            HTMLSelectElement
        >
    ): void => {
        const {
            name,
            value,
        } = event.target

        if (name === "role") {
            setFormValues((previousValues) => ({
                ...previousValues,
                role: value as ManagedUserRole,
            }))

            return
        }

        setFormValues((previousValues) => ({
            ...previousValues,
            [name]: value,
        }))
    }

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        event.preventDefault()

        if (
            !accessToken ||
            !currentUser ||
            !isAdmin
        ) {
            return
        }

        setIsSaving(true)
        setError("")
        setSuccessMessage("")

        try {
            if (editingUserId) {
                await updateUser(
                    accessToken,
                    editingUserId,
                    {
                        name: formValues.name.trim(),
                        email: formValues.email
                            .trim()
                            .toLowerCase(),
                        role: formValues.role,
                    }
                )

                setSuccessMessage(
                    "User updated successfully"
                )
            } else {
                const registeredUser =
                    await registerUser(
                        accessToken,
                        {
                            name: formValues.name
                                .trim(),
                            email: formValues.email
                                .trim()
                                .toLowerCase(),
                            password:
                            formValues.password,
                            tenantId:
                            currentUser.tenantId,
                        }
                    )

                if (
                    formValues.role === "admin"
                ) {
                    await updateUser(
                        accessToken,
                        registeredUser.id,
                        {
                            role: "admin",
                        }
                    )
                }

                setSuccessMessage(
                    "User created successfully"
                )
            }

            resetForm()
            await loadUsers()
        } catch (requestError) {
            setError(
                getErrorMessage(requestError)
            )
        } finally {
            setIsSaving(false)
        }
    }

    const handleDeactivateUser = async (
        selectedUser: UserRecord
    ): Promise<void> => {
        if (
            !accessToken ||
            !isAdmin ||
            selectedUser._id === currentUser?.id
        ) {
            return
        }

        const shouldDeactivate =
            window.confirm(
                `Deactivate ${selectedUser.name}?`
            )

        if (!shouldDeactivate) {
            return
        }

        setDeactivatingUserId(
            selectedUser._id
        )
        setError("")
        setSuccessMessage("")

        try {
            await deactivateUser(
                accessToken,
                selectedUser._id
            )

            setUsers((previousUsers) => {
                return previousUsers.filter(
                    (userRecord) =>
                        userRecord._id !==
                        selectedUser._id
                )
            })

            setSuccessMessage(
                "User deactivated successfully"
            )
        } catch (requestError) {
            setError(
                getErrorMessage(requestError)
            )
        } finally {
            setDeactivatingUserId(null)
        }
    }

    if (!isAdmin) {
        return (
            <section className="p-6">
                <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-6">
                    <h1 className="text-xl font-bold text-yellow-800">
                        Administrator access required
                    </h1>

                    <p className="mt-2 text-sm text-yellow-700">
                        Only administrators can view
                        and manage application users.
                    </p>
                </div>
            </section>
        )
    }

    return (
        <section className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-800">
                        USERS
                    </h1>

                    <p className="mt-1 text-sm font-bold text-gray-600">
                        Manage application users
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleOpenAddForm}
                    disabled={isFormOpen}
                    className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add User</span>
                </button>
            </div>

            {error && (
                <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                    {error}
                </p>
            )}

            {successMessage && (
                <p className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
                    {successMessage}
                </p>
            )}

            {isFormOpen && (
                <form
                    onSubmit={handleSubmit}
                    className="mb-6 rounded-xl border border-purple-200 bg-purple-50 p-4"
                >
                    <h2 className="mb-4 text-lg font-bold text-gray-800">
                        {editingUserId
                            ? "Edit User"
                            : "Add New User"}
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                            <span>Name</span>

                            <input
                                required
                                minLength={2}
                                maxLength={100}
                                type="text"
                                name="name"
                                value={formValues.name}
                                onChange={handleFormChange}
                                placeholder="Full name"
                                className="rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-purple-500"
                            />
                        </label>

                        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                            <span>Email</span>

                            <input
                                required
                                maxLength={150}
                                type="email"
                                name="email"
                                value={formValues.email}
                                onChange={handleFormChange}
                                placeholder="Email address"
                                className="rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-purple-500"
                            />
                        </label>

                        {!editingUserId && (
                            <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                                <span>Password</span>

                                <input
                                    required
                                    minLength={8}
                                    maxLength={72}
                                    type="password"
                                    name="password"
                                    value={
                                        formValues.password
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    placeholder="At least 8 characters"
                                    autoComplete="new-password"
                                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-purple-500"
                                />
                            </label>
                        )}

                        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                            <span>Role</span>

                            <select
                                name="role"
                                value={formValues.role}
                                onChange={handleFormChange}
                                className="rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-purple-500"
                            >
                                <option value="reader">
                                    Reader
                                </option>

                                <option value="admin">
                                    Admin
                                </option>
                            </select>
                        </label>
                    </div>

                    <div className="mt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={isSaving}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="rounded-lg bg-purple-600 px-4 py-2 text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSaving
                                ? "Saving..."
                                : editingUserId
                                    ? "Update User"
                                    : "Save User"}
                        </button>
                    </div>
                </form>
            )}

            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                <table className="w-full">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Name
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Email
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Role
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Status
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-600">
                            Actions
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {isLoading ? (
                        <tr>
                            <td
                                colSpan={5}
                                className="px-4 py-8 text-center text-sm text-gray-500"
                            >
                                Loading users...
                            </td>
                        </tr>
                    ) : users.length > 0 ? (
                        users.map(
                            (userRecord) => {
                                const isCurrentUser =
                                    userRecord._id ===
                                    currentUser?.id

                                const isDeactivating =
                                    deactivatingUserId ===
                                    userRecord._id

                                return (
                                    <tr
                                        key={
                                            userRecord._id
                                        }
                                        className="border-t border-gray-200 hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-4 text-sm font-medium text-gray-800">
                                            {
                                                userRecord.name
                                            }

                                            {isCurrentUser && (
                                                <span className="ml-2 text-xs font-semibold text-purple-600">
                                                        You
                                                    </span>
                                            )}
                                        </td>

                                        <td className="px-4 py-4 text-sm text-gray-700">
                                            {
                                                userRecord.email
                                            }
                                        </td>

                                        <td className="px-4 py-4 text-sm">
                                                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                                                    {formatRole(
                                                        userRecord.role
                                                    )}
                                                </span>
                                        </td>

                                        <td className="px-4 py-4 text-sm">
                                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                    Active
                                                </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleOpenEditForm(
                                                            userRecord
                                                        )
                                                    }
                                                    aria-label={`Edit ${userRecord.name}`}
                                                    className="rounded-lg p-2 text-gray-500 transition hover:bg-purple-100 hover:text-purple-600"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        void handleDeactivateUser(
                                                            userRecord
                                                        )
                                                    }
                                                    disabled={
                                                        isCurrentUser ||
                                                        isDeactivating
                                                    }
                                                    title={
                                                        isCurrentUser
                                                            ? "You cannot deactivate your own account"
                                                            : "Deactivate user"
                                                    }
                                                    aria-label={`Deactivate ${userRecord.name}`}
                                                    className="rounded-lg p-2 text-gray-500 transition hover:bg-red-100 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }
                        )
                    ) : (
                        <tr>
                            <td
                                colSpan={5}
                                className="px-4 py-8 text-center text-sm text-gray-500"
                            >
                                No active users found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default UsersPage