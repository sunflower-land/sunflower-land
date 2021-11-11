import Web3 from "web3";

import Token from "../abis/Token.json";
import Farm from "../abis/Farm.json";
import Axe from "../abis/Axe.json";
import Wood from "../abis/Wood.json";
import Pickaxe from "../abis/Pickaxe.json";
import Stone from "../abis/Stone.json";

import {
  Transaction,
  Square,
  Charity,
  Fruit,
  Donation,
} from "./types/contract";
import { Inventory, Recipe } from "./types/crafting";

interface Account {
  farm: Square[];
  balance: number;
  id: string;
}

export class BlockChain {
  private web3: Web3 | null = null;
  private alchemyWeb3: Web3 | null = null;
  private token: any | null = null;
  private axe: any | null = null;
  private wood: any | null = null;
  private stone: any | null = null;
  private pickaxe: any | null = null;
  private alchemyToken: any | null = null;
  private farm: any | null = null;
  private alchemyFarm: any | null = null;
  private account: string | null = null;
  private details: Account = null;
  private inventory: Inventory = null;

  private events: Transaction[] = [];

  private isTrialAccount: boolean = false;

  private async connectToMumbai() {
    this.token = new this.web3.eth.Contract(
      Token as any,
      "0x8B0e84C5D75C9b489119bde5fA9136212C7e86A8"
    );
    this.farm = new this.web3.eth.Contract(
      Farm as any,
      "0x84a23593ba916aDACA311A19a0648e6f8cc90612"
    );

    const maticAccounts = await this.web3.eth.getAccounts();
    this.account = maticAccounts[0];
  }

  private async connectToMatic() {
    try {
      this.token = new this.web3.eth.Contract(
        Token as any,
        "0xdf9B4b57865B403e08c85568442f95c26b7896b0"
      );
      this.farm = new this.web3.eth.Contract(
        Farm as any,
        "0x6e5Fa679211d7F6b54e14E187D34bA547c5d3fe0"
      );
      const maticAccounts = await this.web3.eth.getAccounts();
      this.account = maticAccounts[0];

      this.alchemyWeb3 = new Web3(
        "https://polygon-mainnet.g.alchemy.com/v2/XuJyQ4q2Ay1Ju1I7fl4e_2xi_G2CmX-L"
      );
      this.alchemyToken = new this.alchemyWeb3.eth.Contract(
        Token as any,
        "0xdf9B4b57865B403e08c85568442f95c26b7896b0"
      );
      this.alchemyFarm = new this.alchemyWeb3.eth.Contract(
        Farm as any,
        "0x6e5Fa679211d7F6b54e14E187D34bA547c5d3fe0"
      );
      this.axe = new this.alchemyWeb3.eth.Contract(
        Axe as any,
        "0xc65C99E4c3AAb25322d4E808e5e96Ec774330696"
      );
      this.wood = new this.alchemyWeb3.eth.Contract(
        Wood as any,
        "0xC8A6fFc3720867470A2395D1634B3085BbDDf71a"
      );
      this.stone = new this.alchemyWeb3.eth.Contract(
        Stone as any,
        "0xE11e8ff4D9C10A7E4524e8fE6b4F1F3E8665eDCE"
      );
      this.pickaxe = new this.alchemyWeb3.eth.Contract(
        Pickaxe as any,
        "0x526439FCCd9494b61F9CfaA0c287Cb04a30F2D3f"
      );
    } catch (e) {
      // Timeout, retry
      if (e.code === "-32005") {
        console.error("Retrying...");
        await new Promise((res) => window.setTimeout(res, 3000));
      } else {
        console.error(e);
        throw e;
      }
    }
  }

  public get isConnected() {
    return this.isTrial || !!this.farm;
  }

  public get hasFarm() {
    return this.details && this.details.farm.length > 0;
  }

  public get myFarm() {
    return this.details;
  }

  private async setupWeb3() {
    if ((window as any).ethereum) {
      try {
        // Request account access if needed
        await (window as any).ethereum.enable();
        this.web3 = new Web3((window as any).ethereum);
      } catch (error) {
        // User denied account access...
        console.error(error);
      }
    } else if ((window as any).web3) {
      this.web3 = new Web3((window as any).web3.currentProvider);
    } else {
      throw new Error("NO_WEB3");
    }
  }

  public async initialise(retryCount = 0) {
    try {
      // It is actually quite fast, we won't to simulate slow loading to convey complexity
      await new Promise((res) => window.setTimeout(res, 1000));
      await this.setupWeb3();
      const chainId = await this.web3.eth.getChainId();

      if (chainId === 137) {
        await this.connectToMatic();

        await this.loadFarm();
      } else if (chainId === 80001) {
        await this.connectToMumbai();

        await this.loadFarm();
      } else {
        throw new Error("WRONG_CHAIN");
      }

      console.log("Resolved");
    } catch (e) {
      // If it is not a known error, keep trying
      if (
        retryCount < 3 &&
        e.message !== "WRONG_CHAIN" &&
        e.message !== "NO_WEB3"
      ) {
        console.log("Try again");
        await new Promise((res) => setTimeout(res, 2000));

        return this.initialise(retryCount + 1);
      }
      console.error(e);
      throw e;
    }
  }

  public async loadFarm() {
    this.details = await this.getAccount();
    this.inventory = await this.loadInventory();
    await this.cacheTotalSupply();
  }

  private async waitForFarm(retryCount: number = 1) {
    const wait = retryCount * 1000;
    await new Promise((res) => setTimeout(res, wait));
    const farm = await this.farm.methods
      .getLand(this.account)
      .call({ from: this.account });

    if (!farm || !farm.length) {
      await this.waitForFarm(retryCount + 1);
    }
  }

  public async createFarm(donation: Donation) {
    const value = this.web3.utils.toWei(donation.value, "ether");

    await new Promise(async (resolve, reject) => {
      const price = await this.web3.eth.getGasPrice();
      const gasPrice = price ? Number(price) * 1 : undefined;

      this.farm.methods
        .createFarm(donation.charity)
        .send({ from: this.account, value, to: donation.charity, gasPrice })
        .on("error", function (error) {
          console.log({ error });
          reject(error);
        })
        .on("transactionHash", function (transactionHash) {
          console.log({ transactionHash });
        })
        .on("receipt", async function (receipt) {
          console.log({ receipt });
          resolve(receipt);
        });
    });

    await this.waitForFarm();

    await this.loadFarm();
  }

  public async save() {
    const blockChain = this;

    if (this.isTrial) {
      throw new Error("TRIAL_MODE");
    }

    await new Promise(async (resolve, reject) => {
      const price = await this.web3.eth.getGasPrice();
      const gasPrice = price ? Number(price) * 1 : undefined;
      console.log(new Date().getTime());
      console.log({ events: this.events });
      console.log({ farm: this.myFarm });
      this.farm.methods
        .sync(this.events)
        .send({ from: this.account, gasPrice })
        .on("error", function (error) {
          console.log({ error });
          // User rejected
          if (error.code === 4001) {
            return resolve(null);
          }

          reject(error);
        })
        .on("transactionHash", function (transactionHash) {
          console.log({ transactionHash });
        })
        .on("receipt", function (receipt) {
          console.log({ receipt });
          blockChain.events = [];
          resolve(receipt);
        });
    });

    await this.loadFarm();
  }

  public async levelUp() {
    if (this.isTrial) {
      throw new Error("TRIAL_MODE");
    }

    await new Promise(async (resolve, reject) => {
      const price = await this.web3.eth.getGasPrice();
      const gasPrice = price ? Number(price) * 1 : undefined;

      this.farm.methods
        .levelUp()
        .send({ from: this.account, gasPrice })
        .on("error", function (error) {
          console.log({ error });
          // User rejected
          if (error.code === 4001) {
            return resolve(null);
          }
          reject(error);
        })
        .on("transactionHash", function (transactionHash) {
          console.log({ transactionHash });
        })
        .on("receipt", async function (receipt) {
          console.log({ receipt });
          resolve(receipt);
        });
    });

    await this.loadFarm();
  }

  private async getAccount(): Promise<Account> {
    if (!this.web3 || this.isTrial) {
      return {
        farm: [
          {
            createdAt: 0,
            fruit: Fruit.None,
          },
          {
            createdAt: 0,
            fruit: Fruit.Sunflower,
          },
          {
            createdAt: 0,
            fruit: Fruit.Sunflower,
          },
          {
            createdAt: 0,
            fruit: Fruit.Sunflower,
          },
          {
            createdAt: 0,
            fruit: Fruit.None,
          },
        ],
        balance: 0,
        id: this.account,
      };
    }

    const rawBalance = await this.alchemyToken.methods
      .balanceOf(this.account)
      .call({ from: this.account });
    const farm = await this.alchemyFarm.methods
      .getLand(this.account)
      .call({ from: this.account });

    const balance = this.web3.utils.fromWei(rawBalance.toString());
    return {
      balance: Number(balance),
      farm,
      id: this.account,
    };
  }

  public async craft({ recipe, amount }: { recipe: Recipe; amount: number }) {
    const blockChain = this;

    if (this.isTrial) {
      throw new Error("TRIAL_MODE");
    }

    console.log({ recipe, amount });

    const gwei = this.web3.utils.toWei(amount.toString(), "ether");

    await new Promise(async (resolve, reject) => {
      this.farm.methods
        .craft(recipe.address, gwei)
        .send({ from: this.account })
        .on("error", function (error) {
          console.log({ error });
          // User rejected
          if (error.code === 4001) {
            return resolve(null);
          }

          reject(error);
        })
        .on("transactionHash", function (transactionHash) {
          console.log({ transactionHash });
        })
        .on("receipt", function (receipt) {
          console.log({ receipt });
          blockChain.events = [];
          resolve(receipt);
        });
    });

    await this.loadFarm();
  }

  /**
   * ALWAYS ENSURE THAT A RESOURCE CONTRACT DOES NOT HAVE A PUBLIC MINT!
   * A resource can only be gained through a "stake"
   */
  public async stake({
    resource,
    amount,
  }: {
    resource: string;
    amount: number;
  }) {
    const blockChain = this;

    if (this.isTrial) {
      throw new Error("TRIAL_MODE");
    }

    console.log({ resource, amount });
    const gwei = this.web3.utils.toWei(amount.toString(), "ether");

    await new Promise(async (resolve, reject) => {
      this.farm.methods
        .stake(resource, gwei)
        .send({ from: this.account })
        .on("error", function (error) {
          console.log({ error });
          // User rejected
          if (error.code === 4001) {
            return resolve(null);
          }

          reject(error);
        })
        .on("transactionHash", function (transactionHash) {
          console.log({ transactionHash });
        })
        .on("receipt", function (receipt) {
          console.log({ receipt });
          blockChain.events = [];
          resolve(receipt);
        });
    });

    await this.loadFarm();
  }

  public async getMarketConversion(): Promise<number> {
    return await this.farm.methods
      .getMarketPrice(1)
      .call({ from: this.account });
  }

  public getWeb3() {
    return this.web3;
  }

  public addEvent(event: Transaction) {
    this.events = [...this.events, event];
  }

  public isUnsaved() {
    return this.events.length > 0;
  }

  public get isTrial() {
    return this.isTrialAccount;
  }

  public startTrialMode() {
    this.isTrialAccount = true;
  }

  public endTrialMode() {
    this.isTrialAccount = false;
  }

  public lastSaved() {
    if (this.events.length === 0) {
      return null;
    }

    return this.events[0].createdAt;
  }

  private cachedTotalSupply: number = 0;

  public async cacheTotalSupply() {
    if (!this.web3 || !this.alchemyToken) {
      this.cachedTotalSupply = 0;
    }

    const totalSupply = await this.alchemyToken.methods
      .totalSupply()
      .call({ from: this.account });

    const supply = this.web3.utils.fromWei(totalSupply);

    this.cachedTotalSupply = Number(supply);
  }

  public totalSupply() {
    return this.cachedTotalSupply;
  }

  public async getCharityBalances() {
    const coolEarth = this.web3.eth.getBalance(Charity.CoolEarth);
    const waterProject = this.web3.eth.getBalance(Charity.TheWaterProject);
    const heifer = this.web3.eth.getBalance(Charity.Heifer);
    const [coolEarthBalance, waterBalance, heiferBalance] = await Promise.all([
      coolEarth,
      waterProject,
      heifer,
    ]);

    return {
      coolEarthBalance: this.web3.utils.fromWei(coolEarthBalance, "ether"),
      waterBalance: this.web3.utils.fromWei(waterBalance, "ether"),
      heiferBalance: this.web3.utils.fromWei(heiferBalance, "ether"),
    };
  }

  // Used when a player did not save in time
  public offsetTime() {
    const latestTime = this.events[this.events.length - 1];
    const now = Math.floor(Date.now() / 1000);
    const difference = now - latestTime.createdAt;

    // For each event, add the time
    this.events = this.events.map((event) => ({
      ...event,
      createdAt: event.createdAt + difference,
    }));
  }

  public resetFarm() {
    this.events = [];
  }

  public async getReward() {
    try {
      const reward = await this.farm.methods
        .myReward()
        .call({ from: this.account });

      if (!reward) {
        return 0;
      }

      const converted = this.web3.utils.fromWei(reward.toString());

      return Number(converted);
    } catch (e) {
      // No reward ready
      return null;
    }
  }

  public async receiveReward() {
    await new Promise(async (resolve, reject) => {
      const price = await this.web3.eth.getGasPrice();
      const gasPrice = price ? Number(price) * 2 : undefined;

      this.farm.methods
        .receiveReward()
        .send({ from: this.account, gasPrice })
        .on("error", function (error) {
          console.log({ error });
          // User rejected
          if (error.code === 4001) {
            return resolve(null);
          }

          reject(error);
        })
        .on("transactionHash", function (transactionHash) {
          console.log({ transactionHash });
        })
        .on("receipt", function (receipt) {
          console.log({ receipt });
          resolve(receipt);
        });
    });

    await this.loadFarm();
  }

  private async loadInventory(): Promise<Inventory> {
    const tokenPromise = this.alchemyToken.methods
      .balanceOf(this.account)
      .call({ from: this.account });

    const axePromise = this.axe.methods
      .balanceOf(this.account)
      .call({ from: this.account });

    const woodPromise = this.wood.methods
      .balanceOf(this.account)
      .call({ from: this.account });

    const stonePromise = this.stone.methods
      .balanceOf(this.account)
      .call({ from: this.account });

    const pickaxePromise = this.pickaxe.methods
      .balanceOf(this.account)
      .call({ from: this.account });

    const [token, axe, wood, pickaxe, stone] = await Promise.all([
      tokenPromise,
      axePromise,
      woodPromise,
      pickaxePromise,
      stonePromise,
    ]);

    console.log({ axe });
    console.log({ wood });
    return {
      axe: Number(this.web3.utils.fromWei(axe)),
      wood: Number(this.web3.utils.fromWei(wood)),
      pickaxe: Number(this.web3.utils.fromWei(pickaxe)),
      stone: Number(this.web3.utils.fromWei(stone)),
      sunflowerTokens: Number(this.web3.utils.fromWei(token)),
    };
  }

  public getInventory() {
    return this.inventory;
  }

  public async getTreeStrength() {
    const strength = await this.wood.methods
      .getAvailable(this.account)
      .call({ from: this.account });

    return {
      strength: this.web3.utils.fromWei(strength),
    };
  }

  public async getStoneStrength() {
    const strength = await this.stone.methods
      .getAvailable(this.account)
      .call({ from: this.account });

    return {
      strength: this.web3.utils.fromWei(strength),
    };
  }
}
