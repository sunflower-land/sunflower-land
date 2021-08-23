import React from 'react'

import timer from '../../images/ui/timer.png'

import './Timer.css'

interface Props {
    startAtSeconds: number
}

const THIRTY_MINUTES = 60 * 25

export const Timer: React.FC<Props> = ({ startAtSeconds }) => {
    const [secondsLeft, setSecondsLeft] = React.useState(THIRTY_MINUTES)

    React.useEffect(() => {
        const interval = window.setInterval(() => {
            const now = Math.floor(Date.now() / 1000)
            const difference = now - startAtSeconds

            setSecondsLeft(THIRTY_MINUTES - difference)
        }, 1000)

        return () => window.clearInterval(interval)
    }, [secondsLeft, startAtSeconds])

    return (
        <div id="timer" className={secondsLeft < 60*5 ? "red-timer" : ""}>
            <img src={timer} />
            {`${Math.floor(secondsLeft / 60)}:${(secondsLeft % 60).toString().padStart(2, '0') }`}
        </div>
    )
}
