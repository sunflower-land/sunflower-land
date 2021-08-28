import React from 'react'
import { Panel } from '../ui/Panel'
import { Button } from '../ui/Button'

import alert from '../../images/ui/expression_alerted.png'

import { service } from '../../machine'

import './TimerComplete.css'

export const TimerComplete: React.FC = () => {
    const save = () => {
        service.send('SAVE')
    }

    return (
        <Panel>
            <div id="timer-complete">

                <img src={alert} />

                <h4>Times up...</h4>
                
                <p>A farm must be saved within 30 minutes otherwise it cannot pass the smart contract validation.</p>

                <span>Please save now.</span>

                <Button onClick={save}>
                    Save
                </Button>

            </div>
        </Panel>
    )
    
}
