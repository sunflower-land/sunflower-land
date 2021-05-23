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

  describe('purchase more fields', () => {
    it('should throw an error when not enough money to buy space', async () => {
      await farm.createFarm({ from: user })

      try {
        await farm.buyMoreSpace([], { from: user });
      } catch (error) {
        // TODO fix this strange number!
        expect(error.message).to.contain('Not enough money to buy new fields')
      }
    })

    it('should buy more space', async () => {
      farm = await getFarmWithFMC(10000)
      await farm.createFarm({ from: user })

      let land = await farm.getLand({ from: user })
      expect(land.length).to.eq(5)

      await farm.buyMoreSpace([], { from: user });

      land = await farm.getLand({ from: user })
      expect(land.length).to.eq(7)
    })
  })

  describe('fruit', () => {
    it('should plant apple', async () => {
      farm = await getFarmWithFMC(10000)

      await farm.createFarm({ from: user })

      let land = await farm.getLand({ from: user })
      expect(land[0].commodity).to.eq('0')

      const response = await farm.plant([], 1, 0, { from: user })
      expect(response.land[0]).to.be.eq('1')
      expect(response.balance).to.be.eq('9900')
    })

    it('should throw an error when a user does not have enough money for apples to plant', async () => {
      await farm.createFarm({ from: user })

      try {
        await farm.plant([], 1, 0, { from: user })
      } catch (error) {
        expect(error.message).to.contain('Not enough money to buy seeds')
      }
    })

    it('should harvest apples', async () => {
      farm = await getFarmWithFMC(10000)
      await farm.createFarm({ from: user })

      const planted = await farm.plant([], 1, 0, { from: user })

      let land = await farm.getLand({ from: user })
      expect(land[0].commodity).to.eq('1')

      const transactions = planted.transactions
      // Advance in time 
      await advanceTimeAndBlock(600000);


      const response = await farm.harvest(transactions, 1, 0, { from: user })
      expect(response.balance).to.be.eq('10100')
      expect(response.land[0].commodity).to.eq('0')
    })

    it('should not harvest non-ripe apples', async () => {
      farm = await getFarmWithFMC(10000)
      
      await farm.createFarm({ from: user })
      const planted = await farm.plant([], 1, 0, { from: user })
      const transactions = planted.transactions

      try {
        await farm.harvest(transactions, 1, 0, { from: user })
      } catch (error) {
        expect(error.message).to.contain('The fruit is not ripe')
      }
    })
  })
})
