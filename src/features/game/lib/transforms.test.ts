import Decimal from "decimal.js-light";
import { TEST_FARM } from "./constants";
import { getAvailableGameState } from "./transforms";

describe("transform", () => {
  it("gets the lowest balance from the first object", () => {
    const lowest = getAvailableGameState({
      onChain: {
        ...TEST_FARM,
        balance: new Decimal(0.5),
      },
      offChain: {
        ...TEST_FARM,
        balance: new Decimal(5),
      },
    });

    expect(lowest.balance).toEqual(new Decimal(0.5));
  });

  it("gets the lowest balance from the second object", () => {
    const lowest = getAvailableGameState({
      onChain: {
        ...TEST_FARM,
        balance: new Decimal(2),
      },
      offChain: {
        ...TEST_FARM,
        balance: new Decimal(105),
      },
    });

    expect(lowest.balance).toEqual(new Decimal(2));
  });

  it("gets the lowest inventory", () => {
    const lowest = getAvailableGameState({
      onChain: {
        ...TEST_FARM,
        inventory: {
          Sunflower: new Decimal(5),
          Axe: new Decimal(100),
          Stone: new Decimal(20),
        },
      },
      offChain: {
        ...TEST_FARM,
        inventory: {
          Sunflower: new Decimal(10),
          Axe: new Decimal(90),
          Gold: new Decimal(0.5),
        },
      },
    });

    expect(lowest.inventory).toEqual({
      Sunflower: new Decimal(5),
      Axe: new Decimal(90),
    });
  });

  it("takes off chain Gold Pass balance but lowest of everything else", () => {
    const state = getAvailableGameState({
      onChain: {
        ...TEST_FARM,
        inventory: {
          Sunflower: new Decimal(5),
          Axe: new Decimal(100),
          Stone: new Decimal(20),
        },
      },
      offChain: {
        ...TEST_FARM,
        inventory: {
          Sunflower: new Decimal(10),
          Axe: new Decimal(90),
          Gold: new Decimal(0.5),
          "Gold Pass": new Decimal(1),
        },
      },
    });

    expect(state.inventory).toEqual({
      Sunflower: new Decimal(5),
      Axe: new Decimal(90),
      "Gold Pass": new Decimal(1),
    });
  });

  it("filters out placed items", () => {
    const lowest = getAvailableGameState({
      onChain: {
        ...TEST_FARM,
        inventory: {
          "Peeled Potato": new Decimal(1),
          "Sunflower Rock": new Decimal(1),
        },
      },
      offChain: {
        ...TEST_FARM,
        inventory: {
          "Peeled Potato": new Decimal(1),
          "Sunflower Rock": new Decimal(1),
        },
        collectibles: {
          "Peeled Potato": [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
    });

    expect(lowest.inventory).toEqual({
      "Sunflower Rock": new Decimal(1),
    });
  });
});
