import React from 'react'
import { Charity as Charities } from './types/contract'

import { Button } from './Button'
import { Message } from './Message'

import './Charity.css'

interface Props {
    onSelect: (charity: Charities) => void
}

export const Charity: React.FC<Props> = ({ onSelect }) => {
    return (
        <div id="charity-container">
            Pick a charity
            <div id="charities">
                <Button onClick={() => onSelect(Charities.TheWaterProject)} >
                    <div className="charity">
                        The Water project
                        <Message>
                            Choose
                        </Message>
                    </div>
                </Button>
                <Button onClick={() => onSelect(Charities.Heifer)} >
                    <div className="charity">
                        Heifer
                    </div>
                </Button>
                <Button onClick={() => onSelect(Charities.CoolEarth)} >
                    <div className="charity">
                        Cool Earth
                    </div>
                </Button>
            </div>
        </div>
    )
}
