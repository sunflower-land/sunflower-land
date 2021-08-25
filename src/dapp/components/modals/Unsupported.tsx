import React from 'react'
import { Panel } from '../ui/Panel'

export const Unsupported: React.FC = () => (
    <Panel>
        <div id="welcome">
            <h1 className="header">
                Mobile devices are currently unsupported.
            </h1>

            <span>The team is currently working on this. In the mean time please use the desktop browser version. Thank you for your patience.</span>
        </div>
    </Panel>
)
