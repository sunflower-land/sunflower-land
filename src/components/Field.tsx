import React from 'react'
import young from './images/apples/image_part_161.png'
import avocado from './images/avocados/tree.png'
import banana from './images/bananas/tree.png'
import coconut from './images/coconuts/tree.png'
import terrain from './images/apples/soil.png'

import { Commodity, Square } from './types/contract'
interface Props {
    square: Square
    onClick: () => void
}

const HARVEST_TIMES: Record<Commodity, number> = {
    [Commodity.Apple]: 1,
    [Commodity.Avocado]: 3,
    [Commodity.Banana]: 8,
    [Commodity.Coconut]: 24,
    [Commodity.None]: 0,
}

export const Field: React.FC<Props> = ({ square, onClick }) => {
    const [timeLeft, setTimeLeft] = React.useState('')

    const setHarvestTime = () => {
        const secondsElapsed = (Date.now()/1000) - square.createdAt;
        if (secondsElapsed > HARVEST_TIMES[square.commodity]) {
            setTimeLeft('ready')
            return
            // TODO - clear interval
        }

        const timeLeft = HARVEST_TIMES[square.commodity] - secondsElapsed
        setTimeLeft(`${timeLeft.toFixed(2)} seconds`)
    }

    React.useEffect(() => {
        if (square.commodity && square.commodity !== Commodity.None) {
            const interval = window.setInterval(setHarvestTime, 1000)
            return () => window.clearInterval(interval)
        }
    }, [square])

    const Content = () => {
        if (square.commodity == Commodity.Apple) {
            return (
                <img src={young} className="field-image"/>
            )
        }

        if (square.commodity == Commodity.Avocado) {
            return (
                <img src={avocado} className="field-image"/>
            )
        }

        if (square.commodity == Commodity.Banana) {
            return (
                <img src={banana} className="field-image"/>
            )
        }

        if (square.commodity == Commodity.Coconut) {
            return (
                <img src={coconut} className="field-image"/>
            )
        }

        return <img src={terrain} className="field-image"/>
    }

    return (
        <div className="field" onClick={onClick}>
            <Content />
            <span>
                {
                    timeLeft
                }
            </span>
        </div>
    )
}
