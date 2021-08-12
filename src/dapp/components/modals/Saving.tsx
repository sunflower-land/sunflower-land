import React from 'react'
import { Panel } from '../ui/Panel'

import person from '../../images/characters/mining_person.gif'
import tool from '../../images/characters/mining_tool.gif'
import rock from '../../images/characters/mining_rock.png'

import './Saving.css'

export const Saving: React.FC = () => (
    <Panel>
        <div id="saving">
            <h4>Saving...</h4>
            <h6>Miners are working hard to save your farm to the blockchain.</h6>

            <div id='mining-animation'>
                <img id='mining-gif' src={person} />
                <img id='mining-gif' src={tool} />
                <img id='mining-rock' src={rock} />
                
            </div>

            <span>Increase the gas price for faster transactions</span>

        </div>
    </Panel>
)
