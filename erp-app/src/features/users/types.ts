export type User = {
    id: string
    name: string
    email: string
    active: boolean
    role: string
}

export type UserFormValues = {
    name : string,
    email : string,
    role : string,
    active : boolean,
}