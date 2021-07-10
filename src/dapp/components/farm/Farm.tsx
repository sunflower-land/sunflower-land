import React from 'react';
import { useService } from '@xstate/react';

import { Land } from './Land'

import { getFruit } from '../../types/fruits'
import { Fruit, Square, Action, Transaction } from '../../types/contract'


import { service, Context, BlockchainEvent, BlockchainState } from '../../machine'

import coin from '../../images/ui/coin.png'
import questionMark from '../../images/ui/expression_confused.png'

import { Panel } from '../ui/Panel'
import { Timer } from '../ui/Timer'
import { Button } from '../ui/Button'

import { FruitBoard } from './FruitBoard'

export const Farm: React.FC= () => {
  const [balance, setBalance] = React.useState(0)
  const [land, setLand] = React.useState<Square[]>(Array(16).fill({}))
  const [fruit, setFruit] = React.useState<Fruit>(Fruit.Apple)

  const events = React.useRef<Transaction[]>([])

  const [machineState, send] = useService<
    Context,
    BlockchainEvent,
    BlockchainState
  >(service);

  // If they have unsaved changes, alert them before leaving
  React.useEffect(() => {
    window.onbeforeunload = function (e) {
      if (events.current.length === 0) {
        return undefined
      }
      e = e || window.event;
  
      // For IE and Firefox prior to version 4
      if (e) {
          e.returnValue = 'Sure?';
      }
  
      // For Safari
      return 'Sure?';
  };
  }, [])


  const onUpdate = React.useCallback(async () => {
    if (machineState.matches('farming')) {
      const { farm, balance: currentBalance } = await machineState.context.blockChain.getAccount()
      setLand(farm)
      setBalance(currentBalance)
    }
  }, [machineState])

  React.useEffect(() => {
    onUpdate()
  }, [onUpdate])

  const onHarvest = async (landIndex: number) => {
    const now = Math.floor(Date.now() / 1000)

    const harvestedFruit = land[landIndex]
    const transaction: Transaction = {
      action: Action.Harvest,
      fruit: Fruit.None,
      landIndex,
      createdAt: now,
    }
    events.current = [...events.current, transaction];

    setLand(oldLand => oldLand.map((field, index) => index === landIndex ? { fruit: Fruit.None, createdAt: 0 } : field))
    const price = getFruit(harvestedFruit.fruit).sellPrice
    setBalance(balance + price)
  }
  
  const onPlant = async (landIndex: number) => {
    const price = getFruit(fruit).buyPrice

    if (price > balance) {
        return
    }

    const now = Math.floor(Date.now() / 1000)
    const transaction: Transaction = {
      action: Action.Plant,
      fruit: fruit,
      landIndex,
      createdAt: now,
    }
    events.current = [...events.current, transaction];

    setLand(oldLand => {
      const newLand = oldLand.map((field, index) => index === landIndex ? transaction : field)
      return newLand
    })
    setBalance(balance - price)
  }

  const save = async () => {
    send('SAVE', { events: events.current })
  }

  const isDirty = events.current.length > 0
  
  return (
      <>
        <Land land={land} balance={balance} onHarvest={onHarvest} onPlant={onPlant}/>

        <span id='save-button'>
          <Panel hasInner={false}>
            <Button onClick={save}>
                Save
                {
                  isDirty && (
                    <Timer startAtSeconds={events.current[0].createdAt}/>
                  )
                }
            </Button>
            <Button onClick={() => window.open('https://adamhannigan81.gitbook.io/sunflower-coin/')}>
              About
              <img src={questionMark} id="question"/>
            </Button>
          </Panel>
        </span>

        <div id="balance">
          <Panel>
            <div id="inner">
              <img src={coin} />
              {machineState.context.blockChain.isConnected && balance.toFixed(2)}
            </div>
          </Panel>
        </div>

        <FruitBoard selectedFruit={fruit} onSelectFruit={setFruit} land={land} balance={balance}/>
      </>
  )
}

export default Farm

