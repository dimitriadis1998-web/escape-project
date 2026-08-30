const MILLISECONDS_PER_DAY =
    1000 * 60 * 60 * 24

export const getDaysUntilExpiration = (
    expirationDate: string
): number => {
    const today = new Date()

    today.setHours(0, 0, 0, 0)

    const dateOnly =
        expirationDate.slice(0, 10)

    const [year, month, day] =
        dateOnly
            .split("-")
            .map(Number)

    const expiration = new Date(
        year,
        month - 1,
        day
    )

    expiration.setHours(0, 0, 0, 0)

    const differenceInMilliseconds =
        expiration.getTime() -
        today.getTime()

    return Math.ceil(
        differenceInMilliseconds /
        MILLISECONDS_PER_DAY
    )
}