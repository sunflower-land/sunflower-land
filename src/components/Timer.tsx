import React from 'react'

import timer from './images/ui/timer.png'

import './Timer.css'

interface Props {
    startAtSeconds: number
}

const THIRTY_MINUTES = 60 * 30

export const Timer: React.FC<Props> = ({ startAtSeconds }) => {
    const [secondsLeft, setSecondsLeft] = React.useState(THIRTY_MINUTES)

    React.useEffect(() => {
        const interval = window.setInterval(() => {
            const now = Math.floor(Date.now() / 1000)
            const difference = now - startAtSeconds
            console.log({ difference, seconds: (THIRTY_MINUTES - difference) / 3600})

            setSecondsLeft(THIRTY_MINUTES - difference)
        }, 1000)

        return () => window.clearInterval(interval)
    }, [secondsLeft, startAtSeconds])

    return (
        <div id="timer">
            <img src={timer} />
            {`${Math.floor(secondsLeft / 60)}:${secondsLeft % 60 }`}
        </div>
    )
}
