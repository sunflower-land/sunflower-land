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
    onConfirm: () => void
    onClose: () => void
    hasFunds: boolean
    cost: number
}

export const UpgradeModal: React.FC<Props> = ({ isOpen, onConfirm, onClose, cost, hasFunds }) => {
    // TODO: Read from blockchain
    const [machineState] = useService<
        Context,
        BlockchainEvent,
        BlockchainState
    >(service);
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
                        Do you want to clear the land?
                    </h1>

                    <span id="clear-price">
                        {`$${cost}`}
                    </span>

                    <Content />
                </div>
            </Panel>
        </Modal>
    )
}
