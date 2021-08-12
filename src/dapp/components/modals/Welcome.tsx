import React from 'react'

import questionMark from '../../images/ui/expression_confused.png'
import sunflower from '../../images/sunflower/fruit.png'

import { Panel } from '../ui/Panel'
import { Button } from '../ui/Button'

interface Props {
    onGetStarted: () => void
}
export const Welcome: React.FC<Props> = ({ onGetStarted }) => (
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
            <h3 className='current-price-header'>Current Price</h3>
            <div className="current-price-container ">
                <img className='sunflower-price' src={sunflower} />
                <span className='current-price'>= $0.01</span>
            </div>
            <a href='https://adamhannigan81.gitbook.io/sunflower-coin/#supply-and-demand'><h3 className='current-price-supply-demand'>Read more about the supply & demand</h3></a>

        </div>
    </div>
    </Panel>
)
