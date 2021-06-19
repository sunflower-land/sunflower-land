import React from 'react';

import { Fruit, Square, Action, Transaction } from './types/contract'
import { Land } from './Land'
import { InventoryBox } from './Inventory'
import { BlockChain } from './Blockchain'

import { getBuyPrice } from './actions/buy'
import { getSellPrice } from './actions/sell'

interface Props {
    blockChain: BlockChain
}
export const App: React.FC<Props> = ({ blockChain }) => {
  const [balance, setBalance] = React.useState(0)
  const [land, setLand] = React.useState<Square[]>([])
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

  if (isLoading) {
      return <span>Loading...</span>
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
          {
            hasFarm && (
              <Land land={land} onHarvest={onHarvest} onPlant={onPlant}/>
            )
          }
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

