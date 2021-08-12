import React from 'react'
import { Panel } from '../ui/Panel'
import { Button } from '../ui/Button'

interface Props {
    code?: string
}

const Content: React.FC<Props> = ({ code }) => {
    if (code === 'NO_WEB3') {
        return (
            <>
                You are not connected to Metamask.

                <Button onClick={() => window.open('https://adamhannigan81.gitbook.io/sunflower-coin/#how-to-setup')}>Connect</Button>
            </>
        )
    }

    if (code === 'WRONG_CHAIN') {
        return (
            <>
                <span>Switch to the Polygon network to start your farm.</span>
                

                <Button onClick={() => window.open('https://adamhannigan81.gitbook.io/sunflower-coin/#how-to-setup')}>How to Connect</Button>
            </>
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
