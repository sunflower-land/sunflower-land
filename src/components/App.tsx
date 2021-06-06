import React from 'react';
import {Contract} from 'web3-eth-contract';
import Token from '../abis/Token.json'
import Farm from '../abis/Farm.json'
import { TokenInstance } from '../../types/truffle-contracts/Token'
import { FarmInstance } from '../../types/truffle-contracts/Farm'
import Web3 from 'web3';
import './App.css';

import { Fruit, Square } from './types/contract'
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
  const [land, setLand] = React.useState<Square[]>(null)
  const [fruit, setFruit] = React.useState<Fruit>(Fruit.Apple)
  const [conversion, setConversion] = React.useState<string>('0')
  const farmContract = React.useRef<FarmC>(null)
  const tokenContract = React.useRef<TokenC>(null)
  const transactions = React.useRef<any[]>([])

  const onUpdateFarm = async (accountAddress: string) => {
    const currentLand = await farmContract.current.methods.getLand().call({ from: accountAddress})
    console.log({ currentLand })
    if (currentLand.length > 0) {
      setLand(currentLand)
    }

    console.log('Account: ', account)
    const farmBalance = await tokenContract.current.methods.balanceOf(accountAddress).call({ from: accountAddress})
    setBalance(farmBalance)
    console.log({ farmBalance})

    const conversion = await farmContract.current.methods.getMarketPrice(1).call({ from: accountAddress})
    setConversion(conversion)
    console.log({ conversion })
  }

  React.useEffect(() => {
    const init = async () => {
      if (typeof (window as any).ethereum !== 'undefined') {
        //check if MetaMask exists
        // let web3 = new Web3(
        //   // Replace YOUR-PROJECT-ID with a Project ID from your Infura Dashboard
        //   new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/b484c5b4201c4bd2b8bf5575033cfacb")
        // );
        // await window.ethereum.enable();
        // web3.eth.defaultAddress = '0xbd407263721492eBD521AB184DAc2C9f9E5D4c36'
        //web3.eth.handleRevert = true
        // const token: TokenC = new web3.eth.Contract(Token.abi as any, '0xF512B41Bd7551AA116508A0752A0263Abc6cC44f')
        // farmContract.current = new web3.eth.Contract(Farm.abi as any, '0x088Dc1eC31D6339F804F475AaC1d850c16046368')
        //const web3 = new Web3((window as any).ethereum);
        //const web3 = new Web3('https://rpc-mumbai.matic.today')
        const web3  = new Web3(ethereum);
        try{
          // Request account access if needed
          await ethereum.enable();
        } catch (error){
          // User denied account access...
        }
        const maticAccounts = await web3.eth.getAccounts()
        const account = maticAccounts[0]
        setAccount(account)
        console.log({ maticAccounts })
        const netId = await web3.eth.net.getId();
        console.log({ netId })
        // const accounts = await web3.eth.requestAccounts()
        // // TODO set account
        // const account = accounts[0]
        // setAccount(account)

  
        //tokenContract.current = new web3.eth.Contract(Token.abi as any, Token.networks[netId].address)
        tokenContract.current = new web3.eth.Contract(Token.abi as any, '0x2427d3AceE848B07FC67e40223B0fc22589C7b24')

        //const farmAddress = Farm.networks[netId].address
        const farmAddress = '0x90002454c2A76E5E61eBEDBd3a92fBacbD246365'
        farmContract.current = new web3.eth.Contract(Farm.abi as any, farmAddress)
        console.log('Read balance')
        const FMC = await tokenContract.current.methods.balanceOf(account).call()
        console.log({ FMC })
        const decimals = await tokenContract.current.methods.decimals().call()
        console.log({ decimals })

        await onUpdateFarm(account)

        console.log({ conversion })

        farmContract.current.events.FarmCreated({
            filter: { _address: account },
        }, function(error, event){ console.log(event); })
          .on('data', function(event){
            console.log('Farm updated: ', event)
            onUpdateFarm(account)
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
            onUpdateFarm(account)
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
    try {
      farmContract.current.methods.sync(transactions.current).send({from: account})
    } catch (e) {
        const errorJSON = e.message.slice(25)
        setError(JSON.parse(errorJSON).message)
      }
  }

  const onBuyMoreLand = () => {
    try {
      farmContract.current.methods.levelUp().send({from: account})
    }catch (e) {
        const errorJSON = e.message.slice(25)
        setError(JSON.parse(errorJSON).message)
      }
  }

  const onHarvest = async (landIndex: number) => {
    try {
      const { transactions: newTransactions, land: newLand, balance } = await farmContract.current.methods.harvest(transactions.current, land[landIndex].fruit, landIndex).call({ from: account})
      transactions.current = newTransactions;
      console.log({
        newTransactions,
        newLand,
        balance,
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
      const { transactions: newTransactions, land: newLand, balance } = await farmContract.current.methods.plant(transactions.current, fruit, landIndex).call({ from: account})
      transactions.current = newTransactions;
      console.log({
        newTransactions,
        newLand,
        balance,
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
        <h4>{(balance/10**18).toFixed(2)}</h4>
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

