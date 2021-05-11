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
  const [inventory, setInventory] = React.useState<Inventory>(null)
  const [land, setLand] = React.useState<Square[]>(null)
  const [selectedFruit, setSelectedFruit] = React.useState<Commodity>(null)
  const farmContract = React.useRef<FarmC>(null)
  const transactions = React.useRef<any[]>([])

  React.useEffect(() => {
    const init = async () => {
      if (typeof (window as any).ethereum !== 'undefined') {
        //check if MetaMask exists
        const web3 = new Web3((window as any).ethereum);
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
        console.log({ balance})
        setBalance(balance)
        const playersItems = await farmContract.current.methods.getInventory().call()
        if (playersItems.isInitialized) {
          setInventory(playersItems)

          const land = await farmContract.current.methods.getLand().call()
          setLand(land)
        }
      } else {
        window.alert('Please install metamask')
      }
    }

    init()
  }, [])

  const onCreateFarm = async () => {
    const farm = await farmContract.current.methods.createFarm().send({from: account})
    // TODO emit messages
    console.log({ farm })
    setLand(farm.land)
    setInventory(farm.inventory)
  }
  
  const onSelectLand = async (landIndex: number) => {
    const field = land[landIndex]
    console.log({ field })
    console.log('Old trans: ', transactions.current)
    console.log({ landIndex })

    if (field.commodity == Commodity.Apple) {
      const { transactions: newTransactions, land, inventory, balance } = await farmContract.current.methods.harvestAppleSeed(transactions.current, landIndex).call()
      transactions.current = newTransactions;
      console.log({
        newTransactions,
        land,
        inventory,
        balance
      })
      setLand(land)
      setInventory(inventory)
      setBalance(balance)
    } else {
      if (selectedFruit === null) {
        return
      }
      const { transactions: newTransactions, land, inventory, balance } = await farmContract.current.methods.plantAppleSeed(transactions.current, landIndex).call()
      transactions.current = newTransactions;
      console.log({
        newTransactions,
        land,
        inventory,
        balance
      })
      setLand(land)
      setInventory(inventory)
      setBalance(balance)
    }

    setSelectedFruit(null)
  }


  return (
    <div className='text-monospace'>
      <div className="container-fluid mt-5 text-center">
        <h1>Welcome to Fruit Market</h1>
        <h2>{account}</h2>
        <h4>{balance}</h4>
        <br></br>
      </div>
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

