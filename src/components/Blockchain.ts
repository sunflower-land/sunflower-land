import { Contract } from 'web3-eth-contract';
import Web3 from 'web3';

import Token from '../abis/Token.json'
import Farm from '../abis/Farm.json'
import { TokenInstance } from '../../types/truffle-contracts/Token'
import { FarmInstance } from '../../types/truffle-contracts/Farm'

import { Transaction, Square, Charity  } from './types/contract'

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

export class BlockChain {
    private web3: Web3 | null = null
    private token: any | null = null
    private farm: any | null = null
    private account: string | null = null

    private details: Account = null

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

        this.token = new this.web3.eth.Contract(Token.abi as any, '0x1c6227e91e4d3a81f56c1c2bD8250A69C7df4e2F')
        this.farm = new this.web3.eth.Contract(Farm.abi as any, '0xa4dFCE9ae06D1574A3672DF56cf84c82B7A6E8df')

        //const maticAccounts = await web3.eth.getAccounts()
        this.account = '0xd94A0D37b54f540F6FB93c5bEcbf89b84518D621'//maticAccounts[0]
    }

    public get isConnected() {
        return !!this.farm
    }

    public get hasFarm() {
        return this.details && this.details.farm.length > 0
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
        } else {
            console.log('No web3 available')
        }
    }

    public async initialise() {
        console.log('Run it')
        try {
        await this.setupWeb3()
        const chain = await this.web3.eth.net.getNetworkType()
        const chainId = await this.web3.eth.getChainId()

        console.log({ chain })
        console.log({ chainId })
        if (chainId === 80001) {
            await this.connectToMatic()

            this.details = await this.getAccount()
        }
        console.log('Resolved')
        }catch(e) {
            console.error(e)
            throw e
        }
    }

    // TODO add charity support
    public createFarm(charity: Charity) {
        console.log({ charity })
        const value = this.web3.utils.toWei('0.01', 'ether')
        console.log({ value })

        return new Promise((resolve, reject) => {
            this.farm.methods.createFarm(charity).send({from: this.account, value, to: charity })
            .on('error', function(error){
                console.log({ error })
                // User rejected
                if (error.code === 4001) {
                    return resolve(null)
                }
                reject(error)
            })
            .on('transactionHash', function(transactionHash){
                console.log({ transactionHash })
            })
            .on('receipt', function(receipt) {
                console.log({ receipt })
                resolve(receipt)
            })
            // .on('confirmation', function(confirmationNumber, receipt) {
            //     console.log({ receipt })
            //     resolve(receipt)
            // })
            console.log('Done')
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
        return new Promise((resolve, reject) => {
            this.farm.methods.sync(events).send({from: this.account})
            .on('error', function(error){
                console.log({ error })
                // User rejected
                if (error.code === 4001) {
                    return resolve(null)
                }
                reject(error)
            })
            .on('transactionHash', function(transactionHash){
                console.log({ transactionHash })
            })
            .on('receipt', function(receipt) {
                console.log({ receipt })
                resolve(receipt)
            })
            console.log('Done')
        })

    }

    public levelUp() {
        return new Promise((resolve, reject) => {
            this.farm.methods.levelUp().send({from: this.account})
            .on('error', function(error){
                console.log({ error })
                // User rejected
                if (error.code === 4001) {
                    return resolve(null)
                }
                reject(error)
            })
            .on('transactionHash', function(transactionHash){
                console.log({ transactionHash })
            })
            .on('receipt', function(receipt) {
                console.log({ receipt })
                resolve(receipt)
            })
            console.log('Done')
        })
    }

    public async getAccount(): Promise<Account> {
        if (!this.web3) {
            return {
                farm: [],
                balance: 0,
            }
        }

        const rawBalance = await this.token.methods.balanceOf(this.account ).call({ from: this.account })
        const farm = await this.farm.methods.getLand().call({ from: this.account })
        
        const balance = this.web3.utils.fromWei(rawBalance.toString())
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
