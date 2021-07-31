export function getExchangeRate(supply: number) {
    if (supply < 100000) {
        return 1
    }

    if (supply < 1000000) {
        return 0.1
    }

    if (supply < 10000000) {
        return 0.01
    }

    if (supply < 100000000) {
        return 0.001
    }

    if (supply < 1000000000) {
        return 0.0001
    }

    // Linear growth
    return 1 / supply * 100000
}
