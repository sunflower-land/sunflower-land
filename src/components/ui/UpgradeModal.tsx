import React from 'react'
import '../App.css'
import '../Land.css'
import Modal from 'react-bootstrap/Modal';
import { Panel } from '../Panel'
import { Message } from '../Message'
import { Button } from '../Button'

import cancel from '../images/ui/cancel.png'

interface Props {
    isOpen: boolean
    onConfirm: () => void
    onClose: () => void
    hasFunds: boolean
    cost: number
}

export const UpgradeModal: React.FC<Props> = ({ isOpen, onConfirm, onClose, cost, hasFunds }) => {
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

                    {
                        hasFunds ? (
                            <div id="clear-buttons">
                                <Button onClick={onClose}>
                                    No
                                </Button>
                                <Button onClick={onConfirm}>
                                    Yes
                                </Button>
                            </div>
                        ): (
                            <div className='upgrade-required'>
                                <Message>
                                    Insufficient funds
                                    <img src={cancel} className="insufficient-funds-cross" />
                                </Message>            
                            </div>
                        )
                    }
                </div>
            </Panel>
        </Modal>
    )
}
