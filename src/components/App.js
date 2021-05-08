import { Tabs, Tab } from 'react-bootstrap'
import Farm from '../abis/Farm.json'
import React, { Component } from 'react';
import Token from '../abis/Token.json'
import dbank from '../dbank.png';
import Web3 from 'web3';
import './App.css';

//h0m3w0rk - add new tab to check accrued interest

function tupleToFarm(farm) {
  const [isInitialized, appleSeeds, avocadoSeeds, plantedApples] = farm

  return {
    isInitialized,
    appleSeeds: Number(appleSeeds),
    avocadoSeeds: Number(avocadoSeeds),
    plantedApples: plantedApples,
  }
}

function tupleToPriceHistory(priceHistory) {
  const [timestamp, price] = priceHistory

  return {
    timestamp: timestamp,
    value: Number(price),
  }
}
class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    if (typeof window.ethereum !== 'undefined') {
      //check if MetaMask exists
      const web3 = new Web3(window.ethereum);
      const netId = await web3.eth.net.getId();
      const accounts = await web3.eth.requestAccounts()
      //const balance = await web3.eth.getBalance(accounts[0])
      const account = accounts[0]
      this.setState({
        account, web3
      })

      console.log('Setup: ', accounts[0])

      const token = new web3.eth.Contract(Token.abi, Token.networks[netId].address)
      const farmAddress = Farm.networks[netId].address
      const farmContract = new web3.eth.Contract(Farm.abi, farmAddress)
      const balance = await token.methods.balanceOf(account).call()
      this.setState({ token, balance: Number(balance), farmContract, farmAddress})
      const tuple = await farmContract.methods.getMyFarm().call({from: account })
      console.log('My farm: ', tuple)
      const farm = tupleToFarm(tuple)

      this.getPrices()

      if (farm.isInitialized) {
        this.setState({
          farm,
        })
      }
    } else {
      window.alert('Please install metamask')
    }


    //if MetaMask not exists push alert
  }

  async getPrices () {
    const applePriceHistory = await this.state.farmContract.methods.getApplePrice().call()
    const avocadoPriceHistory = await this.state.farmContract.methods.getAvocadoPrice().call()

    this.setState({
      prices: {
        apples: tupleToPriceHistory(applePriceHistory),
        avocados: tupleToPriceHistory(avocadoPriceHistory),
      }
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      farm: null,
      balance: 0,
      farmAddress: null,
      farm: null,
      transactions: [],
      prices: null
    }
  }

  async onCreateFarm () {
    await this.state.farmContract.methods.createFarm().send({from: this.state.account})
    const tuple = await this.state.farmContract.methods.getMyFarm().call({from: this.state.account })
    console.log('Response', tuple)
    const farm = tupleToFarm(tuple)
    this.setState({ farm, transactions: [] })
  }

  async onBuyApple () {
    const priceHistory = this.state.prices.apples
    const value = 1
    const transaction = {
      action: 0,
      commodity: 0,
      value,
      timestamp: priceHistory.timestamp,
    }


    const total = priceHistory.value * value;
    const balance = this.state.balance - total;

    this.setState((previous) => ({
      transactions: [...previous.transactions, transaction],
      balance,
      farm: {
        ...previous.farm,
        appleSeeds: previous.farm.appleSeeds + 1,
      }
    }))
  }

  async onSellApple () {
    const priceHistory = this.state.prices.apples
    const value = 1
    const transaction = {
      action: 1,
      commodity: 0,
      value,
      timestamp: priceHistory.timestamp,
    }


    const total = priceHistory.value * value;
    const balance = this.state.balance + total;

    this.setState((previous) => ({
      transactions: [...previous.transactions, transaction],
      balance,
      farm: {
        ...previous.farm,
        appleSeeds: previous.farm.appleSeeds - 1,
      }
    }))
  }

  async onPlantApple() {
    const value = 1
    const transaction = {
      action: 2,
      commodity: 0,
      value,
      timestamp: Date.now(),
    }


    this.setState((previous) => ({
      transactions: [...previous.transactions, transaction],
      farm: {
        ...previous.farm,
        appleSeeds: previous.farm.appleSeeds - 1,
        plantedApples: [...previous.farm.plantedApples, {
          timestamp: Date.now(),
          value: 1,
        }]
      }
    }))
  }

  async onHarvestApple() {
    const value = 1
    const transaction = {
      action: 3,
      commodity: 0,
      value,
      timestamp: Date.now(),
    }


    this.setState((previous) => ({
      transactions: [...previous.transactions, transaction],
      farm: {
        ...previous.farm,
        appleSeeds: previous.farm.appleSeeds - 1,
        plantedApples: []
      }
    }))
  }

  async onSync () {
    console.log('Send: ', JSON.stringify(this.state.transactions))
    await this.state.farmContract.methods.update(this.state.transactions).send({from: this.state.account})
    
  }

  render() {
    return (
      <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
        <img src={dbank} className="App-logo" alt="logo" height="32"/>
          <b>Farm</b>
        </a>
        </nav>
        <div className="container-fluid mt-5 text-center">
        <br></br>
          <h1>Welcome to Fruit Market</h1>
          <h2>{this.state.account}</h2>
          <h4>{this.state.balance}</h4>
          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                Balance: {this.state.balance}
                {
                  this.state.prices && (
                    <pre>
                      {JSON.stringify(this.state.prices, null, 2)}
                    </pre>
                  )
                }
                {
                  !this.state.farm && (
                    <div>
                        You do not have a farm
                        <button type='submit' onClick={() => this.onCreateFarm()}>
                          Create a farm
                        </button>
                    </div>
                  )
                }
                {
                  this.state.farm && (
                    <>
                      <pre>
                        {JSON.stringify(this.state.farm, null, 2)}
                      </pre>
                      <div className="row">
                        <div className="col-md-6">
                          <img width='60' src="https://i.pinimg.com/originals/47/7b/a8/477ba82d1e6e5823268654a84ce5ce11.png" />
                          <button onClick={() => this.onBuyApple()}>
                            Buy
                          </button>
                          <button onClick={() => this.onSellApple()}>
                            Sell
                          </button>
                          <button onClick={() => this.onPlantApple()}>
                            Plant
                          </button>
                          <button onClick={() => this.onHarvestApple()}>
                            Harvest
                          </button>
                        </div>
                        <div class="col-md-6">
                          <img width='60' src="https://img.icons8.com/emoji/452/avocado-emoji.png" />
                          <button>
                            Buy
                          </button>
                          <button>
                            Sell
                          </button>
                        </div>
                        <div class="row" style={{width: '100%'}}>
                          <div className="col-md-12">
                            {
                              <pre>Transactions: {this.state.transactions.length}</pre>
                            }
                            <button onClick={() => this.onSync()}>
                              Sync
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )
                }


              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
