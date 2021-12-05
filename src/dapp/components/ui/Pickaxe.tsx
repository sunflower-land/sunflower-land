import React from 'react'

import './Pickaxe.css'
import { Panel } from './Panel'
import disc from '../../images/ui/disc.png'
import hammer from '../../images/ui/hammer.png'

interface Props {
    onClick: () => void
}
export const Pickaxe: React.FC<Props> = ({ className, onClick }) => {
    return (
        <div className={`dig ${className || ''}`} onClick={onClick}>
            <div className="disc">
                <img src={disc} className="discBackground"/>
                <img src={hammer}  className="pickaxe"/>

            </div>
            <Panel hasOuter={false}>
                <span id='upgrade'>
                    Upgrade
                </span>
            </Panel>

        </div>
    )
}
