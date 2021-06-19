import React from 'react'
import young from './images/apples/image_part_161.png'
import avocado from './images/avocados/tree.png'
import banana from './images/bananas/tree.png'
import coconut from './images/coconuts/tree.png'
import terrain from './images/land/soil/soil.png'
import planted from './images/land/soil/planted.png'
import progress from './images/land/soil/progress/greenbar_01.png'
import seedling from './images/tree.png'

import './Field.css'
import { Fruit, Square } from './types/contract'
interface Props {
    square: Square
    onClick: () => void
}

const HARVEST_TIMES: Record<Fruit, number> = {
    [Fruit.Apple]: 1,
    [Fruit.Avocado]: 3,
    [Fruit.Banana]: 8,
    [Fruit.Coconut]: 24,
    [Fruit.None]: 0,
}

export const Field: React.FC<Props> = ({ square, onClick }) => {
    const [timeLeft, setTimeLeft] = React.useState('')

    const setHarvestTime = () => {
        const secondsElapsed = (Date.now()/1000) - square.createdAt;
        if (secondsElapsed > HARVEST_TIMES[square.fruit]) {
            setTimeLeft('ready')
            return
            // TODO - clear interval
        }

        const timeLeft = HARVEST_TIMES[square.fruit] - secondsElapsed
        setTimeLeft(`${timeLeft.toFixed(2)} seconds`)
    }

    React.useEffect(() => {
        if (square.fruit && square.fruit !== Fruit.None) {
            const interval = window.setInterval(setHarvestTime, 1000)
            return () => window.clearInterval(interval)
        }
    }, [setHarvestTime, square])

    const Content = () => {
        if (square.fruit == Fruit.Apple) {
            return (
                <img src={young} className="field-image"/>
            )
        }

        if (square.fruit == Fruit.Avocado) {
            return (
                <img src={avocado} className="field-image"/>
            )
        }

        if (square.fruit == Fruit.Banana) {
            return (
                <img src={banana} className="field-image"/>
            )
        }

        if (square.fruit == Fruit.Coconut) {
            return (
                <img src={coconut} className="field-image"/>
            )
        }

        return <img src={terrain} className="field-image"/>
    }

    return (
        <div className="field" onClick={onClick}>
            {
                square.fruit === Fruit.None && (
                    <img src={terrain} className="soil"/>
                )
            }
            {
                square.fruit !== Fruit.None && (
                    <>
                        <img src={planted} className="soil"/>
                        <img src={seedling} className='seedling'/>
                        <img src={progress} className='progress'/>
                    </>
                )
            }
        </div>
    )
}
