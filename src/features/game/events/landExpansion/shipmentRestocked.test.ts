import { INITIAL_FARM } from "features/game/lib/constants";
import { SHIPMENT_STOCK, shipmentRestock } from "./shipmentRestocked";
import Decimal from "decimal.js-light";

describe("shipmentRestocked", () => {
  it("restocks a shipment", () => {
    const now = Date.now();
    const state = shipmentRestock({
      action: {
        type: "shipment.restocked",
      },
      state: {
        ...INITIAL_FARM,
        stock: {
          ...INITIAL_FARM.stock,
          "Sunflower Seed": new Decimal(5),
        },
        shipments: {
          restockedAt: new Date("2023-04-04").getTime(),
        },
      },
      createdAt: now,
    });

    expect(state.shipments.restockedAt).toBeCloseTo(now);
    expect(state.stock["Sunflower Seed"]).toEqual(
      new Decimal((SHIPMENT_STOCK["Sunflower Seed"] ?? 0) + 5),
    );
  });

  it("restocks a shipment to max stock", () => {
    const now = Date.now();
    const state = shipmentRestock({
      action: {
        type: "shipment.restocked",
      },
      state: {
        ...INITIAL_FARM,
        stock: {
          ...INITIAL_FARM.stock,
          "Sunflower Seed": new Decimal(350),
        },
        shipments: {
          restockedAt: new Date("2023-04-04").getTime(),
        },
      },
      createdAt: now,
    });

    expect(state.shipments.restockedAt).toEqual(now);
    expect(state.stock["Sunflower Seed"]).toEqual(new Decimal(400));
  });

  it("does not reduce existing stock", () => {
    const now = Date.now();
    const state = shipmentRestock({
      action: {
        type: "shipment.restocked",
      },
      state: {
        ...INITIAL_FARM,
        stock: {
          ...INITIAL_FARM.stock,
          "Sunflower Seed": new Decimal(400),
        },
        shipments: {
          restockedAt: new Date("2023-04-04").getTime(),
        },
      },
      createdAt: now,
    });

    expect(state.shipments.restockedAt).toEqual(now);
    expect(state.stock["Sunflower Seed"]).toEqual(new Decimal(400));
  });

  it("does not change existing stock of other seeds", () => {
    const now = Date.now();
    const state = shipmentRestock({
      action: {
        type: "shipment.restocked",
      },
      state: {
        ...INITIAL_FARM,
        stock: {
          ...INITIAL_FARM.stock,
          "Sunflower Seed": new Decimal(300),
          "Eggplant Seed": new Decimal(50),
        },
        shipments: {
          restockedAt: new Date("2023-04-04").getTime(),
        },
      },
      createdAt: now,
    });

    expect(state.shipments.restockedAt).toEqual(now);
    expect(state.stock["Sunflower Seed"]).toEqual(new Decimal(400));
    expect(state.stock["Eggplant Seed"]).toEqual(new Decimal(50));
  });

  it("only restocks a shipment once per day", () => {
    expect(() =>
      shipmentRestock({
        action: {
          type: "shipment.restocked",
        },
        state: {
          ...INITIAL_FARM,
          shipments: {
            restockedAt: Date.now(),
          },
        },
      }),
    ).toThrow("Already restocked today");
  });
});
