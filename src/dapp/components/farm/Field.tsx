import React from 'react'

import sunflower from '../../images/sunflower/plant.png'
import sunflowerSeedling from '../../images/sunflower/seedling.png'
import pumpkin from '../../images/pumpkin/plant.png'
import pumpkinSeedling from '../../images/pumpkin/seedling.png'
import beetroot from '../../images/beetroot/plant.png'
import beetrootSeedling from '../../images/beetroot/seedling.png'
import cauliflower from '../../images/cauliflower/plant.png'
import cauliflowerSeedling from '../../images/cauliflower/seedling.png'

import planted from '../../images/land/soil/planted.png'
import terrain from '../../images/land/soil/soil.png'

import progressStart from '../../images/ui/progress/start.png'
import progressQuarter from '../../images/ui/progress/quarter.png'
import progressHalf from '../../images/ui/progress/half.png'
import progressAlmost from '../../images/ui/progress/almost.png'

import selectBoxTL from '../../images/ui/select-box/selectbox_tl.png'
import selectBoxTR from '../../images/ui/select-box/selectbox_tr.png'
import selectBoxBR from '../../images/ui/select-box/selectbox_br.png'
import selectBoxBL from '../../images/ui/select-box/selectbox_bl.png'

import { getFruit } from '../../types/fruits'
import { Fruit, Square } from '../../types/contract'

import './Field.css'


function secondsToString(seconds: number) {
    // Less than 1 hour
    if (seconds < 60 * 60) {
        return `${Math.ceil(seconds / 60)}mins`
    }

    if (seconds < 60 * 60 * 24) {
        return `${Math.ceil(seconds / 60 / 60)}hrs`
    }

    return `${Math.ceil(seconds / 60 / 60 / 24)}days`
}
interface Props {
    square: Square
    onClick: () => void
}

export const Field: React.FC<Props> = ({ square, onClick }) => {
    const [timeLeft, setTimeLeft] = React.useState(null)
    // TODO currently in minutes, set to hours in future
    const fruit = getFruit(square.fruit)
    const totalTime = fruit && (fruit.harvestHours  * 60)

    const setHarvestTime = () => {
        const secondsElapsed = (Date.now()/1000) - square.createdAt;
        if (secondsElapsed > totalTime) {
            setTimeLeft(0)
            return
        }

        const timeLeft = totalTime - secondsElapsed
        setTimeLeft(timeLeft)
    }

    React.useEffect(() => {
        if (square.fruit && square.fruit !== Fruit.None) {
            setHarvestTime()
            const interval = window.setInterval(setHarvestTime, 1000)
            return () => window.clearInterval(interval)
        }
        /* eslint-disable */
    }, [square])
        /* eslint-enable */

    const Seedling = () => {
        // TODO different plant seedlings
        if (square.fruit === Fruit.Apple) {
            return (<img src={sunflowerSeedling} className='seedling'/>)
        }

        if (square.fruit === Fruit.Avocado) {
            return (<img src={pumpkinSeedling} className='seedling'/>)
        }

        if (square.fruit === Fruit.Banana) {
            return (<img src={beetrootSeedling} className='seedling'/>)
        }

        return (<img src={cauliflowerSeedling} className='seedling'/>)


    }

    const Plant = () => {
        // TODO different plant seedlings
        if (square.fruit === Fruit.Apple) {
            return (<img src={sunflower} className='sunflower'/>)
        }

        if (square.fruit === Fruit.Avocado) {
            return (<img src={pumpkin} className='pumpkin'/>)
        }

        if (square.fruit === Fruit.Banana) {
            return (<img src={beetroot} className='beetroot'/>)
        }

        return (<img src={cauliflower} className='cauliflower'/>)
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

        return null
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
                        <img src={planted} className="planted-soil"/>
                        {
                            timeLeft > 0 ? (
                                Seedling()
                            ) : (
                                Plant()
                            )
                        }
                        {Progress()}
                        {
                            timeLeft > 0 && (
                                <span className='progress-text'>{secondsToString(timeLeft)}</span>
                            )
                        }
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
