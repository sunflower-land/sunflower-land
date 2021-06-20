import React from 'react'

import Modal from 'react-bootstrap/Modal';


import apple from './images/food.png'
import avocado from './images/avocados/avocado.png'
import stopwatch from './images/ui/stopwatch.png'
import basket from './images/ui/basket.png'

import { Fruit } from './types/contract'

import './FruitBoard.css'

import { Panel } from './Panel'

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

    return (
        <>
        <div id="basket" onClick={() => setShowModal(true)}>
            <Panel>
                <span className="market">MARKET</span>
                <img className="basket-fruit" src={apple}/>
            </Panel>
        </div>
        <Modal show={showModal} centered onHide={() => setShowModal(false)}>
            <div className='board'>
                <Panel>
                    <div className="board-content">
                        <div className='item'>
                            <div
                                className={selectedFruit === Fruit.Apple ? 'selected icon' : 'icon'}
                                onClick={() => selectFruit(Fruit.Apple)}
                            >
                                <div className='image'>
                                    <img src={apple} />
                                </div>
                            </div>
                            <div className="fruit-details">
                                <span className='title'>Apple</span>
                                <div className="fruit-breakdown">
                                    <span className='price'>1 C</span>
                                    <div className="fruit-time">
                                        <img src={stopwatch} />
                                        <span>1 hr</span>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className='item'>
                            <div 
                                className={selectedFruit === Fruit.Avocado ? 'selected icon' : 'icon'}
                                onClick={() => selectFruit(Fruit.Avocado)}
                            >
                                <div className='image'>
                                    <img src={avocado} />
                                </div>
                            </div>
                            <div className="fruit-details">
                                <span className='title'>Avocado</span>
                                <div className="fruit-breakdown">
                                    <span className='price'>2 C</span>
                                    <div className="fruit-time">
                                        <img src={stopwatch} />
                                        <span>3 hr</span>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className='item'>
                            <div className="icon">
                                <div className='image'>
                                    <img src={apple} />
                                </div>
                            </div>
                            <div className="fruit-details">
                                <span className='title'>Coconuts</span>
                                <div className="fruit-breakdown">
                                    <span className='price'>3000 C</span>
                                    <div className="fruit-time">
                                        <img src={stopwatch} />
                                        <span>8 hr</span>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className='item'>
                            <div className="icon">
                                <div className='image'>
                                    <img src={apple} />
                                </div>
                            </div>
                            <div className="fruit-details">
                                <span className='title'>Avocado</span>
                                <div className="fruit-breakdown">
                                    <span className='price'>3000 C</span>
                                    <div className="fruit-time">
                                        <img src={stopwatch} />
                                        <span>3 hr</span>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </Panel>
            </div>
        </Modal>
        </>
    )
}
