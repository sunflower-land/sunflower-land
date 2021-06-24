import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { useService } from '@xstate/react';

import { service, Context, BlockchainEvent, BlockchainState } from './machine'
import Farm from './Farm'
import { Panel } from './Panel'
import { Button } from './Button'
import { Charity } from './Charity'
import { Charity as Charities } from './types/contract'


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
    console.log({ charity })
  }

  console.log(machineState.value)

  return (
    <div>
        <Farm />

        <Modal centered show={machineState.matches('initial')}>
          <Panel>
            <div id="welcome">
              <h1 className="header">
                Fruit Market Coin
              </h1>
              <Button onClick={getStarted}>
                <span>
                  Get Started
                </span>
              </Button>
            </div>
          </Panel>
        </Modal>

        <Modal centered show={machineState.matches('notConnected')}>
          <Panel>
            Not Connected - Instructions to connect
          </Panel>
        </Modal>

        <Modal centered show={machineState.matches('registering')}>
          <Panel>
            <Charity onSelect={createFarm} />
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
              Failure
          </Panel>
        </Modal>
      {/*         
      </div> */}
    </div>
  )
}

export default App

