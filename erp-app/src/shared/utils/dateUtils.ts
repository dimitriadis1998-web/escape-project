const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24

export const getDaysUntilExpiration = (
    expirationDate: string
) => {
    const today = new Date()

    today.setHours(0, 0, 0, 0)

    const expiration = new Date(
        `${expirationDate}T00:00:00`
    )

    const differenceInMilliseconds =
        expiration.getTime() - today.getTime()

    return Math.ceil(
        differenceInMilliseconds / MILLISECONDS_PER_DAY
    )
}