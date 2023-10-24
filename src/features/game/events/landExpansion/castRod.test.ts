import { TEST_FARM } from "features/game/lib/constants";
import { castRod } from "./castRod";
import Decimal from "decimal.js-light";

const farm = { ...TEST_FARM };

describe("castRod", () => {
  it("requires player has a rod", () => {
    expect(() => {
      castRod({
        action: {
          bait: "Earthworm",
          type: "rod.casted",
        },
        state: farm,
      });
    }).toThrow("Missing rod");
  });

  it("requires player has bait", () => {
    expect(() => {
      castRod({
        action: {
          bait: "Earthworm",
          type: "rod.casted",
        },
        state: {
          ...farm,
          inventory: {
            Rod: new Decimal(1),
          },
        },
      });
    }).toThrow("Missing Earthworm");
  });

  it("requires chum is supported", () => {
    expect(() => {
      castRod({
        action: {
          bait: "Earthworm",
          chum: "Axe",
          type: "rod.casted",
        },
        state: {
          ...farm,
          inventory: {
            Rod: new Decimal(1),
            Earthworm: new Decimal(1),
            Axe: new Decimal(1),
          },
        },
      });
    }).toThrow("Axe is not a supported chum");
  });

  it("requires player has not already casts", () => {
    expect(() => {
      castRod({
        action: {
          bait: "Earthworm",
          type: "rod.casted",
        },
        state: {
          ...farm,
          inventory: {
            Rod: new Decimal(1),
            Earthworm: new Decimal(1),
            Axe: new Decimal(1),
          },
          fishing: {
            weather: "Sunny",
            wharf: {
              castedAt: 1000000200,
            },
          },
        },
      });
    }).toThrow("Already casted");
  });

  it("requires player has sufficient chum", () => {
    expect(() => {
      castRod({
        action: {
          bait: "Earthworm",
          chum: "Sunflower",
          type: "rod.casted",
        },
        state: {
          ...farm,
          inventory: {
            Rod: new Decimal(1),
            Earthworm: new Decimal(1),
            Sunflower: new Decimal(30),
          },
        },
      });
    }).toThrow("Insufficent Chum: Sunflower");
  });

  it("subtracts rod", () => {
    const state = castRod({
      action: {
        bait: "Earthworm",
        type: "rod.casted",
      },
      state: {
        ...farm,
        inventory: {
          Rod: new Decimal(3),
          Earthworm: new Decimal(1),
        },
      },
    });

    expect(state.inventory.Rod).toEqual(new Decimal(2));
  });

  it("subtracts bait", () => {
    const state = castRod({
      action: {
        bait: "Earthworm",
        type: "rod.casted",
      },
      state: {
        ...farm,
        inventory: {
          Rod: new Decimal(3),
          Earthworm: new Decimal(2),
        },
      },
    });

    expect(state.inventory.Earthworm).toEqual(new Decimal(1));
  });

  it("subtracts chum", () => {
    const state = castRod({
      action: {
        bait: "Earthworm",
        type: "rod.casted",
        chum: "Sunflower",
      },
      state: {
        ...farm,
        inventory: {
          Rod: new Decimal(3),
          Earthworm: new Decimal(1),
          Sunflower: new Decimal(500),
        },
      },
    });

    expect(state.inventory.Sunflower).toEqual(new Decimal(450));
  });

  it("casts rod on wharf", () => {
    const now = Date.now();
    const state = castRod({
      action: {
        bait: "Earthworm",
        type: "rod.casted",
      },
      state: {
        ...farm,
        inventory: {
          Rod: new Decimal(3),
          Earthworm: new Decimal(1),
        },
      },
    });

    expect(state.fishing.wharf.castedAt).toEqual(now);
  });

  it("casts rod on wharf with chum", () => {
    const now = Date.now();
    const state = castRod({
      action: {
        bait: "Earthworm",
        type: "rod.casted",
        chum: "Sunflower",
      },
      state: {
        ...farm,
        inventory: {
          Rod: new Decimal(3),
          Earthworm: new Decimal(1),
          Sunflower: new Decimal(500),
        },
      },
    });

    expect(state.fishing.wharf).toEqual({
      castedAt: now,
      chum: "Sunflower",
    });
  });
});
