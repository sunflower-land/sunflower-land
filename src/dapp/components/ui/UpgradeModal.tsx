import React from 'react'
import { useService } from '@xstate/react';

import Modal from 'react-bootstrap/Modal';

import { service, Context, BlockchainEvent, BlockchainState } from '../../machine'


import cancel from '../../images/ui/cancel.png'

import { Panel } from './Panel'
import { Message } from './Message'
import { Button } from './Button'


interface Props {
    isOpen: boolean
    onClose: () => void
    farmSize: number
    balance: number
}

function getPrice(landSize: number) {
    if (landSize < 8) {
        return 1
    }

    if (landSize < 11) {
        return 30
    }

    if (landSize < 14) {
        return 100
    }

    return 1000
}

export const UpgradeModal: React.FC<Props> = ({ isOpen, onClose, farmSize, balance }) => {
    // TODO: Read from blockchain
    const [machineState, send] = useService<
        Context,
        BlockchainEvent,
        BlockchainState
    >(service);

    const onConfirm = () => {
        send('UPGRADE')
    }

    const price = getPrice(farmSize)
    const hasFunds = balance >= price

    const Content = () => {
        if(!hasFunds) {
            return (
                <div className='upgrade-required'>
                    <Message>
                        Insufficient funds
                        <img src={cancel} className="insufficient-funds-cross" />
                    </Message>            
                </div>
            )
        }

        if (machineState.context.blockChain.isUnsaved()) {
            return (
                <>
                    <div className='upgrade-required'>
                        <Message>
                            Unsaved game
                            <img src={cancel} className="insufficient-funds-cross" />
                        </Message>
                    </div>
                    <span className='upgrade-warning'>You must first save your farm to the blockchain before attempting to upgrade. </span>         
                </>
            )
        }

        return (
            <div id="clear-buttons">
                <Button onClick={onClose}>
                    No
                </Button>
                <Button onClick={onConfirm}>
                    Yes
                </Button>
            </div>
        )
    }
    return (
        <Modal centered show={isOpen} onHide={onClose}>
            <Panel>
                <div id="welcome">
                    <h1 className="header">
                        Do you want to upgrade your farm?
                    </h1>

                    <span id="clear-price">
                        {`$${price}`}
                    </span>

                    <Content />
                </div>
            </Panel>
        </Modal>
    )
}


export const UpgradeOverlay = (props) => (
    <div id='tester' {...props}>
        <Panel>
            <span className='upgrade-overlay-message'>
                Upgrade required
            </span>
        </Panel>
    </div>
)
