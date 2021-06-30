import React from 'react'
import './App.css'
import './Land.css'
import { Field }  from './Field'
import Modal from 'react-bootstrap/Modal';
import { Pickaxe }  from './Pickaxe'
import { Fruit, Square } from './types/contract'
import { Panel } from './Panel'
import { Button } from './Button'
import { service } from './machine'

interface Props {
    land: Square[]
    balance: number
    onHarvest: (landIndex: number) => void
    onPlant: (landIndex: number) => void
}

export const SecondLand: React.FC<Props> = ({ land, balance, onHarvest, onPlant }) => {
    const [showModal, setShowModal] = React.useState(false)

    const onClear = () => {
        setShowModal(true)
    }

    const onClearConfirm = () => {
        service.send('UPGRADE')
        setShowModal(false)
    }

    const onClose = () => {
        setShowModal(false)
    }

    return (
        <>
            {
                land.length === 5 && (
                    <>

                        <div className='rock' style={{ gridColumn: '13/14', gridRow: '8/9', zIndex: 2}}>
                            <Pickaxe onClick={onClear} />
                        </div>
                        <div className='rock' style={{ gridColumn: '13/14', gridRow: '9/10'}} />
                        <div className='rock' style={{ gridColumn: '12/13', gridRow: '8/9'}}>
                        </div>
                    </>
                )
            }


            <Modal centered show={showModal} onHide={onClose}>
                <Panel>
                    <div id="welcome">
                        <h1 className="header">
                            Do you want to clear the land?
                        </h1>

                        <span id="clear-price">
                            $1
                        </span>

                        {
                            balance > 1 ? (
                                <div id="clear-buttons">
                                    <Button onClick={onClose}>
                                        No
                                    </Button>
                                    <Button onClick={onClearConfirm}>
                                        Yes
                                    </Button>
                                </div>
                            ): (
                                <span>Insufficient funds</span>
                            )
                        }
                        
                        
                    </div>
                </Panel>
            </Modal>

        </>
    )
}
