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
    token.mint(user, 100)
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
    describe('success', () => {
      it('should create a farm', async () => {
        let myFarm = await farm.getInventory({ from: user })
        expect(myFarm).to.eql([false, "0", "0"])
        await farm.createFarm({ from: user })

        myFarm = await farm.getInventory({ from: user })
        expect(myFarm).to.eql([true, "1", "0"])

        const myLand = await farm.getLand({ from: user })
        expect(myLand).to.eql([["2", "0"]])
      })

      it('should sell seeds', async () => {
        await farm.createFarm({ from: user })
        let myFarm = await farm.getInventory({ from: user })
        expect(myFarm.apples).to.be.eq('1')

        // TODO enum types
        await farm.sync([{
            action: 1,
            commodity: 0,
            timestamp: Date.now(),
            landIndex: 0,
        }], { from: user })

        myFarm = await farm.getInventory({ from: user })
        expect(myFarm.apples).to.be.eq('0')
      })

      it('should throw an error when selling too many seeds', async () => {
        await farm.createFarm({ from: user })
        let myFarm = await farm.getInventory({ from: user })
        expect(myFarm.apples).to.be.eq('1')

        try {
          await farm.sync([{
              action: 1,
              commodity: 0,
              timestamp: Date.now(),
              landIndex: 0,
          }], { from: user })
        } catch (error) {
          expect(error.message).to.contain('You do not have enough apple seeds')
        }
      })
    })
  })

  describe('actions', () => {
    it('should buy apple', async () => {
      farm = await getFarmWithFMC(100)

      await farm.createFarm({ from: user })
      let myFarm = await farm.getInventory({ from: user })

      expect(myFarm.apples).to.eq('1')

      const response = await farm.buyAppleSeed([], { from: user })
      expect(response[0].inventory.apples).to.be.eq('2')
    })

    it('should throw an error when a user does not have enough money for apples', async () => {
      await farm.createFarm({ from: user })

      try {
        await farm.buyAppleSeed([], { from: user })
      } catch (error) {
        expect(error.message).to.contain('You do not have enough money to buy apples')
      }
    })

    it('should sell apple', async () => {
      await farm.createFarm({ from: user })
      let myFarm = await farm.getInventory({ from: user })

      expect(myFarm.apples).to.eq('1')

      const response = await farm.sellAppleSeed([], { from: user })
      expect(response[0].inventory.apples).to.be.eq('0')
    })

    it('should throw an error when a user does not have enough apple seeds to sell', async () => {
      await farm.createFarm({ from: user })

      try {
        const response = await farm.sellAppleSeed([], { from: user })
        const transactions = response[0].transactions
        await farm.sellAppleSeed(transactions, { from: user })
      } catch (error) {
        expect(error.message).to.contain('No apples to sell')
      }
    })

    it('should plant apples', async () => {
      await farm.createFarm({ from: user })
      let myFarm = await farm.getInventory({ from: user })

      expect(myFarm.apples).to.eq('1')

      const response = await farm.plantAppleSeed([], 0, { from: user })
      expect(response.inventory.apples).to.be.eq('0')
    })

    it('should throw an error when a user does not have enough apple seeds to plant', async () => {
      await farm.createFarm({ from: user })

      try {
        const response = await farm.plantAppleSeed([], 2, { from: user })
        const transactions = response.transactions
        await farm.plantAppleSeed(transactions, 3, { from: user })
      } catch (error) {
        expect(error.message).to.contain('Not enough apple seeds to plant')
      }
    })

    it('should harvest apples', async () => {
      await farm.createFarm({ from: user })
      const planted = await farm.plantAppleSeed([], 0, { from: user })
      const transactions = planted.transactions
      // Advance in time 
      await advanceTimeAndBlock(600000);

      const response = await farm.harvestAppleSeed(transactions, 0, { from: user })
      expect(response.inventory.apples).to.be.eq('2')
    })

    it('should not harvest non-ripe apples', async () => {
      await farm.createFarm({ from: user })
      const planted = await farm.plantAppleSeed([], 0, { from: user })
      const transactions = planted.transactions

      try {
        await farm.harvestAppleSeed(transactions, 0, { from: user })
      } catch (error) {
        expect(error.message).to.contain('You do not have any apples ripe for harvest')
      }
    })

    it('should throw an error when a user does not have enough apple seed to harvest', async () => {
      await farm.createFarm({ from: user })

      try {
        await farm.harvestAppleSeed([], 0, { from: user })
      } catch (error) {
        expect(error.message).to.contain('That is not an apple')
      }
    })
  })

  describe('market', () => {
    it('should move the avocado market', async () => {
      farm = await getFarmWithFMC(100)

      await farm.createFarm({ from: user })
      let myFarm = await farm.getInventory({ from: user })

      expect(myFarm.apples).to.eq('1')

      const response = await farm.buyAppleSeed([], { from: user })
      expect(response[0].inventory.apples).to.be.eq('2')
    })
  })
})
