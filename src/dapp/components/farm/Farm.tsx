import React from 'react'
import { useService } from '@xstate/react'
import Decimal from 'decimal.js-light'

import { Land } from './Land'

import { FruitItem, FRUITS, getMarketFruits } from '../../types/fruits'
import { Fruit, Square, Action, Transaction } from '../../types/contract'

import {
	service,
	Context,
	BlockchainEvent,
	BlockchainState,
} from '../../machine'

import coin from '../../images/ui/sunflower_coin.png'
import questionMark from '../../images/ui/expression_confused.png'

import { Panel } from '../ui/Panel'
import { Timer } from '../ui/Timer'
import { Button } from '../ui/Button'

import { FruitBoard } from './FruitBoard'
import { Tour } from './Tour'
import { getExchangeRate, getMarketRate } from '../../utils/supply'

export const Farm: React.FC = () => {
	const [balance, setBalance] = React.useState<Decimal>(new Decimal(0))
	const [land, setLand] = React.useState<Square[]>(
		Array(5).fill({
			fruit: Fruit.None,
			createdAt: 0,
		})
	)
	const farmIsFresh = React.useRef(false)
	const [fruit, setFruit] = React.useState<Fruit>(
		(localStorage.getItem('fruit') as Fruit) || Fruit.Sunflower
	)
	const [fruits, setFruits] = React.useState<FruitItem[]>(FRUITS)
	const [machineState, send] = useService<
		Context,
		BlockchainEvent,
		BlockchainState
	>(service)

	const isDirty = machineState.context.blockChain.isUnsaved()

	// If they have unsaved changes, alert them before leaving
	React.useEffect(() => {
		window.onbeforeunload = function (e) {
			if (!isDirty) {
				return undefined
			}
			e = e || window.event

			// For IE and Firefox prior to version 4
			if (e) {
				e.returnValue = 'Sure?'
			}

			// For Safari
			return 'Sure?'
		}
	}, [isDirty, machineState])

	React.useEffect(() => {
		const load = async () => {
			const isFarming =
				machineState.matches('farming') ||
				machineState.matches('onboarding')

			const doRefresh = !farmIsFresh.current

			// HACK: Upgrade modal does not upgrade balance and farm so mark farm as stale
			if (machineState.matches('upgrading')) {
				farmIsFresh.current = false
			}

			// Load fresh data from blockchain only if there are no unsaved changes
			if (
				isFarming &&
				doRefresh &&
				!machineState.context.blockChain.isUnsaved()
			) {
				const {
					farm,
					balance: currentBalance,
				} = await machineState.context.blockChain.getAccount()
				setLand(farm)
				setBalance(new Decimal(currentBalance))
				farmIsFresh.current = true

				const supply = await machineState.context.blockChain.totalSupply()
				const marketRate = getMarketRate(supply)
				const marketFruits = getMarketFruits(marketRate)
				setFruits(marketFruits)
			}
		}

		load()
	}, [machineState])

	const onChangeFruit = (fruit: Fruit) => {
		setFruit(fruit)

		localStorage.setItem('fruit', fruit)
	}
	const onHarvest = React.useCallback(
		async (landIndex: number) => {
			const now = Math.floor(Date.now() / 1000)

			const harvestedFruit = land[landIndex]
			const transaction: Transaction = {
				action: Action.Harvest,
				fruit: Fruit.None,
				landIndex,
				createdAt: now,
			}
			machineState.context.blockChain.addEvent(transaction)

			setLand((oldLand) =>
				oldLand.map((field, index) =>
					index === landIndex
						? { fruit: Fruit.None, createdAt: 0 }
						: field
				)
			)
			const price = fruits.find(
				(item) => item.fruit === harvestedFruit.fruit
			).sellPrice

			setBalance(balance.plus(price))

			send('HARVEST')
		},
		[balance, fruits, land, machineState.context.blockChain, send]
	)

	const onPlant = React.useCallback(
		async (landIndex: number) => {
			const price = fruits.find((item) => item.fruit === fruit).buyPrice

			if (balance.lt(price)) {
				return
			}

			const now = Math.floor(Date.now() / 1000)
			const transaction: Transaction = {
				action: Action.Plant,
				fruit: fruit,
				landIndex,
				createdAt: now,
			}
			machineState.context.blockChain.addEvent(transaction)

			setLand((oldLand) => {
				const newLand = oldLand.map((field, index) =>
					index === landIndex ? transaction : field
				)
				return newLand
			})
			setBalance(balance.minus(price))

			send('PLANT')
		},
		[balance, fruit, fruits, machineState.context.blockChain, send]
	)

	const save = async () => {
		send('SAVE')
	}

	const safeBalance = balance.toNumber()

	console.log({ state: machineState.value })
	return (
		<>
			<Tour />
			<Land
				fruits={fruits}
				selectedFruit={fruit}
				land={land}
				balance={safeBalance}
				onHarvest={onHarvest}
				onPlant={onPlant}
			/>

			<span id="save-button">
				<Panel hasInner={false}>
					<Button
						onClick={save}
						disabled={
							!isDirty || machineState.matches('timerComplete')
						}
					>
						Save
						{isDirty && (
							<Timer
								startAtSeconds={machineState.context.blockChain.lastSaved()}
							/>
						)}
					</Button>
					<Button
						onClick={() =>
							window.open(
								'https://adamhannigan81.gitbook.io/sunflower-coin/'
							)
						}
					>
						About
						<img src={questionMark} id="question" />
					</Button>
				</Panel>
			</span>

			<div id="balance">
				<Panel>
					<div id="inner">
						<img src={coin} />
						{machineState.context.blockChain.isConnected &&
							safeBalance}
					</div>
				</Panel>
			</div>

			<FruitBoard
				fruits={fruits}
				selectedFruit={fruit}
				onSelectFruit={onChangeFruit}
				land={land}
				balance={safeBalance}
			/>
		</>
	)
}

export default Farm
