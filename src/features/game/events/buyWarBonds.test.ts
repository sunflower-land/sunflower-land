import Decimal from "decimal.js-light";
import { TEST_FARM } from "../lib/constants";
import { buyWarBonds } from "./buyWarBonds";

describe("buyWarBonds", () => {
  it("requires an offer is available", () => {
    expect(() =>
      buyWarBonds({
        state: {
          ...TEST_FARM,
          warCollectionOffer: undefined,
        },
        action: { type: "warBonds.bought" },
      })
    ).toThrow("No war bonds available");
  });

  it("requires player has ingredients", () => {
    expect(() =>
      buyWarBonds({
        state: {
          ...TEST_FARM,
          inventory: {
            Wood: new Decimal(15),
            "Goblin War Banner": new Decimal(1),
          },
          warCollectionOffer: {
            endAt: new Date(Date.now() + 1000).toISOString(),
            startAt: new Date().toISOString(),
            ingredients: [
              {
                amount: 20,
                name: "Wood",
              },
            ],
            warBonds: 20,
          },
        },
        action: { type: "warBonds.bought" },
      })
    ).toThrow("Insufficient ingredient: Wood");
  });

  it("exchanges war bonds & subtracts ingredients", () => {
    const state = buyWarBonds({
      state: {
        ...TEST_FARM,
        inventory: {
          Wood: new Decimal(25),
          Sunflower: new Decimal(5),
          "Goblin War Banner": new Decimal(1),
          "War Bond": new Decimal(2),
        },
        warCollectionOffer: {
          endAt: new Date(Date.now() + 1000).toISOString(),
          startAt: new Date().toISOString(),
          ingredients: [
            {
              amount: 20,
              name: "Wood",
            },
          ],
          warBonds: 12,
        },
      },
      action: { type: "warBonds.bought" },
    });

    expect(state.inventory).toEqual({
      Wood: new Decimal(5),
      Sunflower: new Decimal(5),
      "War Bond": new Decimal(14),
      "Goblin War Point": new Decimal(12),
      "Goblin War Banner": new Decimal(1),
    });
  });

  it("exchanges multiple war bonds", () => {
    let state = buyWarBonds({
      state: {
        ...TEST_FARM,
        inventory: {
          Wood: new Decimal(100),
          Sunflower: new Decimal(5),
          "Goblin War Banner": new Decimal(1),
          "War Bond": new Decimal(2),
        },
        warCollectionOffer: {
          endAt: new Date(Date.now() + 1000).toISOString(),
          startAt: new Date().toISOString(),
          ingredients: [
            {
              amount: 20,
              name: "Wood",
            },
          ],
          warBonds: 12,
        },
      },
      action: { type: "warBonds.bought" },
    });

    state = buyWarBonds({
      state,
      action: { type: "warBonds.bought" },
    });

    expect(state.inventory).toEqual({
      Wood: new Decimal(60),
      Sunflower: new Decimal(5),
      "War Bond": new Decimal(26),
      "Goblin War Point": new Decimal(24),
      "Goblin War Banner": new Decimal(1),
    });
  });

  it("mints goblin war points", () => {
    const state = buyWarBonds({
      state: {
        ...TEST_FARM,
        inventory: {
          Wood: new Decimal(100),
          "Goblin War Banner": new Decimal(1),
          "Goblin War Point": new Decimal(5),
        },
        warCollectionOffer: {
          endAt: new Date(Date.now() + 1000).toISOString(),
          startAt: new Date().toISOString(),
          ingredients: [
            {
              amount: 20,
              name: "Wood",
            },
          ],
          warBonds: 12,
        },
      },
      action: { type: "warBonds.bought" },
    });

    expect(state.inventory["Goblin War Point"]).toEqual(new Decimal(17));
  });

  it("mints human war points", () => {
    const state = buyWarBonds({
      state: {
        ...TEST_FARM,
        inventory: {
          Wood: new Decimal(100),
          "Goblin War Point": new Decimal(5),
          "Human War Banner": new Decimal(1),
        },
        warCollectionOffer: {
          endAt: new Date(Date.now() + 1000).toISOString(),
          startAt: new Date().toISOString(),
          ingredients: [
            {
              amount: 20,
              name: "Wood",
            },
          ],
          warBonds: 12,
        },
      },
      action: { type: "warBonds.bought" },
    });
    expect(state.inventory["Human War Point"]).toEqual(new Decimal(12));
  });

  it("mints extra items if they have an ancient warhammer", () => {
    const state = buyWarBonds({
      state: {
        ...TEST_FARM,
        inventory: {
          Wood: new Decimal(100),
          "Ancient Human Warhammer": new Decimal(1),
          "Human War Banner": new Decimal(1),
        },
        warCollectionOffer: {
          endAt: new Date(Date.now() + 1000).toISOString(),
          startAt: new Date().toISOString(),
          ingredients: [
            {
              amount: 20,
              name: "Wood",
            },
          ],
          warBonds: 10,
        },
      },
      action: { type: "warBonds.bought" },
    });

    expect(state.inventory["Human War Point"]).toEqual(new Decimal(11));
    expect(state.inventory["War Bond"]).toEqual(new Decimal(11));
  });
});
