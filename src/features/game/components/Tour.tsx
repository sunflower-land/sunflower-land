import React from 'react'
import { useMachine } from '@xstate/react'

import { Button } from 'components/ui/Button'
import { TourStates, tourMachine } from 'features/tour/lib/tourMachine'
import { StepType, useTour } from '@reactour/tour'


// const { setCurrentStep: setCurrentTourStep, isOpen: tourIsOpen } = useTour()

export const stepList: StepType[] = [
	{
		selector: '#first-sunflower',
    content: 'These sunflowers are ready for harvest. Click on any of the sunflowers.'
	},
]
