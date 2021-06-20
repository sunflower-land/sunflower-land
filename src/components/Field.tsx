import React from 'react'
import young from './images/apples/image_part_161.png'
import avocado from './images/avocados/tree.png'
import banana from './images/bananas/tree.png'
import coconut from './images/coconuts/tree.png'
import terrain from './images/land/soil/soil.png'
import planted from './images/land/soil/planted.png'
import seedling from './images/land/soil/seedling.png'
import tree from './images/tree.png'

import progressStart from './images/ui/progress/start.png'
import progressQuarter from './images/ui/progress/quarter.png'
import progressHalf from './images/ui/progress/half.png'
import progressAlmost from './images/ui/progress/almost.png'
import harvest from './images/ui/harvest.png'

import selectBoxTL from './images/ui/select-box/selectbox_tl.png'
import selectBoxTR from './images/ui/select-box/selectbox_tr.png'
import selectBoxBR from './images/ui/select-box/selectbox_br.png'
import selectBoxBL from './images/ui/select-box/selectbox_bl.png'


import './Field.css'
import { Fruit, Square } from './types/contract'
interface Props {
    square: Square
    onClick: () => void
}

const HARVEST_TIMES: Record<Fruit, number> = {
    [Fruit.Apple]: 5,
    [Fruit.Avocado]: 3,
    [Fruit.Banana]: 8,
    [Fruit.Coconut]: 24,
    [Fruit.None]: 0,
}

export const Field: React.FC<Props> = ({ square, onClick }) => {
    const [timeLeft, setTimeLeft] = React.useState(null)
    const totalTime = HARVEST_TIMES[square.fruit]

    const setHarvestTime = () => {
        const secondsElapsed = (Date.now()/1000) - square.createdAt;
        if (secondsElapsed > totalTime) {
            setTimeLeft(0)
            return
            // TODO - clear interval
        }

        const timeLeft = totalTime - secondsElapsed
        setTimeLeft(timeLeft)
    }

    React.useEffect(() => {
        if (square.fruit && square.fruit !== Fruit.None) {
            setTimeLeft(totalTime)
            const interval = window.setInterval(setHarvestTime, 1000)
            return () => window.clearInterval(interval)
        }
        /* eslint-disable */
    }, [square])
        /* eslint-enable */

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

    const Progress = () => {
        if (timeLeft > (totalTime * (3/4))) {
            return <img src={progressStart} className='progress'/>
        }

        if (timeLeft > (totalTime * (1/2))) {
            return <img src={progressQuarter} className='progress'/>
            
        }

        if (timeLeft > (totalTime * (1/4))) {
            return <img src={progressHalf} className='progress'/>
        }

        if (timeLeft > 0) {
            return <img src={progressAlmost} className='progress'/>
        }

        return <img src={harvest} className='harvest'/>
    }

    return (
        <div className="field" onClick={!timeLeft ? onClick : undefined}>
            {
                square.fruit === Fruit.None && (
                    <img src={terrain} className="soil"/>
                )
            }
            {
                timeLeft !== null && square.fruit !== Fruit.None && (
                    <>
                        <img src={planted} className="soil"/>
                        {
                            timeLeft > 0 ? (
                                <img src={seedling} className='seedling'/>
                            ) : (
                                <img src={tree} className='tree'/>
                            )
                        }
                        {Progress()}
                    </>
                )
            }
            <div className='field-edges'>
                <div>
                    <img src={selectBoxTL}/>
                    <img src={selectBoxTR}/>
                </div>
                <div>
                    <img src={selectBoxBL}/>
                    <img src={selectBoxBR}/>
                </div>
            </div>
        </div>
    )
}
