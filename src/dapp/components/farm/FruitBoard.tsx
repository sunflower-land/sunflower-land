import React from 'react'
import Big from 'big.js'

import Modal from 'react-bootstrap/Modal'

import stopwatch from '../../images/ui/stopwatch.png'
import disc from '../../images/ui/disc.png'
import cancel from '../../images/ui/cancel.png'
import alert from '../../images/ui/expression_alerted.png'
import coin from '../../images/ui/sunflower_coin.png'
import arrow from '../../images/ui/arrow_right.png'

import { Fruit } from '../../types/contract'
import { fruits, getFruit } from '../../types/fruits'

import { secondsToString } from '../../utils/time'

import './FruitBoard.css'

import { Panel } from '../ui/Panel'
import { Message } from '../ui/Message'
import { service } from '../../machine'
import { getMarketRate } from '../../utils/supply'

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
	const [totalSupply, setTotalSupply] = React.useState<number>(1)

	React.useEffect(() => {
		const load = async () => {
			const supply = await service.machine.context.blockChain.totalSupply()
			setTotalSupply(supply)
		}

		load()
	}, [])

	const selectFruit = (fruit: Fruit) => {
		setShowModal(false)
		onSelectFruit(fruit)
	}

	const marketRate = getMarketRate(10000000)

	const items = []
	let needsUpgrade = false
	let needsMoreMoney = false
	fruits.forEach((fruit) => {
		const buyPrice = Big(fruit.buyPrice).div(marketRate).toNumber()
		const sellPrice = Big(fruit.sellPrice).div(marketRate).toNumber()

		if (!needsUpgrade && fruit.landRequired > land.length) {
			items.push(
				<div className="upgrade-required">
					<Message>
						Upgrade Required
						<img src={alert} className="insufficient-funds-alert" />
					</Message>
				</div>
			)
			needsUpgrade = true
		}

		if (!needsUpgrade && !needsMoreMoney && buyPrice > balance) {
			items.push(
				<div className="upgrade-required">
					<Message>
						Insufficient funds
						<img
							src={cancel}
							className="insufficient-funds-cross"
						/>
					</Message>
				</div>
			)
			needsMoreMoney = true
		}

		const isLocked = needsUpgrade || needsMoreMoney

		items.push(
			<div key={fruit.name} className={isLocked ? 'locked item' : 'item'}>
				<div
					className={
						selectedFruit === fruit.fruit ? 'selected icon' : 'icon'
					}
					onClick={
						!isLocked ? () => selectFruit(fruit.fruit) : undefined
					}
				>
					<div className="image">
						<img src={fruit.image} />
					</div>
				</div>
				<div className="fruit-details">
					<div>
						<span className="title">{fruit.name}</span>

						<div className="fruit-time">
							<img src={stopwatch} />
							<span>
								{secondsToString(fruit.harvestMinutes * 60)}
							</span>
						</div>
					</div>
					<div className="fruit-breakdown">
						<div className="price">
							<span className="price-label">Buy</span>
							<img src={coin} />
							<span>{buyPrice}</span>
						</div>
						<div className="fruit-arrows">
							<img src={arrow} />
							<img src={arrow} />
							<img src={arrow} />
						</div>
						<div className="price">
							<span className="price-label">Sell</span>
							<img src={coin} />
							<span>{sellPrice}</span>
						</div>
					</div>
				</div>
			</div>
		)
	})

	return (
		<>
			<div id="basket" onClick={() => setShowModal(true)}>
				<img className="basket-fruit" src={disc} />
				<img
					className="selected-fruit"
					src={getFruit(selectedFruit).image}
				/>
				<Message>Change</Message>
			</div>
			<Modal show={showModal} centered onHide={() => setShowModal(false)}>
				<div className="board">
					<Panel>
						<div className="board-content">{items}</div>
					</Panel>
				</div>
			</Modal>
		</>
	)
}
