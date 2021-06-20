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

enum Charity {
    WaterProject = '0x060697E9d4EEa886EbeCe57A974Facd53A40865BA',
    Heifer = '0xD3F81260a44A1df7A7269CF66Abd9c7e4f8CdcD1',
    CoolEarth = '0x3c8cB169281196737c493AfFA8F49a9d823bB9c5',
}

export class BlockChain {
    private web3: Web3 | null = null
    private token: any | null = null
    private farm: any | null = null
    private account: string | null = null

    private async connectToGanache() {
        const netId = await this.web3.eth.net.getId();
        console.log({ netId })
        const accounts = await this.web3.eth.requestAccounts()
        this.account = accounts[0]

        console.log({ netId })
        this.token = new this.web3.eth.Contract(Token.abi as any, Token.networks[netId].address)

        const farmAddress = Farm.networks[netId].address
        this.farm = new this.web3.eth.Contract(Farm.abi as any, farmAddress)
    }

    private async connectToMatic(){

        // web3.eth.defaultAddress = '0xd94A0D37b54f540F6FB93c5bEcbf89b84518D621'
        // web3.eth.handleRevert = true

        this.token = new this.web3.eth.Contract(Token.abi as any, '0x768789dEa31Ae549CE9F4eAC41F51100671597fC')
        this.farm = new this.web3.eth.Contract(Farm.abi as any, '0x56a361c7E873ECD7AC48057eccA404Fa747D987a')

        //const maticAccounts = await web3.eth.getAccounts()
        this.account = '0xd94A0D37b54f540F6FB93c5bEcbf89b84518D621'//maticAccounts[0]
    }

    private async setupWeb3() {
        if ((window as any).ethereum) {
            try{
                // Request account access if needed
                await (window as any).ethereum.enable();
                this.web3 = new Web3((window as any).ethereum);
            }
            catch (error) {
                // User denied account access...
                console.error(error)
            }
        } else if ((window as any).web3) {
            this.web3 = new Web3((window as any).web3.currentProvider);
        }
    }

    public async initialise() {
        await this.setupWeb3()
        const chain = await this.web3.eth.net.getNetworkType()
        const chainId = await this.web3.eth.getChainId()

        console.log({ chain })
        console.log({ chainId })
        if (chainId === 80001) {
            await this.connectToMatic()
        } else {
            await this.connectToGanache()
        }
    }

    // TODO add charity support
    public createFarm() {
        const value = this.web3.utils.toWei('2', 'ether')
        console.log({ value })
        this.farm.methods.createFarm(Charity.CoolEarth).send({from: this.account, value, to: Charity.CoolEarth })

        // Better polling method - https://medium.com/metamask/calling-a-smart-contract-with-a-button-d278b1e76705
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
        // try {
        //     const response = this.farm.methods.buildFarm(events).call({from: this.account})
        //     console.log({ response })
        //   } catch (e) {
        //       const errorJSON = e.message.slice(25)
        //       console.log({ errorJSON })
        // }
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

    public getWeb3() {
        return this.web3
    }
}
