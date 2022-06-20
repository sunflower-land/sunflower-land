import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "./constants";
import { getLowestGameState } from "./transforms";

describe("transform", () => {
  it("gets the lowest balance from the first object", () => {
    const lowest = getLowestGameState({
      first: {
        ...INITIAL_FARM,
        balance: new Decimal(0.5),
      },
      second: {
        ...INITIAL_FARM,
        balance: new Decimal(5),
      },
    });

    expect(lowest.balance).toEqual(new Decimal(0.5));
  });

  it("gets the lowest balance from the second object", () => {
    const lowest = getLowestGameState({
      first: {
        ...INITIAL_FARM,
        balance: new Decimal(2),
      },
      second: {
        ...INITIAL_FARM,
        balance: new Decimal(105),
      },
    });

    expect(lowest.balance).toEqual(new Decimal(2));
  });

  it("gets the lowest inventory", () => {
    const lowest = getLowestGameState({
      first: {
        ...INITIAL_FARM,
        inventory: {
          Sunflower: new Decimal(5),
          Axe: new Decimal(100),
          Stone: new Decimal(20),
        },
      },
      second: {
        ...INITIAL_FARM,
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
});
