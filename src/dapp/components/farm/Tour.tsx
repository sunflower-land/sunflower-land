import React from 'react'
import ReactTour, { ReactourStep } from 'reactour'
import { useService } from '@xstate/react'

import {
	service,
	Context,
	BlockchainEvent,
	BlockchainState,
	OnboardingStates,
} from '../../machine'

import { Button } from '../ui/Button'

const steps: ReactourStep[] = [
	{
		selector: '#first-sunflower',
		content: 'This sunflower is ready for harvest. Click on the sunflower.',
	},
	{
		selector: '#balance',
		content: ({ goTo }) => (
			<div>
				You received $$$ Sunflower Farmer Tokens for the harvest
				<br />
				<div id="tour-button">
					<Button onClick={() => service.send('NEXT')}>Next</Button>
				</div>
			</div>
		),
	},
	{
		selector: '#first-sunflower',
		content: 'Now you can plant a new sunflower',
	},
	{
		selector: '#save-button',
		stepInteraction: false,
		content: () => (
			<div>
				Don't forget to save your farm within 25 minutes of your first
				action. Once you save you can close the browser and come back later to harvest your fields.
				<br />
				<div id="tour-button">
					<Button onClick={() => service.send('NEXT')}>Next</Button>
				</div>
			</div>
		),
	},
	{
		selector: '#basket',
		stepInteraction: false,
		content: () => (
			<div>
				You can buy different types of seeds here. Some are more
				expensive but yield greater rewards
				<br />
				<div id="tour-button">
					<Button onClick={() => service.send('FINISH')}>Done</Button>
				</div>
			</div>
		),
	},
]

const STEP_MACHINE: Record<OnboardingStates, number> = {
	harvesting: 0,
	token: 1,
	planting: 2,
	saving: 3,
	market: 4,
}

export const Tour: React.FC = () => {
	const [machineState, send] = useService<
		Context,
		BlockchainEvent,
		BlockchainState
	>(service)

	const step =
		STEP_MACHINE[
			(machineState.value as any).onboarding as OnboardingStates
		] || 0

	const onFinish = () => {
		send('CLOSE')
	}

	return (
		<>
			<ReactTour
				steps={steps}
				isOpen={machineState.matches('onboarding')}
				onRequestClose={onFinish}
				goToStep={step}
				update={step.toString()}
				showButtons={false}
				rounded={5}
				disableDotsNavigation
				className="farm-tour"
				showNumber={false}
				accentColor="#e6a873"
			/>
		</>
	)
}

export default Tour
