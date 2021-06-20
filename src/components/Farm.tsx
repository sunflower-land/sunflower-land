import React from 'react';
import Modal from 'react-bootstrap/Modal';

import './App.css'
import { Fruit, Square, Action, Transaction } from './types/contract'
import { Land } from './Land'
import { InventoryBox } from './Inventory'
import { BlockChain } from './Blockchain'

import { getBuyPrice } from './actions/buy'
import { getSellPrice } from './actions/sell'

import coin from './images/ui/coin.png'
import edge from './images/ui/label_left.png'
import panelBG from './images/ui/label_middle.png'

import { FruitBoard } from './FruitBoard'
import { Panel } from './Panel'

interface Props {
    blockChain: BlockChain
}
export const App: React.FC<Props> = ({ blockChain }) => {
  const [balance, setBalance] = React.useState(0)
  const [land, setLand] = React.useState<Square[]>(Array(5).fill({}))
  const [fruit, setFruit] = React.useState<Fruit>(Fruit.Apple)
  const [conversion, setConversion] = React.useState<string>('0')
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const events = React.useRef<any[]>([])

  const onUpdate = React.useCallback(async () => {
    const { farm, balance: currentBalance } = await blockChain.getAccount()
    setLand(farm)
    console.log('Farm isL: ', farm)
    setBalance(currentBalance)
  }, [blockChain])

  React.useEffect(() => {
    const init = async () => {
        setIsLoading(true)
        await onUpdate()
        setIsLoading(false)
    }

    init()
  }, [onUpdate])

  const onHarvest = async (landIndex: number) => {
    const now = Math.floor(Date.now() / 1000)

    const transaction: Transaction = {
      action: Action.Harvest,
      fruit: Fruit.None,
      landIndex,
      createdAt: now,
    }
    events.current = [...events.current, transaction];

    setLand(oldLand => oldLand.map((field, index) => index === landIndex ? { fruit: Fruit.None, createdAt: 0 } : field))
    const price = getSellPrice(fruit)
    setBalance(balance + price)
  }
  
  const onPlant = async (landIndex: number) => {
    const price = getBuyPrice(fruit)

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

  const onSync = async () => {
    setIsLoading(true)
    await blockChain.save(events.current)
    onUpdate()
    setIsLoading(false)
}

  const onLevelUp = async () => {
    setIsLoading(true)
    await blockChain.levelUp()
    onUpdate()
    setIsLoading(false)
  }

  const onCreate = async () => {
    setIsLoading(true)
    await blockChain.createFarm()
    onUpdate()
    setIsLoading(false)
  }

  const hasFarm = land.length > 0
  
  return (
      <>
        {/* <h4>{(balance/10**18).toFixed(2)}</h4>
        {
          hasFarm && (
            <>
              <button onClick={onSync}>
                Sync
              </button>
              <button onClick={onLevelUp}>
                Buy more land
              </button>
            </>
          )
        }
      <div>
        <pre>Conversion: {conversion}</pre>
      </div>
      <div>
          {
            !hasFarm && (
              <button onClick={onCreate}>
                Create Farm
              </button>
            )
          } */}
          <Land land={land} onHarvest={onHarvest} onPlant={onPlant}/>
          <span id='save-button' onClick={onSync}>Save</span>
          <div id="balance">
            <Panel>
              <div id="inner">
                <img src={coin} />
                {Number(blockChain.getWeb3().utils.fromWei(balance.toString())).toFixed(2)}
              </div>
            </Panel>
          </div>

          <Modal centered show={isLoading}>
            <Panel>
              <div id="saving">
                Saving to the chain...
              </div>
            </Panel>
          </Modal>


          <FruitBoard selectedFruit={fruit} onSelectFruit={setFruit} land={land} balance={balance}/>
          {/* {
            hasFarm && (
              <InventoryBox balance={balance} land={land} selectedFruit={fruit} onSelectFruit={setFruit} />
            )
          }
        </div> */}
      </>
  )
}

export default App

