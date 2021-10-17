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


import { Panel } from './Panel'
import { Message } from './Message'
import { Button } from './Button'

import './UpgradeModal.css'

interface Props {
	isOpen: boolean
	onClose: () => void
}

export const RewardModal: React.FC<Props> = ({
	isOpen,
	onClose,
}) => {
	const [machineState, send] = useService<
		Context,
		BlockchainEvent,
		BlockchainState
	>(service)

	const isUnsaved = machineState.context.blockChain.isUnsaved()

	return (
		<Modal centered show={isOpen} onHide={onClose}>
			<Panel>
				<div id="charity-container">
					<span>Reward!</span>
					
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
                        <span id="donate-description">
                            Here is your reward
                        </span>
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
