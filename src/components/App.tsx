import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { useService } from '@xstate/react';

import { service, Context, BlockchainEvent, BlockchainState } from './machine'
import Farm from './Farm'
import { Panel } from './Panel'
import { Button } from './Button'
import { Charity } from './Charity'
import { Charity as Charities } from './types/contract'
import questionMark from './images/ui/expression_confused.png'


export const App: React.FC = () => {
  const [machineState, send] = useService<
    Context,
    BlockchainEvent,
    BlockchainState
  >(service);

  const getStarted = () => {
    send('GET_STARTED')
  }

  const createFarm = (charity: Charities) => {
    send('DONATE', { charity })

    console.log({ charity })
  }

  console.log(machineState)

  return (
    <div>
        <Farm />

        <Modal centered show={machineState.matches('loading')}>
          <Panel>
            <div id="welcome">
              <h1 className="header">
                Connecting to metamask...
              </h1>
            </div>
          </Panel>
        </Modal>

        <Modal centered show={machineState.matches('initial')}>
          <Panel>
            <div id="welcome">
              <h1 className="header">
                Sunflower Coin
              </h1>
              <Button onClick={getStarted}>
                <span>
                  Get Started
                </span>
              </Button>
              <Button onClick={() => window.open('https://adamhannigan81.gitbook.io/sunflower-coin/')}>
                  About
                  <img src={questionMark} id="question"/>
                </Button>
            </div>
          </Panel>
        </Modal>

        <Modal centered show={machineState.matches('registering')}>
          <Panel>
            <Charity onSelect={createFarm} />
          </Panel>
        </Modal>

        <Modal centered show={machineState.matches('creating')}>
          <Panel>
            <div id="saving">
              Creating...
            </div>
          </Panel>
        </Modal>

        <Modal centered show={machineState.matches('saving') || machineState.matches('upgrading')}>
          <Panel>
            <div id="saving">
              Saving to the chain...
            </div>
          </Panel>
        </Modal>

        <Modal centered show={machineState.matches('failure')}>
          <Panel>
            <div id="saving">
              <p>Something went wrong. Try refresh the page</p>
              {
                machineState.context.errorCode === 'NO_WEB3' && (
                    <>
                      You are not connected to Metamask.

                      <Button onClick={() => window.open('https://adamhannigan81.gitbook.io/sunflower-coin/#how-to-setup')}>Connect</Button>
                    </>
                )
              }
              {
                machineState.context.errorCode === 'WRONG_CHAIN' && (
                  <>
                    <span>You are not connected to the Polygon network.</span>
                    

                    <Button onClick={() => window.open('https://adamhannigan81.gitbook.io/sunflower-coin/#how-to-setup')}>How to Connect</Button>
                  </>
                )
              }
              </div>
          </Panel>
        </Modal>
      {/*         
      </div> */}
    </div>
  )
}

export default App

