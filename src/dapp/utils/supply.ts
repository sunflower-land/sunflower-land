export function getExchangeRate(supply: number) {
    if (supply < 100000) {
        return 1
    }

    if (supply < 500000) {
        return 0.5
    }

    if (supply < 1000000) {
        return 0.1
    }

    if (supply < 5000000) {
        return 0.05
    }

    if (supply < 10000000) {
        return 0.01
    }

    if (supply < 50000000) {
        return 0.005
    }

    if (supply < 100000000) {
        return 0.001
    }

    if (supply < 500000000) {
        return 0.0005
    }

    if (supply < 1000000000) {
        return 0.0001
    }

    // Linear growth
    return 1 / supply * 100000
}
