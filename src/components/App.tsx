import React from 'react';
import {Contract} from 'web3-eth-contract';
import Token from '../abis/Token.json'
import Farm from '../abis/Farm.json'
import { TokenInstance } from '../../types/truffle-contracts/Token'
import { FarmInstance } from '../../types/truffle-contracts/Farm'
import Web3 from 'web3';
import './App.css';

import { Commodity, Square, Inventory } from './types/contract'
import { Land } from './Land'
import { InventoryBox } from './Inventory'
import { Prices, Props as CurrentPrices  } from './Prices'

type Web3Wrapper<Instance> = {
  
}
interface TokenC extends Contract {
  methods: TokenInstance
}

interface FarmC extends Contract {
  methods: FarmInstance
}
export const App: React.FC = () => {
  const [account, setAccount] = React.useState(null)
  const [balance, setBalance] = React.useState(0)
  const [error, setError] = React.useState('')
  const [inventory, setInventory] = React.useState<Inventory>(null)
  const [prices, setPrices] = React.useState<CurrentPrices>(null)
  const [land, setLand] = React.useState<Square[]>(null)
  const [selectedFruit, setSelectedFruit] = React.useState<Commodity>(null)
  const farmContract = React.useRef<FarmC>(null)
  const transactions = React.useRef<any[]>([])

  const onUpdateFarm = async () => {
    const currentInventory = await farmContract.current.methods.getInventory().call()
    console.log('Update farm: ', currentInventory)
    if (currentInventory && currentInventory.isInitialized) {
      setInventory(currentInventory)

      const currentLand = await farmContract.current.methods.getLand().call()
      setLand(currentLand)
    }
  }

  const onGetPrice = async () => {
    const prices = await farmContract.current.methods.getPrices().call()
    setPrices(prices)
  }

  React.useEffect(() => {
    const init = async () => {
      if (typeof (window as any).ethereum !== 'undefined') {
        //check if MetaMask exists
        const web3 = new Web3((window as any).ethereum);
        web3.eth.handleRevert = true
        const netId = await web3.eth.net.getId();
        const accounts = await web3.eth.requestAccounts()
        // TODO set account
        const account = accounts[0]
        setAccount(account)
        console.log('My netId: ', netId)
  
        const token: TokenC  = new web3.eth.Contract(Token.abi as any, Token.networks[netId].address)
        const farmAddress = Farm.networks[netId].address
        farmContract.current = new web3.eth.Contract(Farm.abi as any, farmAddress)

        const balance = await token.methods.balanceOf(account).call()
        setBalance(balance)
        console.log({ balance})
        const farmBalance = await farmContract.current.methods.getBalance().call()
        console.log({ farmBalance})

        //setBalance(Number(balance))
        await onUpdateFarm()
        await onGetPrice()

        farmContract.current.events.FarmCreated({
            filter: { _address: account },
        }, function(error, event){ console.log(event); })
          .on('data', function(event){
            console.log('Farm updated: ', event)
            onUpdateFarm()
          })
          .on('changed', function(event){
              // remove event from local database
              console.log('ChangeL ', event)
          })
          .on('error', console.error);

        farmContract.current.events.FarmSynced({
            filter: { _address: account },
        }, function(error, event){ console.log(event); })
          .on('data', function(event){
            console.log('Farm updated: ', event)
            onUpdateFarm()
          })
      } else {
        window.alert('Please install metamask')
      }
    }

    init()
  }, [])

  const onCreateFarm = () => {
    farmContract.current.methods.createFarm().send({from: account})
  }

  const onSyncFarm = () => {
    farmContract.current.methods.sync(transactions.current).send({from: account})
  }

  const onBuyMoreLand = () => {
    farmContract.current.methods.buyMoreSpace(transactions.current).send({from: account})
  }
  
  const onSelectLand = async (landIndex: number) => {
    const field = land[landIndex]
    console.log({ field })
    console.log('Old trans: ', transactions.current)
    console.log({ landIndex })

    if (field.commodity != Commodity.Empty) {
      try {
        const { transactions: newTransactions, land, inventory, balance } = await farmContract.current.methods.harvest(transactions.current, field.commodity, landIndex).call()
        transactions.current = newTransactions;
        console.log({
          newTransactions,
          land,
          inventory,
          balance
        })
        setLand(land)
        setInventory(inventory)
        setBalance(Number(balance))
      }
      catch (e) {
        const errorJSON = e.message.slice(25)
        setError(JSON.parse(errorJSON).message)
      }

    } else {
      if (selectedFruit === null) {
        return
      }
      try {
        const { transactions: newTransactions, land, inventory, balance } = await farmContract.current.methods.plant(transactions.current, selectedFruit, landIndex).call()
        transactions.current = newTransactions;
        console.log({
          newTransactions,
          land,
          inventory,
          balance
        })
        setLand(land)
        setInventory(inventory)
        setBalance(Number(balance))
      } catch (e) {
        const errorJSON = e.message.slice(25)
        setError(JSON.parse(errorJSON).message)
      }

      setSelectedFruit(null)
    }

    setSelectedFruit(null)
  }

  const onBuy = async (commodity: Commodity) => {
    const response= await farmContract.current.methods.buy(transactions.current, commodity).call()
    transactions.current = response[0].transactions;
    setLand(response[0].land)
    setInventory(response[0].inventory)
    setBalance(Number(response[0].balance))
  }

  const onSell = async (commodity: Commodity) => {
    const response= await farmContract.current.methods.sell(transactions.current, commodity).call()
    transactions.current = response[0].transactions;
    console.log('response: ', JSON.stringify(response, null, 2))
    setLand(response[0].land)
    setInventory(response[0].inventory)
    setBalance(Number(response[0].balance))
  }


  return (
    <div className='text-monospace'>
      <div className="container-fluid mt-5 text-center">
        <h1>Welcome to Fruit Market</h1>
        <h2>{account}</h2>
        <h4>{balance}</h4>
        {
          inventory && prices && (
            <>
              <button onClick={onSyncFarm}>
                Sync
              </button>
              <button onClick={onBuyMoreLand}>
                Buy more land
              </button>
              <button disabled={balance < Number(prices.apples)} onClick={() => onBuy(Commodity.Apple)}>
                Buy Apple
              </button>
              <button disabled={inventory.apples == 0} onClick={() => onSell(Commodity.Apple)}>
                Sell Apple
              </button>
              <button disabled={balance < Number(prices.avocados)} onClick={() => onBuy(Commodity.Avocado)}>
                Buy Avocado
              </button>
              <button disabled={inventory.avocados == 0} onClick={() => onSell(Commodity.Avocado)}>
                Sell Avocado
              </button>
            </>
          )
        }
        {
          error && <span style={{color: 'red'}}>{error}</span>
        }
      </div>
      {
        prices && (
          <Prices {...prices} />
        )
      }
      <div className="row">
          {
            !inventory && (
              <button onClick={onCreateFarm}>
                Create Farm
              </button>
            )
          }
          {
            land && (
              <Land land={land} onClick={onSelectLand}/>
            )
          }
          {
            inventory && (
              <InventoryBox
                inventory={inventory}
                selectedFruit={selectedFruit}
                onSelectFruit={setSelectedFruit}
              />
            )
          }
      </div>
    </div>
  )
}

export default App

