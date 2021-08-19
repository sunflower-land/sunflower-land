import React from 'react'

import questionMark from '../../images/ui/expression_confused.png'
import alert from '../../images/ui/expression_alerted.png'
import sunflower from '../../images/sunflower/fruit.png'

import { secondsToLongString } from '../../utils/time'

import { Panel } from '../ui/Panel'
import { Button } from '../ui/Button'

interface Props {
    onGetStarted: () => void
}

// TODO: Hardcoded from reports, read from live API
const predictedDate = new Date(2021, 10, 19, 8, 44, 55)

const makeTimeLeft = () => {
    const difference = predictedDate.getTime() - Date.now()

    const display = secondsToLongString(difference / 1000)
    return display
}

export const Welcome: React.FC<Props> = ({ onGetStarted }) => {
    const [timeLeft, setTimeLeft] = React.useState(makeTimeLeft())

    React.useEffect(() => {

        const interval = window.setInterval(() => {
            setTimeLeft(makeTimeLeft())
        }, 1000)

        return () => window.clearInterval(interval)
    }, [])

    return (
        <Panel>
            <div id="welcome">
                <h1 className="header">
                    Sunflower Coin
                </h1>
                <Button onClick={onGetStarted}>
                <span>
                    Get Started
                </span>
                </Button>
                <Button onClick={() => window.open('https://adamhannigan81.gitbook.io/sunflower-coin/')}>
                    About
                    <img src={questionMark} id="question"/>
                </Button>

                <div>
                    <h3 className='current-price-header'>
                        <img src={alert} id="prediction-alert"/>
                        Next predicted price change
                    </h3>
                    <h4 className='current-price-prediction'>{timeLeft}</h4>
                    <div className="current-price-container ">
                        <img className='sunflower-price' src={sunflower} />
                        <span className='current-price'>= $0.01</span>
                    </div>
                    <a href='https://adamhannigan81.gitbook.io/sunflower-coin/#supply-and-demand'><h3 className='current-price-supply-demand'>Read more about the supply & demand</h3></a>

                </div>
            </div>
        </Panel>
    )
}
