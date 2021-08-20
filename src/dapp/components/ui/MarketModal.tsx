import React from 'react'
import Modal from 'react-bootstrap/Modal';

import { service } from '../../machine'

import alert from '../../images/ui/expression_alerted.png'
import sunflower from '../../images/sunflower/fruit.png'

import { Panel } from './Panel'
import { getExchangeRate } from '../../utils/supply'

import './MarketModal.css'

interface Props {
    isOpen: boolean
    onClose: () => void
}

export const MarketModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const [totalSupply, setTotalSupply] = React.useState<number>(1)

    React.useEffect(() => {
        const load = async () => {
            const supply = await service.machine.context.blockChain.totalSupply()
            setTotalSupply(supply)
        }

        load()
    }, [isOpen])

    const currentRate = getExchangeRate(totalSupply)
    const nextRate = currentRate / 10

    return (
        <Modal centered show={isOpen} onHide={onClose}>
            <Panel>
                <div id="welcome">
                    <h1 className="price-header">
                        Price is increasing
                        <img src={alert} className='price-alert'/>
                    </h1>

                    <div>
                        <h3 className='current-price-header'>Current Price</h3>
                        <div className="current-price-container ">
                            <img className='sunflower-price' src={sunflower} />
                            <span className='current-price'>= ${currentRate / 100}</span>
                        </div>
                    </div>

                    <div>
                        <h3 className='current-price-header'>Upcoming Price</h3>
                        <h3 className='current-price-subheader'>(When total supply increases)</h3>
                        <div className="current-price-container ">
                            <img className='sunflower-price' src={sunflower} />
                            <span className='current-price'>= ${nextRate / 10}</span>
                        </div>
                    </div>

                    <div>
                        <h3 className='current-price-header'>Total Supply</h3>
                        <div className="current-price-container ">
                            <span className='current-price'>{totalSupply}</span>
                        </div>
                    </div>

                    <a href='https://adamhannigan81.gitbook.io/sunflower-coin/#supply-and-demand'><h3 className='current-price-supply-demand'>Read more about the supply & demand</h3></a>


                    <div>

                    </div>
                </div>
            </Panel>
        </Modal>
    )
}
