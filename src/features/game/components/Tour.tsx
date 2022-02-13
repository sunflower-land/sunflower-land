import React from 'react'
import { useMachine } from '@xstate/react'

import { Button } from 'components/ui/Button'
import { TourStates, tourMachine } from 'features/tour/lib/tourMachine'
import { StepType, useTour } from '@reactour/tour'
import { position } from 'html2canvas/dist/types/css/property-descriptors/position'


// const { setCurrentStep: setCurrentTourStep, isOpen: tourIsOpen } = useTour()

export const stepList: StepType[] = [
	{
		selector: '#first-sunflower',
		content: 'These sunflowers are ready for harvest. Click on any of the sunflowers.',
		padding: {mask: [60, 30]}
	},
	{
		selector: '#open-inventory',
		content: "You just harvested your first sunflower, open your inventory to see it.",
		position: 'left',
	},
	{
		selector: '#inventory',
   		content: ({setCurrentStep}) => (
			<div>
				'All your items can be found in the inventory. You can select items to perform actions on your farm!'
				<Button onClick={() => setCurrentStep(3)}>Next</Button>
			</div>
		),
    	padding:  {mask: [20, 60], popover: 45},
	},
]
