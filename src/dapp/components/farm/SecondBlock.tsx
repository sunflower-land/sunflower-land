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

    const isUnlocked = land.length > 5

    return (
        <>
            {
                !isUnlocked && (
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

            <div className='dirt' style={{ gridColumn: '12/13', gridRow: '8/9'}}>
                {
                    isUnlocked && (<Field square={land[5]} onClick={land[5].fruit === Fruit.None ? () => onPlant(5) : () => onHarvest(5)}/> )
                }
            </div>
            <div className='dirt' style={{ gridColumn: '13/14', gridRow: '8/9'}}>
                {
                    isUnlocked && (<Field square={land[6]} onClick={land[6].fruit === Fruit.None ? () => onPlant(6) : () => onHarvest(6)}/> )
                }
            </div>
            <div className='dirt' style={{ gridColumn: '13/14', gridRow: '9/10'}}>
                {
                    isUnlocked && (<Field square={land[7]} onClick={land[7].fruit === Fruit.None ? () => onPlant(7) : () => onHarvest(7)}/> )
                }
            </div>

            <div className='left-edge' style={{ gridArea: '8 / 11 / 9 / 12' }} />
            <div className='left-edge' style={{ gridArea: '9 / 12 / 10 / 13' }} />
            <div className='right-edge' style={{ gridArea: '8 / 14 / 9 / 15' }} />
            <div className='right-edge' style={{ gridArea: '9 / 14 / 10 / 15' }} />

            <div className='bottom-edge' style={{ gridArea: '9 / 12 / 10 / 13' }} />
            <div className='bottom-edge' style={{ gridArea: '10 / 13 / 11 / 14' }} />
            <div className='top-edge' style={{ gridArea: '7 / 12 / 8 / 13' }} />
            <div className='top-edge' style={{ gridArea: '7 / 13 / 8 / 14' }} />


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
