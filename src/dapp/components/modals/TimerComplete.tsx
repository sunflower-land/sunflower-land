import React from 'react'
import { Panel } from '../ui/Panel'

import alert from '../../images/ui/expression_alerted.png'

import './TimerComplete.css'

export const TimerComplete: React.FC = () => (
    <Panel>
        <div id="timer-complete">

            <img src={alert} />

            <h4>Times up...</h4>
            
            <p>A farm must be saved within 30 minutes otherwise it cannot pass the smart contract validation.</p>

            <span>Please refresh the page to restart the timer.</span>

        </div>
    </Panel>
)
