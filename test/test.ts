import chai from 'chai'
import { TokenContract, FarmContract, FarmInstance, TokenInstance } from '../types/truffle-contracts'

import { advanceBlock, advanceTimeAndBlock, takeSnapshot, revertToSnapShot } from './helpers'
const Token: TokenContract = artifacts.require('Token')
const Farm: FarmContract = artifacts.require('Farm')

chai.use(require('chai-as-promised'))
  .should()


contract('farm', ([deployer, user]) => {
  let farm: FarmInstance
  let token: TokenInstance
  let snapshotId: string

  async function getFarmWithFMC(amount: number): Promise<FarmInstance> {
    token = await (Token as TokenContract).new()
    token.mint(user, amount)
    farm = await Farm.new(token.address)
    await token.passMinterRole(farm.address, {from: deployer})

    return farm
  }


  beforeEach(async () => {
    // const snapShot: any = await takeSnapshot();
    // snapshotId = snapShot['result'];

    token = await (Token as TokenContract).new()
    farm = await Farm.new(token.address)
    await token.passMinterRole(farm.address, {from: deployer})
  })

  afterEach(async() => {
      // await revertToSnapShot(snapshotId);
  });

  describe('testing token contract...', () => {
    describe('success', () => {
      it('checking token name', async () => {
        expect(await token.name()).to.be.eq('Fruit Market Coin')
      })

      it('checking token symbol', async () => {
        expect(await token.symbol()).to.be.eq('FMC')
      })

      it('checking token initial total supply', async () => {
        expect(Number(await token.totalSupply())).to.eq(0)
      })

      it('farm should have Token minter role', async () => {
        expect(await token.minter()).to.eq(farm.address)
      })
    })

    describe('failure', () => {
      it('passing minter role should be rejected', async () => {
        try {
          await token.passMinterRole(user, {from: deployer})
        } catch (e) {
          expect(e.message).to.contain('You are not minter')
        }
      })

      it('tokens minting should be rejected', async () => {
        try {
          await token.mint(user, '1', {from: deployer})
        } catch (e) {
          expect(e.message).to.contain('You are not the minter')
        }
      })
    })
  })

  describe('sync', () => {
    it.only('should increase the balance', async () => {
      await farm.createFarm({ from: user })

      let balance = await farm.getBalance({ from: user })
      expect(balance.toNumber()).to.eq(0)

      const response = await farm.sell([], 0, { from: user })
      const transactions = response[0].transactions

      await farm.sync(transactions, { from: user });

      balance = await farm.getBalance({ from: user })
      expect(balance.toNumber()).to.eq(100)
    })

    it.only('should decrease the balance', async () => {
      farm = await getFarmWithFMC(10000)
      await farm.createFarm({ from: user })

      let balance = await farm.getBalance({ from: user })
      expect(balance.toNumber()).to.eq(0)

      const response = await farm.buy([], 0, { from: user })
      const transactions = response[0].transactions

      await farm.sync(transactions, { from: user });

      balance = await farm.getBalance({ from: user })
      expect(balance.toNumber()).to.eq(9900)
    })
  })

  describe('apples', () => {
    it('should buy apple', async () => {
      farm = await getFarmWithFMC(10000)

      await farm.createFarm({ from: user })
      let myFarm = await farm.getInventory({ from: user })

      expect(myFarm.apples).to.eq('1')

      const response = await farm.buy([], 1, { from: user })
      expect(response[0].inventory.apples).to.be.eq('2')
      expect(response[0].balance).to.be.eq('9900')
    })

    it('should throw an error when a user does not have enough money for apples', async () => {
      await farm.createFarm({ from: user })

      try {
        await farm.buy([], 1, { from: user })
      } catch (error) {
        expect(error.message).to.contain('Not enough money to buy seeds')
      }
    })

    it('should sell apple', async () => {
      await farm.createFarm({ from: user })
      let myFarm = await farm.getInventory({ from: user })

      expect(myFarm.apples).to.eq('1')

      const response = await farm.sell([], 1, { from: user })
      expect(response[0].inventory.apples).to.be.eq('0')
      expect(response[0].balance).to.be.eq('100')
    })

    it('should throw an error when a user does not have enough apple seeds to sell', async () => {
      await farm.createFarm({ from: user })

      try {
        const response = await farm.sell([], 1, { from: user })
        const transactions = response[0].transactions
        await farm.sell(transactions, 1, { from: user })
      } catch (error) {
        expect(error.message).to.contain('No seeds to sell')
      }
    })

    it('should plant apples', async () => {
      await farm.createFarm({ from: user })
      let myFarm = await farm.getInventory({ from: user })

      expect(myFarm.apples).to.eq('1')

      const response = await farm.plant([], 1, 0, { from: user })
      expect(response.inventory.apples).to.be.eq('0')
    })

    it('should throw an error when a user does not have enough apple seeds to plant', async () => {
      await farm.createFarm({ from: user })

      try {
        const response = await farm.plant([], 1, 0, { from: user })
        const transactions = response.transactions
        await farm.plant(transactions, 1, 0, { from: user })
      } catch (error) {
        expect(error.message).to.contain('Not enough seeds to plant')
      }
    })

    it('should harvest apples', async () => {
      await farm.createFarm({ from: user })
      const planted = await farm.plant([], 1, 0, { from: user })
      const transactions = planted.transactions
      // Advance in time 
      await advanceTimeAndBlock(600000);

      const response = await farm.harvest(transactions, 1, 0, { from: user })
      expect(response.inventory.apples).to.be.eq('2')
    })

    it('should not harvest non-ripe apples', async () => {
      await farm.createFarm({ from: user })
      const planted = await farm.plant([], 1, 0, { from: user })
      const transactions = planted.transactions

      try {
        await farm.harvest(transactions, 1, 0, { from: user })
      } catch (error) {
        expect(error.message).to.contain('The fruit is not ripe')
      }
    })

    it('should throw an error when a user does not have enough apple seed to harvest', async () => {
      await farm.createFarm({ from: user })

      try {
        await farm.harvest([], 1, 0, { from: user })
      } catch (error) {
        expect(error.message).to.contain('No fruit exists')
      }
    })
  })

  describe('market', () => {
    it('should not move the apple market', async () => {
      farm = await getFarmWithFMC(10000)

      await farm.createFarm({ from: user })
      let prices = await farm.getPrices({ from: user })

      expect(prices.apples).to.eq('100')
      expect(prices.avocados).to.eq('400')

      let currentFarm = await farm.buy([], 1, { from: user })
      currentFarm = await farm.buy(currentFarm[0].transactions, 1, { from: user })
      await farm.sync(currentFarm[0].transactions, { from: user })

      prices = await farm.getPrices({ from: user })
      expect(prices.apples).to.be.eq('100')
      expect(prices.avocados).to.eq('420')
    })

    it('should move the avocado market down', async () => {
      farm = await getFarmWithFMC(10000)

      await farm.createFarm({ from: user })
      let prices = await farm.getPrices({ from: user })

      expect(prices.avocados).to.eq('400')

      let currentFarm = await farm.buy([], 1, { from: user })
      currentFarm = await farm.buy(currentFarm[0].transactions, 1, { from: user })
      await farm.sync(currentFarm[0].transactions, { from: user })

      prices = await farm.getPrices({ from: user })
      expect(prices.avocados).to.be.eq('380')

      currentFarm = await farm.buy([], 1, { from: user })
      currentFarm = await farm.buy(currentFarm[0].transactions, 1, { from: user })
      await farm.sync(currentFarm[0].transactions, { from: user })

      // Should be proportionally less since people have been trading
      prices = await farm.getPrices({ from: user })
      expect(prices.avocados).to.be.eq('372')
    })
  })
})
