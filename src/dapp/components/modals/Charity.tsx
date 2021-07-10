import React from 'react'

import { Charity as Charities } from '../../types/contract'

import { Button } from '../ui/Button'
import { Message } from '../ui/Message'
import { Panel } from '../ui/Panel'

import './Charity.css'

interface Props {
    onSelect: (charity: Charities) => void
}

export const Charity: React.FC<Props> = ({ onSelect }) => {
    return (
        <Panel>
            <div id="charity-container">
                <span>
                    To start a farm, donate $0.01 MATIC to a charity of your choice
                </span>
                <div id="charities">
                    <div>
                        <Message>
                            <div className="charity">
                                The Water project
                            </div>
                        </Message>
                        <Button  onClick={() => onSelect(Charities.TheWaterProject)} >
                            Donate
                        </Button>
                    </div>
                    <div>
                        <Message>
                            <div className="charity">
                                Heifer
                            </div>
                        </Message>
                        <Button  onClick={() => onSelect(Charities.Heifer)} >
                            Donate
                        </Button>
                    </div>
                    <div>
                        <Message>
                            <div className="charity">
                                Cool Earth
                            </div>
                        </Message>
                        <Button  onClick={() => onSelect(Charities.CoolEarth)} >
                            Donate
                        </Button>
                    </div>
                </div>
            </div>
        </Panel>

    )
}
