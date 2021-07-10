import React from 'react'
import Modal from 'react-bootstrap/Modal';

import { Fruit, Square } from '../../types/contract'
import { service } from '../../machine'

import { Pickaxe }  from '../ui/Pickaxe'
import { Panel } from '../ui/Panel'
import { Button } from '../ui/Button'

import { Field }  from './Field'


interface Props {
    land: Square[]
    balance: number
    onHarvest: (landIndex: number) => void
    onPlant: (landIndex: number) => void
}

export const FourthBlock: React.FC<Props> = ({ land, balance, onHarvest, onPlant }) => {
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

    const isUnlocked = land.length > 11

    return (
        <>
            {
                !isUnlocked && (
                    <>
                        <div className='rock' style={{ gridArea: '3 / 13 / 4 / 14'}} />

                        <div className='rock' style={{ gridArea: '4 / 13 / 5 / 14', zIndex: 2}}>
                            {
                                land.length === 11 && (
                                    <Pickaxe onClick={onClear} />
                                )
                            }
                        </div>
                        <div className='rock' style={{ gridArea: '5 / 13 / 6 / 14' }}>
                        </div>
                    </>
                )
            }

            <div className='dirt' style={{ gridArea: '3 / 13 / 4 / 14'}}>
                {
                    isUnlocked && (<Field square={land[6]} onClick={land[6].fruit === Fruit.None ? () => onPlant(6) : () => onHarvest(6)}/> )
                }
            </div>
            <div className='dirt' style={{ gridArea: '4 / 13 / 5 / 14' }}>
                {
                    isUnlocked && (<Field square={land[5]} onClick={land[5].fruit === Fruit.None ? () => onPlant(5) : () => onHarvest(5)}/> )
                }
            </div>

            <div className='dirt' style={{ gridArea: '5 / 13 / 6 / 14'}}>
                {
                    isUnlocked && (<Field square={land[7]} onClick={land[7].fruit === Fruit.None ? () => onPlant(7) : () => onHarvest(7)}/> )
                }
            </div>

            <div className='left-edge' style={{ gridArea: '3 / 12 / 4 / 13' }} />
            <div className='left-edge' style={{ gridArea: '4 / 12 / 5 / 13' }} />
            <div className='left-edge' style={{ gridArea: '5 / 12 / 6 / 13' }} />
            <div className='right-edge' style={{ gridArea: '3 / 14 / 4 / 15' }} />
            <div className='right-edge' style={{ gridArea: '4 / 14 / 5 / 15' }} />
            <div className='right-edge' style={{ gridArea: '5 / 14 / 6 / 15' }} />

            <div className='top-edge' style={{ gridArea: '2 / 13 / 3 / 14' }} />

            <div className='bottom-edge' style={{ gridArea: '6 / 13 / 7 / 14' }} />



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
