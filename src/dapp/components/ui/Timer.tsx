import React from 'react'
import classnames from 'classnames'

import { service } from '../../machine'

import timer from '../../images/ui/timer.png'

import './Timer.css'

interface Props {
    startAtSeconds: number
}

const THIRTY_MINUTES = 60 * 25

export const Timer: React.FC<Props> = ({ startAtSeconds }) => {
    const [secondsLeft, setSecondsLeft] = React.useState(THIRTY_MINUTES)

    React.useEffect(() => {
        let interval: number;

        if (secondsLeft > 0) {
            interval = window.setInterval(() => {
                const now = Math.floor(Date.now() / 1000)
                const difference = now - startAtSeconds
                const time = THIRTY_MINUTES - difference
    
                setSecondsLeft(time)
            }, 1000)
        } else {
            service.send('TIMER_COMPLETE')
        }

        return () => window.clearInterval(interval)
    }, [startAtSeconds, secondsLeft])

    return (
        <div id="timer" className={classnames(secondsLeft < 60*5 ? "red-timer" : "", (secondsLeft < 60*1 && secondsLeft !== 0) ? "pulse" : "")}>
            <img src={timer} />
            {`${Math.floor(secondsLeft / 60)}:${(secondsLeft % 60).toString().padStart(2, '0') }`}
        </div>
    )
}
