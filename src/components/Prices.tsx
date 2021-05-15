import React from 'react'

export interface Props {
    apples: number
    avocados: number
    timestamp: number
    previousTimestamp: number
}

export const Prices: React.FC<Props> = (prices) => {
    return (
        <div>
            <pre>
                { JSON.stringify(prices, null, 2)}
            </pre>
        </div>
    )
}
