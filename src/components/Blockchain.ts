import { Contract } from 'web3-eth-contract';
import Web3 from 'web3';

import Token from '../abis/Token.json'
import Farm from '../abis/Farm.json'
import { TokenInstance } from '../../types/truffle-contracts/Token'
import { FarmInstance } from '../../types/truffle-contracts/Farm'

import { Transaction, Square  } from './types/contract'

interface TokenContract extends Contract {
  methods: TokenInstance
}

interface FarmContract extends Contract {
  methods: FarmInstance
}

interface Account {
    farm: Square[]
    balance: number
}

/* GANACHE
          //check if MetaMask exists
        //const web3 = new Web3((window as any).ethereum);
        // try{
        //   // Request account access if needed
        //   await ethereum.enable();
        // } catch (error){
        //   // User denied account access...
        // }
        // const netId = await web3.eth.net.getId();
        // console.log({ netId })
        // const accounts = await web3.eth.requestAccounts()
        // // TODO set account
        // const account = accounts[0]
        // setAccount(account)

  
        //tokenContract.current = new web3.eth.Contract(Token.abi as any, Token.networks[netId].address)
        //tokenContract.current = new web3.eth.Contract(Token.abi as any, '0x2427d3AceE848B07FC67e40223B0fc22589C7b24')

        //const farmAddress = Farm.networks[netId].address
        //const farmAddress = '0x90002454c2A76E5E61eBEDBd3a92fBacbD246365'
        //farmContract.current = new web3.eth.Contract(Farm.abi as any, farmAddress)
*/
export class BlockChain {
    private token: any | null = null
    private farm: any | null = null
    private account: string | null = null

    public async initialise() {
        let web3: Web3
        if ((window as any).ethereum) {
            web3 = new Web3((window as any).ethereum);
            try{
                // Request account access if needed
                await (window as any).ethereum.enable();
            }
            catch (error) {
                // User denied account access...
                console.error(error)
            }
        } else if ((window as any).web3) {
            web3 = new Web3((window as any).web3.currentProvider);
        }
        // web3.eth.defaultAddress = '0xd94A0D37b54f540F6FB93c5bEcbf89b84518D621'
        // web3.eth.handleRevert = true

        this.token = new web3.eth.Contract(Token.abi as any, '0x768789dEa31Ae549CE9F4eAC41F51100671597fC')
        this.farm = new web3.eth.Contract(Farm.abi as any, '0x56a361c7E873ECD7AC48057eccA404Fa747D987a')

        //const maticAccounts = await web3.eth.getAccounts()
        this.account = '0xd94A0D37b54f540F6FB93c5bEcbf89b84518D621'//maticAccounts[0]
    }

    public createFarm() {
        this.farm.methods.createFarm().send({from: this.account})

        return new Promise((resolve) => {
            this.farm.events.FarmCreated({
                filter: { _address: this.account },
            }, function(error: string, event: string){
                console.log(event)
            })
            .on('data', async function (){
                resolve(null)
            })
        })
    }

    public save(events: Transaction[]) {
        try {
            const response = this.farm.methods.buildFarm(events).call({from: this.account})
            console.log({ response })
          } catch (e) {
              const errorJSON = e.message.slice(25)
              console.log({ errorJSON })
        }
        try {
            this.farm.methods.sync(events).send({from: this.account})
          } catch (e) {
              const errorJSON = e.message.slice(25)
              console.log({ errorJSON })
        }

        return new Promise( (resolve) => {
            this.farm.events.FarmSynced({
                filter: { _address: this.account },
            }, function(error: string, event: string){
                console.log(event)
            })
            .on('data', async function (){
                resolve(null)
            })
            .on('changed', async function (){
                console.log('changed')
                resolve(null)
            })
            .on('error', async function (){
                console.log('error')
                resolve(null)
            })
        })
    }

    public levelUp() {
        this.farm.methods.levelUp().send({from: this.account})

        return new Promise( (resolve) => {
            this.farm.events.FarmSynced({
                filter: { _address: this.account },
            }, function(error: string, event: string){
                console.log(event)
            })
            .on('data', async function (){
                resolve(null)
            })
        })
    }

    public async getAccount(): Promise<Account> {
        const balance = await this.token.methods.balanceOf(this.account ).call({ from: this.account })
        const farm = await this.farm.methods.getLand().call({ from: this.account })

        return {
            balance: Number(balance),
            farm,
        }

    }

    public async getMarketConversion(): Promise<number> {
        return await this.farm.methods.getMarketPrice(1).call({ from: this.account })
    }
}
