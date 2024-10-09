import { INITIAL_FARM } from "features/game/lib/constants";
import { sellAnimal } from "./sellAnimal";
import Decimal from "decimal.js-light";

describe("animal.sold", () => {
  it("requires deal exists", () => {
    expect(() =>
      sellAnimal({
        state: INITIAL_FARM,
        action: {
          offerId: "123",
          animalId: Object.keys(INITIAL_FARM.henHouse.animals)[0],
          type: "animal.sold",
        },
      }),
    ).toThrow("Deal does not exist");
  });

  it("requires deal not already made", () => {
    expect(() =>
      sellAnimal({
        state: {
          ...INITIAL_FARM,
          exchange: {
            deals: [
              {
                id: "123",
                coins: 100,
                expiresAt: Date.now() + 500,
                level: 1,
                name: "Chicken",
                soldAt: Date.now(),
              },
            ],
          },
        },
        action: {
          offerId: "123",
          animalId: Object.keys(INITIAL_FARM.henHouse.animals)[0],

          type: "animal.sold",
        },
      }),
    ).toThrow("Deal already completed");
  });
  it("requires player has a chicken", () => {
    expect(() =>
      sellAnimal({
        state: {
          ...INITIAL_FARM,
          exchange: {
            deals: [
              {
                id: "123",
                coins: 100,
                expiresAt: Date.now() + 500,
                level: 1,
                name: "Chicken",
              },
            ],
          },
        },
        action: {
          offerId: "123",
          animalId: "678",
          type: "animal.sold",
        },
      }),
    ).toThrow("Animal does not exist");
  });

  it("requires chicken is correct level", () => {
    expect(() =>
      sellAnimal({
        state: {
          ...INITIAL_FARM,
          exchange: {
            deals: [
              {
                id: "123",
                coins: 100,
                expiresAt: Date.now() + 500,
                level: 12,
                name: "Chicken",
              },
            ],
          },
        },
        action: {
          offerId: "123",
          animalId: Object.keys(INITIAL_FARM.henHouse.animals)[0],

          type: "animal.sold",
        },
      }),
    ).toThrow("Animal does not meet requirements");
  });

  // Success
  it("removes a chicken", () => {
    const animalId = Object.keys(INITIAL_FARM.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...INITIAL_FARM,
        exchange: {
          deals: [
            {
              id: "123",
              coins: 100,
              expiresAt: Date.now() + 500,
              level: 1,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        offerId: "123",
        animalId,

        type: "animal.sold",
      },
    });

    expect(state.henHouse.animals[animalId]).toBeUndefined();
    expect(Object.keys(state.henHouse.animals)).toHaveLength(2);
  });

  it("exchanges coins", () => {
    const animalId = Object.keys(INITIAL_FARM.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...INITIAL_FARM,
        exchange: {
          deals: [
            {
              id: "123",
              coins: 100,
              expiresAt: Date.now() + 500,
              level: 1,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        offerId: "123",
        animalId,

        type: "animal.sold",
      },
    });

    expect(state.coins).toEqual(100);
  });
  it("exchanges tickets", () => {
    const animalId = Object.keys(INITIAL_FARM.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...INITIAL_FARM,
        exchange: {
          deals: [
            {
              id: "123",
              items: { "Amber Fossil": 7 },
              expiresAt: Date.now() + 500,
              level: 1,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        offerId: "123",
        animalId,

        type: "animal.sold",
      },
      createdAt: new Date("2024-10-10").getTime(),
    });

    expect(state.inventory["Amber Fossil"]).toEqual(new Decimal(7));
  });

  it("marks as sold", () => {
    const now = Date.now();
    const animalId = Object.keys(INITIAL_FARM.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...INITIAL_FARM,
        exchange: {
          deals: [
            {
              id: "123",
              coins: 100,
              expiresAt: Date.now() + 500,
              level: 1,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        offerId: "123",
        animalId,

        type: "animal.sold",
      },
      createdAt: now,
    });

    const deal = state.exchange.deals.find((deal) => deal.id === "123");
    expect(deal?.soldAt).toEqual(now);
  });
});
