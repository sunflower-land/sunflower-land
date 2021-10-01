import React, { useEffect } from 'react'

import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import { useService } from '@xstate/react';
import { service, Context, BlockchainEvent, BlockchainState } from '../../machine'

import { Charity as Charities, Donation } from '../../types/contract'

import questionMark from '../../images/ui/expression_confused.png'

import { Button } from '../ui/Button'
import { Message } from '../ui/Message'
import { Panel } from '../ui/Panel'

import './Charity.css'
import { spawn } from 'xstate'

interface Props {
    onSelect: (donation: Donation) => void
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

    const [donation, setDonation] = React.useState<string>('0.1')

    React.useEffect(() => {
        if (machineState.context.blockChain.isConnected) {
            const load = async () => {
                const balances = await machineState.context.blockChain.getCharityBalances()
                setBalances(balances)
            }
            load()
        }
    }, [machineState.context.blockChain, machineState.context.blockChain.isConnected])

    const handleDonationChange = (event) => { 
        setDonation(event.currentTarget.value.toString())
    }
    
    return (
        <Panel>
            <div id="charity-container">
                <span>
                    Donate to play.
                </span>
                <span id="donate-description">
                    To start a farm, please donate a minimum of $0.1 MATIC to a charity of your choice.
                </span>
                <input type="number" step="0.1" className="donation" min={0.1} value={donation} onChange={handleDonationChange}></input>
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
                            <Button  onClick={() => onSelect({charity: Charities.TheWaterProject, value: donation})} >
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
                            <Button  onClick={() => onSelect({charity: Charities.Heifer, value: donation})} >
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
                            <Button  onClick={() => onSelect({charity: Charities.CoolEarth, value: donation})} >
                                Donate & Play
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Panel>

    )
}
