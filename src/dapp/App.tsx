import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { useService } from '@xstate/react';

import { service, Context, BlockchainEvent, BlockchainState } from './machine'

import { Charity as Charities } from './types/contract'

import { Charity, Connecting, Welcome, Creating, Saving, Error, TimerComplete } from './components/modals'
import Farm from './components/farm/Farm'

import './App.css'

export const App: React.FC = () => {
  const [machineState, send] = useService<
    Context,
    BlockchainEvent,
    BlockchainState
  >(service);

  React.useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('networkChanged', () => {
        console.log('Network changed')
        send('NETWORK_CHANGED')
      });
    }
  }, [send])
  
  const getStarted = () => {
    send('GET_STARTED')
  }

  const createFarm = (charity: Charities) => {
    send('DONATE', { charity })
  }

  return (
    <div id='container'>
        <Farm />
        <Modal centered show={machineState.matches('loading')}>
          <Connecting/>
        </Modal>

        <Modal centered show={machineState.matches('initial')}>
          <Welcome onGetStarted={getStarted} />
        </Modal>

        <Modal centered show={machineState.matches('registering')}>
          <Charity onSelect={createFarm} />
        </Modal>

        <Modal centered show={machineState.matches('creating')}>
          <Creating />
        </Modal>

        <Modal centered show={machineState.matches('saving') || machineState.matches('upgrading')}>
          <Saving />
        </Modal>

        <Modal centered show={machineState.matches('timerComplete')}>
          <TimerComplete />
        </Modal>

        <Modal centered show={machineState.matches('failure')}>
          <Error code={machineState.context.errorCode} />
        </Modal>
    </div>
  )
}

export default App

