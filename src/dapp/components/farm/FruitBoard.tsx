import React from 'react'

import Modal from 'react-bootstrap/Modal';


import stopwatch from '../../images/ui/stopwatch.png'
import disc from '../../images/ui/disc.png'
import cancel from '../../images/ui/cancel.png'
import alert from '../../images/ui/expression_alerted.png'

import { Fruit } from '../../types/contract'
import { fruits, getFruit } from '../../types/fruits'

import './FruitBoard.css'

import { Panel } from '../ui/Panel'
import { Message } from '../ui/Message'

interface Props {
    selectedFruit: Fruit
    onSelectFruit: (fruit: Fruit) => void
    balance: number
    land: any[]
}
export const FruitBoard: React.FC<Props> = ({
    balance,
    land,
    onSelectFruit,
    selectedFruit,
}) => {
    const [showModal, setShowModal] = React.useState(false)

    const selectFruit = (fruit: Fruit) => {
        setShowModal(false)
        onSelectFruit(fruit)
    }

    const items = []
    let needsUpgrade = false
    let needsMoreMoney = false
    fruits.forEach(fruit => {
        if (!needsUpgrade && fruit.landRequired > land.length) {
            items.push((
                <div className='upgrade-required'>
                    <Message>
                        Upgrade Required
                        <img src={alert} className="insufficient-funds-alert" />

                    </Message>            
                </div>
            ))
            needsUpgrade = true
        }

        if (!needsUpgrade && !needsMoreMoney && fruit.buyPrice > balance) {
            items.push((
                <div className='upgrade-required'>
                    <Message>
                        Insufficient funds
                        <img src={cancel} className="insufficient-funds-cross" />
                    </Message>            
                </div>
            ))
            needsMoreMoney = true
        }

        const isLocked = needsUpgrade || needsMoreMoney

        items.push((
            <div className={isLocked ? 'locked item' : 'item'}>
                <div
                    className={selectedFruit === fruit.fruit ? 'selected icon' : 'icon'}
                    onClick={!isLocked ? () => selectFruit(fruit.fruit) : undefined}
                >
                    <div className='image'>
                        <img src={fruit.image} />
                    </div>
                </div>
                <div className="fruit-details">
                    <span className='title'>{fruit.name}</span>
                    <div className="fruit-breakdown">
                        <span className='price'>{`${fruit.buyPrice}c`}</span>
                        <div className="fruit-time">
                            <img src={stopwatch} />
                            <span>{`${fruit.harvestHours}mins`}</span>
                        </div>

                    </div>
                </div>
            </div>
        ))
    })
    
    return (
        <>
        <div id="basket" onClick={() => setShowModal(true)}>
            <img className="basket-fruit" src={disc}/>
            <img className="selected-fruit" src={getFruit(selectedFruit).image}/>
            <Message>
                Change
            </Message>
        </div>
        <Modal show={showModal} centered onHide={() => setShowModal(false)}>
            <div className='board'>
                <Panel>
                    <div className="board-content">
                        {items}
                    </div>
                </Panel>
            </div>
        </Modal>
        </>
    )
}
