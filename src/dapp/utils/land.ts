export function getPrice(landSize: number) {
    if (landSize < 8) {
        return 1
    }

    if (landSize < 11) {
        return 50
    }

    if (landSize < 14) {
        return 500
    }

    return 2500
}
