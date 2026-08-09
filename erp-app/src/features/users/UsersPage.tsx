import {
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react"
import { Plus, Trash2 } from "lucide-react"
import type { User, UserFormValues } from "./types"

const initialUsers: User[] = [
    {
        id: "1",
        name: "Kiriakos",
        email: "kiriakos123@gmail.com",
        active: true,
        role: "Admin",
    },
    {
        id: "2",
        name: "Anastasia",
        email: "anastasia1@gmail.com",
        active: false,
        role: "Employee",
    },
]

const initialFormValues: UserFormValues = {
    name: "",
    email: "",
    role: "Employee",
    active: true,
}

const UsersPage = () => {
    const [users, setUsers] =
        useState<User[]>(initialUsers)

    const [isFormOpen, setIsFormOpen] =
        useState(false)

    const [formValues, setFormValues] =
        useState<UserFormValues>(initialFormValues)

    const handleFormChange = (
        event: ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = event.target

        setFormValues((prevValues) => {
            return {
                ...prevValues,
                [name]: value,
            }
        })
    }

    const handleActiveChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setFormValues((prevValues) => {
            return {
                ...prevValues,
                active: event.target.checked,
            }
        })
    }

    const handleAddUser = (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault()

        if (
            !formValues.name.trim() ||
            !formValues.email.trim()
        ) {
            return
        }

        const newUser: User = {
            id: crypto.randomUUID(),
            name: formValues.name.trim(),
            email: formValues.email.trim(),
            role: formValues.role,
            active: formValues.active,
        }

        setUsers((prevUsers) => {
            return [...prevUsers, newUser]
        })

        setFormValues(initialFormValues)
        setIsFormOpen(false)
    }

    const handleCancel = () => {
        setFormValues(initialFormValues)
        setIsFormOpen(false)
    }

    const handleDeleteUser = (id: string) => {
        setUsers((prevUsers) => {
            return prevUsers.filter(
                (user) => user.id !== id
            )
        })
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
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add User</span>
                </button>
            </div>

            {isFormOpen && (
                <form
                    onSubmit={handleAddUser}
                    className="mb-6 rounded-xl border border-purple-200 bg-purple-50 p-4"
                >
                    <h2 className="mb-4 text-lg font-bold text-gray-800">
                        Add New User
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                            <span>Name</span>

                            <input
                                required
                                type="text"
                                name="name"
                                value={formValues.name}
                                onChange={handleFormChange}
                                placeholder="Username"
                                className="rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-purple-500"
                            />
                        </label>

                        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                            <span>Email</span>

                            <input
                                required
                                type="email"
                                name="email"
                                value={formValues.email}
                                onChange={handleFormChange}
                                placeholder="Email address"
                                className="rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-purple-500"
                            />
                        </label>

                        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                            <span>Role</span>

                            <select
                                name="role"
                                value={formValues.role}
                                onChange={handleFormChange}
                                className="rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:border-purple-500"
                            >
                                <option value="Employee">
                                    Employee
                                </option>

                                <option value="Admin">
                                    Admin
                                </option>
                            </select>
                        </label>

                        <label className="flex items-center gap-2 self-end rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700">
                            <input
                                type="checkbox"
                                checked={formValues.active}
                                onChange={handleActiveChange}
                                className="h-4 w-4 accent-purple-600"
                            />

                            <span>Active user</span>
                        </label>
                    </div>

                    <div className="mt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
                        >
                            Save User
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
                            Action
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr
                                key={user.id}
                                className="border-t border-gray-200 hover:bg-gray-50"
                            >
                                <td className="px-4 py-4 text-sm font-medium text-gray-800">
                                    {user.name}
                                </td>

                                <td className="px-4 py-4 text-sm text-gray-700">
                                    {user.email}
                                </td>

                                <td className="px-4 py-4 text-sm">
                                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                                            {user.role}
                                        </span>
                                </td>

                                <td className="px-4 py-4 text-sm">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                user.active
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-200 text-gray-600"
                                            }`}
                                        >
                                            {user.active
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                </td>

                                <td className="px-4 py-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteUser(user.id)
                                        }
                                        aria-label={`Delete ${user.name}`}
                                        className="rounded-lg p-2 text-gray-500 hover:bg-red-100 hover:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={5}
                                className="px-4 py-8 text-center text-sm text-gray-500"
                            >
                                No users found
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