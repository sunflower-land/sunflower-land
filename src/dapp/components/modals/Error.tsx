import React from 'react'
import { Panel } from '../ui/Panel'
import { Button } from '../ui/Button'

interface Props {
    code?: string
}

export const Error: React.FC<Props> = ({ code }) => (
    <Panel>
        <div id="saving">
            <p>Something went wrong. Try refresh the page</p>
            {
                code === 'NO_WEB3' && (
                    <>
                        You are not connected to Metamask.

                        <Button onClick={() => window.open('https://adamhannigan81.gitbook.io/sunflower-coin/#how-to-setup')}>Connect</Button>
                    </>
                )
            }
            {
                code === 'WRONG_CHAIN' && (
                    <>
                    <span>You are not connected to the Polygon network.</span>
                    

                    <Button onClick={() => window.open('https://adamhannigan81.gitbook.io/sunflower-coin/#how-to-setup')}>How to Connect</Button>
                    </>
                )
            }
            </div>
        </Panel>
)
