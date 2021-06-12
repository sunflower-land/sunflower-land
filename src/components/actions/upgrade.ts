export function getSellPrice(level: number) {
    if (level === 2) {
        return 1;
    }
    if (level === 3) {
        return 30;
    } else if (level === 4) {
        return 300;
    }
    
    return 1000;
}
