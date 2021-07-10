import React from 'react'

import questionMark from '../../images/ui/expression_confused.png'

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
    </div>
    </Panel>
)
