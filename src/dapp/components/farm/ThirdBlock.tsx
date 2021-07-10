import React from 'react'

import { Fruit, Square } from '../../types/contract'
import { service } from '../../machine'

import { Pickaxe }  from '../ui/Pickaxe'
import { UpgradeModal } from '../ui/UpgradeModal'

import { Field }  from './Field'

interface Props {
    land: Square[]
    balance: number
    onHarvest: (landIndex: number) => void
    onPlant: (landIndex: number) => void
}

export const ThirdBlock: React.FC<Props> = ({ land, balance, onHarvest, onPlant }) => {
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

    const isUnlocked = land.length > 8

    return (
        <>
            {
                !isUnlocked && (
                    <>
                        <div className='rock' style={{ gridArea: '4 / 7 / 5 / 8'}} />

                        <div className='rock' style={{ gridArea: '4 / 8 / 5 / 9', zIndex: 2}}>
                            {
                                land.length === 8 && (
                                    <Pickaxe onClick={onClear} />
                                )
                            }
                        </div>
                        <div className='rock' style={{ gridArea: '4 / 9 / 5 / 10'}}>
                        </div>
                    </>
                )
            }

            <div className='dirt' style={{ gridArea: '4 / 7 / 5 / 8'}}>
                {
                    isUnlocked && (<Field square={land[6]} onClick={land[6].fruit === Fruit.None ? () => onPlant(6) : () => onHarvest(6)}/> )
                }
            </div>
            <div className='dirt' style={{ gridArea: '4 / 8 / 5 / 9' }}>
                {
                    isUnlocked && (<Field square={land[5]} onClick={land[5].fruit === Fruit.None ? () => onPlant(5) : () => onHarvest(5)}/> )
                }
            </div>

            <div className='dirt' style={{ gridArea: '4 / 9 / 5 / 10'}}>
                {
                    isUnlocked && (<Field square={land[7]} onClick={land[7].fruit === Fruit.None ? () => onPlant(7) : () => onHarvest(7)}/> )
                }
            </div>

            <div className='left-edge' style={{ gridArea: '4 / 6 / 5 / 7' }} />
            <div className='right-edge' style={{ gridArea: '4 / 10 / 5 / 11' }} />

            <div className='top-edge' style={{ gridArea: '3 / 7 / 4 / 8' }} />
            <div className='top-edge' style={{ gridArea: '3 / 8 / 4 / 9' }} />
            <div className='top-edge' style={{ gridArea: '3 / 9 / 4 / 9' }} />

            <div className='bottom-edge' style={{ gridArea: '5 / 7 / 6 / 8' }} />
            <div className='bottom-edge' style={{ gridArea: '5 / 8 / 6 / 9' }} />
            <div className='bottom-edge' style={{ gridArea: '5 / 9 / 6 / 10' }} />

            <UpgradeModal
                isOpen={showModal}
                onClose={onClose}
                hasFunds={balance > 30}
                onConfirm={onClearConfirm}
                cost={30}
            />
        </>
    )
}
