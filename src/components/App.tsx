import React from 'react';
import {Contract} from 'web3-eth-contract';
import Token from '../abis/Token.json'
import Farm from '../abis/Farm.json'
import { TokenInstance } from '../../types/truffle-contracts/Token'
import { FarmInstance } from '../../types/truffle-contracts/Farm'
import Web3 from 'web3';
import './App.css';

import { Commodity, Square } from './types/contract'
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
  const [prices, setPrices] = React.useState<CurrentPrices>(null)
  const [land, setLand] = React.useState<Square[]>(null)
  const [fruit, setFruit] = React.useState<Commodity>(Commodity.Apple)
  const [level, setLevel] = React.useState<string>('0')
  const [conversion, setConversion] = React.useState<string>('0')
  const farmContract = React.useRef<FarmC>(null)
  const transactions = React.useRef<any[]>([])

  const onUpdateFarm = async () => {
    const currentLand = await farmContract.current.methods.getLand().call()
    if (currentLand.length > 0) {
      setLand(currentLand)
    }

    const farmBalance = await farmContract.current.methods.getBalance().call()
    setBalance(farmBalance)
    console.log({ farmBalance})

    const currentLevel = await farmContract.current.methods.getLevel().call()
    setLevel(currentLevel)
    console.log({ currentLevel })

    const conversion = await farmContract.current.methods.getConversion().call()
    setConversion(conversion)
    console.log({ conversion })
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

        const FMC = await token.methods.balanceOf(account).call()
        console.log({ FMC })

        //setBalance(Number(balance))
        await onUpdateFarm()
        await onGetPrice()

        const conversion = await farmContract.current.methods.dollarToFMC(1000).call()
        console.log({ conversion })

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
            console.log('Farm synced: ', event)
            transactions.current = []
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

  const onHarvest = async (landIndex: number) => {
    try {
      const { transactions: newTransactions, land: newLand, balance, level } = await farmContract.current.methods.harvest(transactions.current, land[landIndex].commodity, landIndex).call()
      transactions.current = newTransactions;
      console.log({
        newTransactions,
        newLand,
        balance,
        level
      })
      setLand(newLand)
      setBalance(Number(balance))
    }
    catch (e) {
      const errorJSON = e.message.slice(25)
      setError(JSON.parse(errorJSON).message)
    }
  }
  
  const onPlant = async (landIndex: number) => {
    try {
      const { transactions: newTransactions, land: newLand, balance, level } = await farmContract.current.methods.plant(transactions.current, fruit, landIndex).call()
      transactions.current = newTransactions;
      console.log({
        newTransactions,
        newLand,
        balance,
        level
      })
      setLand(newLand)
      setBalance(Number(balance))
    } catch (e) {
      const errorJSON = e.message.slice(25)
      setError(JSON.parse(errorJSON).message)
    }
  }

  return (
    <div className='text-monospace'>
      <div className="container-fluid mt-5 text-center">
        <h1>Welcome to Fruit Market</h1>
        <h2>{account}</h2>
        <h4>{(balance/100).toFixed(2)}</h4>
        {
          land && (
            <>
              <button onClick={onSyncFarm}>
                Sync
              </button>
              <button onClick={onBuyMoreLand}>
                Buy more land
              </button>
            </>
          )
        }
        {
          error && <span style={{color: 'red'}}>{error}</span>
        }
      </div>
      <div>
        <pre>Level: {level}</pre>
        <pre>Conversion: {conversion}</pre>
      </div>
      <div className="row">
          {
            !land && (
              <button onClick={onCreateFarm}>
                Create Farm
              </button>
            )
          }
          {
            land && (
              <Land land={land} onHarvest={onHarvest} onPlant={onPlant}/>
            )
          }
          {
            land && (
              <InventoryBox selectedFruit={fruit} onSelectFruit={setFruit} />
            )
          }
      </div>
    </div>
  )
}

export default App

