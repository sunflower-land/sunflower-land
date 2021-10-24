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

    const trial = () => {
        send('TRIAL')
    }

    if (code === 'NO_WEB3') {
        return (
            <>
                You are not connected to Metamask.

                <Button onClick={() => window.open('https://adamhannigan81.gitbook.io/sunflower-coin/#how-to-setup')}>How to setup Metamask</Button>

                <div id='try-it-out'></div>
                <span >Once you have installed Metamask, please refresh the page. Otherwise, feel free to try a simulation & play without tokens</span>

                <Button onClick={trial}>Play trial</Button>
            </>
        )
    }

    if (code === 'WRONG_CHAIN') {
        return (
            <div id='wrong-chain'>
                <span>It looks like you are not connected to the Polygon Blockchain.</span>

                <Button onClick={() => window.open('https://adamhannigan81.gitbook.io/sunflower-coin/#how-to-setup')}>How to Connect</Button>

                <div id='try-it-out'></div>
                <span >Otherwise, feel free to try a simulation & play without tokens</span>

                <Button onClick={trial}>Try it out</Button>
            </div>
        )
    }

    if (code === 'TRIAL_MODE') {
        return (
            <div id='wrong-chain'>
                <span>It looks like you are not connected to the Polygon Blockchain.</span>

                <div id='try-it-out'></div>

                <Button onClick={trial}>Keep Playing</Button>

            </div>
        )
    }

    return (
        <p>Something went wrong. Try refresh the page</p>
    )
}
export const Error: React.FC<Props> = ({ code }) => (
    <Panel>
        <div id="error">
            <Content code={code} />
        </div>
    </Panel>
)
