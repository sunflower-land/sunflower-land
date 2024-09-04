import { TEST_FARM } from "features/game/lib/constants";
import { buyMegaStoreItem } from "./buyMegaStoreItem";
import Decimal from "decimal.js-light";
import { getSeasonalTicket } from "features/game/types/seasons";

describe("buyMegaStoreItem", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.clearAllTimers());

  it("throws an error if the item is not available", () => {
    expect(() =>
      buyMegaStoreItem({
        state: {
          ...TEST_FARM,
          megastore: {
            ...TEST_FARM.megastore,
            collectibles: [],
            wearables: [],
          },
        },
        action: {
          type: "megastoreItem.bought",
          name: "Soil Krabby",
        },
      }),
    ).toThrow("This item is not available");
  });

  it("throws an error if the player has already purchased the max allowed of a collectible", () => {
    const seasonTicket = getSeasonalTicket();

    expect(() =>
      buyMegaStoreItem({
        state: {
          ...TEST_FARM,
          balance: new Decimal(100),
          megastore: {
            ...TEST_FARM.megastore,
            collectibles: [
              {
                name: "Nana",
                price: new Decimal(100),
                currency: "SFL",
                limit: 1,
                type: "collectible",
                shortDescription: "Lorem ipsum",
                availableAllSeason: false,
              },
            ],
            wearables: [],
          },
          inventory: {
            [seasonTicket]: new Decimal(100),
            Nana: new Decimal(1),
          },
        },
        action: {
          type: "megastoreItem.bought",
          name: "Nana",
        },
        createdAt: new Date("2024-01-01").getTime(),
      }),
    ).toThrow("You already have reached the max allowed for this item");
  });

  it("throws an error if the player has already purchased the max allowed of a wearable", () => {
    const seasonTicket = getSeasonalTicket();

    expect(() =>
      buyMegaStoreItem({
        state: {
          ...TEST_FARM,
          inventory: {
            [seasonTicket]: new Decimal(100),
          },
          megastore: {
            ...TEST_FARM.megastore,
            collectibles: [],
            wearables: [
              {
                name: "Tiki Pants",
                price: new Decimal(100),
                currency: "SFL",
                limit: 1,
                type: "wearable",
                shortDescription: "Lorem ipsum",
                availableAllSeason: false,
              },
            ],
          },
          wardrobe: {
            "Tiki Pants": 2,
          },
        },
        action: {
          type: "megastoreItem.bought",
          name: "Tiki Pants",
        },
        createdAt: new Date("2023-10-01").getTime(),
      }),
    ).toThrow("You already have reached the max allowed for this item");
  });

  it("throws an error if the players doesn't have enough SFL for and SFL item", () => {
    expect(() =>
      buyMegaStoreItem({
        state: {
          ...TEST_FARM,
          balance: new Decimal(0),
          megastore: {
            ...TEST_FARM.megastore,
            collectibles: [
              {
                name: "Soil Krabby",
                price: new Decimal(100),
                currency: "SFL",
                limit: 1,
                type: "collectible",
                shortDescription: "Lorem ipsum",
                availableAllSeason: false,
              },
            ],
            wearables: [],
          },
        },
        action: {
          type: "megastoreItem.bought",
          name: "Soil Krabby",
        },
      }),
    ).toThrow("Not enough SFL");
  });

  it("throws an error if the players doesn't enough seasonal tickets for a seasonal ticket item", () => {
    const now = new Date("2024-01-02").getTime();
    jest.setSystemTime(now);

    const seasonTicket = getSeasonalTicket();

    expect(() =>
      buyMegaStoreItem({
        state: {
          ...TEST_FARM,
          inventory: {
            [seasonTicket]: new Decimal(0),
          },
          megastore: {
            ...TEST_FARM.megastore,
            wearables: [
              {
                name: "Tiki Mask",
                price: new Decimal(100),
                currency: "Seasonal Ticket",
                limit: 1,
                type: "wearable",
                shortDescription: "Lorem ipsum",
                availableAllSeason: false,
              },
            ],
          },
        },
        action: {
          type: "megastoreItem.bought",
          name: "Tiki Mask",
        },
      }),
    ).toThrow(`Not enough ${seasonTicket}`);
  });

  it("throws an error if the players doesn't have inventory items for a non SFL item", () => {
    expect(() =>
      buyMegaStoreItem({
        state: {
          ...TEST_FARM,
          inventory: {
            Crimstone: new Decimal(5),
          },
          megastore: {
            ...TEST_FARM.megastore,
            collectibles: [
              {
                name: "Knowledge Crab",
                price: new Decimal(100),
                currency: "Crimstone",
                limit: 1,
                type: "collectible",
                shortDescription: "Lorem ipsum",
                availableAllSeason: false,
              },
            ],
          },
        },
        action: {
          type: "megastoreItem.bought",
          name: "Knowledge Crab",
        },
      }),
    ).toThrow(`Not enough Crimstone`);
  });

  it("[SFL Wearable] subtracts the price from SFL balance and add item to wardrobe", () => {
    const { balance, wardrobe } = buyMegaStoreItem({
      state: {
        ...TEST_FARM,
        balance: new Decimal(1000),
        megastore: {
          ...TEST_FARM.megastore,
          wearables: [
            {
              name: "Fish Pro Vest",
              price: new Decimal(1000),
              currency: "SFL",
              limit: null,
              type: "wearable",
              shortDescription: "Lorem ipsum",
              availableAllSeason: false,
            },
          ],
        },
      },
      action: {
        type: "megastoreItem.bought",
        name: "Fish Pro Vest",
      },
    });

    expect(balance).toEqual(new Decimal(0));
    expect(wardrobe["Fish Pro Vest"]).toEqual(1);
  });

  it("[SFL Collectible] subtracts the price from SFL balance and add item to inventory", () => {
    const { balance, inventory } = buyMegaStoreItem({
      state: {
        ...TEST_FARM,
        balance: new Decimal(1000),
        megastore: {
          ...TEST_FARM.megastore,
          collectibles: [
            {
              name: "Soil Krabby",
              price: new Decimal(1000),
              currency: "SFL",
              limit: null,
              type: "collectible",
              shortDescription: "Lorem ipsum",
              availableAllSeason: false,
            },
          ],
        },
      },
      action: {
        type: "megastoreItem.bought",
        name: "Soil Krabby",
      },
    });

    expect(balance).toEqual(new Decimal(0));
    expect(inventory["Soil Krabby"]).toEqual(new Decimal(1));
  });

  it("[Non SFL Wearable] subtracts the price from inventory balance and add item to wardrobe", () => {
    const seasonTicket = getSeasonalTicket();

    const { inventory, wardrobe } = buyMegaStoreItem({
      state: {
        ...TEST_FARM,
        inventory: {
          [seasonTicket]: new Decimal(1000),
        },
        megastore: {
          ...TEST_FARM.megastore,
          wearables: [
            {
              name: "Fish Pro Vest",
              price: new Decimal(1000),
              currency: "Seasonal Ticket",
              limit: null,
              type: "wearable",
              shortDescription: "Lorem ipsum",
              availableAllSeason: false,
            },
          ],
        },
      },
      action: {
        type: "megastoreItem.bought",
        name: "Fish Pro Vest",
      },
    });

    expect(inventory[seasonTicket]).toEqual(new Decimal(0));
    expect(wardrobe["Fish Pro Vest"]).toEqual(1);
  });

  it("[Non SFL Collectible] subtracts the price from inventory balance and add item to inventory", () => {
    const { inventory } = buyMegaStoreItem({
      state: {
        ...TEST_FARM,
        inventory: {
          Crimstone: new Decimal(100),
        },
        megastore: {
          ...TEST_FARM.megastore,
          collectibles: [
            {
              name: "Knowledge Crab",
              price: new Decimal(10),
              currency: "Crimstone",
              limit: null,
              type: "collectible",
              shortDescription: "Lorem ipsum",
              availableAllSeason: false,
            },
          ],
        },
      },
      action: {
        type: "megastoreItem.bought",
        name: "Knowledge Crab",
      },
    });

    expect(inventory.Crimstone).toEqual(new Decimal(90));
    expect(inventory["Knowledge Crab"]).toEqual(new Decimal(1));
  });

  it("adds SFL Spent to bumpkin activity", () => {
    const { bumpkin } = buyMegaStoreItem({
      state: {
        ...TEST_FARM,
        balance: new Decimal(1000),
        megastore: {
          ...TEST_FARM.megastore,
          collectibles: [
            {
              name: "Knowledge Crab",
              price: new Decimal(1000),
              currency: "SFL",
              limit: null,
              type: "wearable",
              shortDescription: "Lorem ipsum",
              availableAllSeason: false,
            },
          ],
        },
      },
      action: {
        type: "megastoreItem.bought",
        name: "Knowledge Crab",
      },
    });

    expect(bumpkin?.activity?.["SFL Spent"]).toEqual(1000);
  });

  // TODO: Add items to bought event
  // it.skip("adds [item] Bought to bumpkin activity", () => {
  //   const now = new Date("2024-02-01").getTime();
  //   jest.setSystemTime(now);

  //   const state = {
  //     ...TEST_FARM,
  //     inventory: { Crimstone: new Decimal(1000) },
  //   };

  //   const { bumpkin } = buyMegaStoreItem({
  //     state,
  //     action: {
  //       type: "megastoreItem.bought",
  //       name: "Knowledge Crab",
  //     },
  //     createdAt: now,
  //   });

  //   expect(bumpkin?.activity?.["Knowledge Crab Bought"]).toEqual(1);
  // });
});
