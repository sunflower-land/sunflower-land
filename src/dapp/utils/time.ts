export function secondsToString(seconds: number) {
    if (seconds <= 60) {
        return '1min'
    }

    // Less than 1 hour
    if (seconds < 60 * 60) {
        return `${Math.ceil(seconds / 60)}mins`
    }

    if (seconds === 60 * 60) {
        return '1hr'
    }

    if (seconds < 60 * 60 * 24) {
        return `${Math.ceil(seconds / 60 / 60)}hrs`
    }

    if (seconds === 60 * 60 * 24) {
        return '1day'
    }

    return `${Math.ceil(seconds / 60 / 60 / 24)}days`
}
