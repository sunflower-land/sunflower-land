import React from 'react'

import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import { useService } from '@xstate/react';
import { service, Context, BlockchainEvent, BlockchainState } from '../../machine'

import { Charity as Charities } from '../../types/contract'

import questionMark from '../../images/ui/expression_confused.png'

import { Button } from '../ui/Button'
import { Message } from '../ui/Message'
import { Panel } from '../ui/Panel'

import './Charity.css'
import { spawn } from 'xstate'

interface Props {
    onSelect: (charity: Charities) => void
}

export const Charity: React.FC<Props> = ({ onSelect }) => {
    const [machineState] = useService<
        Context,
        BlockchainEvent,
        BlockchainState
    >(service);

    const [balances, setBalances] = React.useState({
        coolEarthBalance: '',
        waterBalance: '',
        heiferBalance: '',
    })

    React.useEffect(() => {
        if (machineState.context.blockChain.isConnected) {
            const load = async () => {
                const balances = await machineState.context.blockChain.getCharityBalances()
                setBalances(balances)
            }
            load()
        }
    }, [machineState.context.blockChain, machineState.context.blockChain.isConnected])

    return (
        <Panel>
            <div id="charity-container">
                <span>
                    Donate to play.
                </span>
                <span id="donate-description">
                    To start a farm, please donate $0.1 MATIC to a charity of your choice.
                </span>
                <div id="charities">
                    <div>
                        <div className="charity">
                            The Water project
                        </div>
                        <span className='charity-description'>
                            You can provide clean, safe and reliable water today.
                        </span>
                        <OverlayTrigger
                            key='water'
                            overlay={(props) => (
                                <Tooltip id='tooltip-water' {...props}>
                                    {Charities.TheWaterProject}
                                </Tooltip>
                            )}
                            >
                            <span className='total-donated'>
                                {balances.waterBalance && `$${balances.waterBalance} donated`}
                            </span>
                        </OverlayTrigger>

                        <div className='charity-buttons'>
                            <Button onClick={() => window.open('https://thewaterproject.org/donate-ethereum')}>
                                About
                                <img src={questionMark} id="question"/>
                            </Button>
                            <Button  onClick={() => onSelect(Charities.TheWaterProject)} >
                                Donate & Play
                            </Button>
                        </div>
                    </div>
                    <div>
                        <div className="charity">
                            Heifer
                        </div>
                        <span className='charity-description'>
                            We do more than train farmers. We grow incomes.
                        </span>
                        <OverlayTrigger
                            key='water'
                            overlay={(props) => (
                                <Tooltip id='tooltip-water' {...props}>
                                    {Charities.Heifer}
                                </Tooltip>
                            )}
                            >
                            <span className='total-donated'>
                                {balances.heiferBalance && `$${balances.heiferBalance} donated`}
                            </span>
                        </OverlayTrigger>
                        <div className='charity-buttons'>
                            <Button onClick={() => window.open('https://www.heifer.org/give/other/digital-currency.html')}>
                                About
                                <img src={questionMark} id="question"/>
                            </Button>
                            <Button  onClick={() => onSelect(Charities.Heifer)} >
                                Donate & Play
                            </Button>
                        </div>
                    </div>
                    <div>
                        <div className="charity">
                            Cool Earth
                        </div>
                        <span className='charity-description'>
                            Aim to halt deforestation and its impact on climate change.
                        </span>
                        <OverlayTrigger
                            key='water'
                            overlay={(props) => (
                                <Tooltip id='tooltip-water' {...props}>
                                    {Charities.CoolEarth}
                                </Tooltip>
                            )}
                            >
                            <span className='total-donated'>
                                {balances.coolEarthBalance && `$${balances.coolEarthBalance} donated`}
                            </span>
                        </OverlayTrigger>
                        <div className='charity-buttons'>
                            <Button onClick={() => window.open('https://www.coolearth.org/cryptocurrency-donations/')}>
                                About
                                <img src={questionMark} id="question"/>
                            </Button>
                            <Button  onClick={() => onSelect(Charities.CoolEarth)} >
                                Donate & Play
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Panel>

    )
}
