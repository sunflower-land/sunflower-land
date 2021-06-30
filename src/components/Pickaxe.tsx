import React from 'react'

import './Pickaxe.css'
import { Panel } from './Panel'
import disc from './images/ui/disc.png'
import pickaxe from './images/ui/pickaxe.png'

export const Pickaxe: React.FC = () => {
    return (
        <div className="dig">
            <div className="disc">
                <img src={disc} className="discBackground"/>
                <img src={pickaxe}  className="pickaxe"/>

            </div>
            <Panel hasOuter={false}>
                Clear land
            </Panel>

        </div>
    )
}
