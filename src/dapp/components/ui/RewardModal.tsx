import React from 'react'
import { useService } from '@xstate/react'

import Modal from 'react-bootstrap/Modal'

import {
	service,
	Context,
	BlockchainEvent,
	BlockchainState,
} from '../../machine'


import cancel from '../../images/ui/cancel.png'
import coin from '../../images/ui/sunflower_coin.png'


import { Panel } from './Panel'
import { Message } from './Message'
import { Button } from './Button'

import './UpgradeModal.css'

interface Props {
	isOpen: boolean
	onClose: () => void
	reward: number
}

export const RewardModal: React.FC<Props> = ({
	isOpen,
	onClose,
	reward
}) => {
	const [machineState, send] = useService<
		Context,
		BlockchainEvent,
		BlockchainState
	>(service)

	const isUnsaved = machineState.context.blockChain.isUnsaved()

	const open = () => {

	}

	return (
		<Modal centered show={isOpen} onHide={onClose}>
			<Panel>
				<div id="charity-container">
					<span>Collect your reward</span>
					
					{isUnsaved ? (
						<>
							<div className="upgrade-required">
								<Message>
									Save your farm first
									<img
										src={cancel}
										className="insufficient-funds-cross"
									/>
								</Message>
							</div>
							<span id="donate-description">
								You must first save your farm to the blockchain
								before attempting to upgrade.{' '}
							</span>
						</>
					) : (
						<div>
							<div id='reward-holder'>
								<span>{`$${reward}`}</span>
								<img src={coin} id='reward-coin' />
							</div>
							<div id='reward-button'>
								<Button onClick={open}>
									Open
								</Button>
							</div>
						</div>
                    )}
				</div>
			</Panel>
		</Modal>
	)
}

export const UpgradeOverlay = (props) => (
	<div id="tester" {...props}>
		<Message>Upgrade required</Message>
	</div>
)
