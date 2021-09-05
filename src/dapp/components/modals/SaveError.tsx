import React from 'react'

import { useService } from '@xstate/react';
import { service, Context, BlockchainEvent, BlockchainState } from '../../machine'

import { Panel } from '../ui/Panel'
import { Button } from '../ui/Button'

interface Props {
    code?: string
}

const Content: React.FC<Props> = ({ code }) => {
    const [_, send] = useService<
        Context,
        BlockchainEvent,
        BlockchainState
    >(service);

    const save = () => {
        send('SAVE')
    }

    return (
        <div id='wrong-chain'>
            <span>There was an issue saving your farm to the blockchain.</span>

            <div id='try-it-out'></div>

            <Button onClick={save}>Try again</Button>
        </div>
    )
}

export const SaveError: React.FC<Props> = ({ code }) => (
    <Panel>
        <div id="error">
            <Content code={code} />
        </div>
    </Panel>
)
