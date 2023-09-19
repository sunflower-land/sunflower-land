import Decimal from "decimal.js-light";
import { TEST_FARM } from "../../lib/constants";
import { GameState } from "../../types/game";
import { placeBud } from "./placeBud";

const date = Date.now();
const GAME_STATE: GameState = TEST_FARM;

describe("Place Bud", () => {
  it.only("requires the bud is not already placed", () => {
    expect(() =>
      placeBud({
        state: {
          ...GAME_STATE,
          inventory: {
            Scarecrow: new Decimal(1),
          },
          buds: {
            1: {
              aura: "Basic",
              colour: "Green",
              ears: "Ears",
              stem: "3 Leaf Clover",
              type: "Beach",
              coordinates: {
                x: 0,
                y: 0,
              },
            },
          },
        },
        action: {
          id: 1,
          type: "bud.placed",
          coordinates: {
            x: 0,
            y: 0,
          },
        },
      })
    ).toThrow("This bud is already placed");
  });

  // it("Requires a collectible is on the inventory to be placed", () => {
  //   expect(() =>
  //     placeBud({
  //       state: {
  //         ...GAME_STATE,
  //         inventory: {},
  //         collectibles: {},
  //       },
  //       action: {
  //         id: "123",
  //         type: "collectible.placed",
  //         name: "Scarecrow",
  //         coordinates: {
  //           x: 0,
  //           y: 0,
  //         },
  //       },
  //     })
  //   ).toThrow("You can't place an item that is not on the inventory");
  // });

  // it("Places a collectible", () => {
  //   const state = placeBud({
  //     state: {
  //       ...GAME_STATE,
  //       inventory: {
  //         "Brazilian Flag": new Decimal(1),
  //       },
  //       collectibles: {},
  //     },
  //     action: {
  //       id: "123",
  //       type: "collectible.placed",
  //       name: "Brazilian Flag",
  //       coordinates: {
  //         x: 0,
  //         y: 0,
  //       },
  //     },
  //   });

  //   expect(state.collectibles["Brazilian Flag"]).toHaveLength(1);
  // });

  // it("Places multiple scarecrows", () => {
  //   const state = placeBud({
  //     state: {
  //       ...GAME_STATE,
  //       inventory: {
  //         Scarecrow: new Decimal(2),
  //       },
  //       collectibles: {
  //         Scarecrow: [
  //           {
  //             id: "123",
  //             coordinates: { x: 1, y: 1 },
  //             createdAt: date,
  //             readyAt: date,
  //           },
  //         ],
  //       },
  //     },
  //     createdAt: date,
  //     action: {
  //       id: "1234",
  //       type: "collectible.placed",
  //       name: "Scarecrow",
  //       coordinates: {
  //         x: 0,
  //         y: 0,
  //       },
  //     },
  //   });

  //   expect(state.collectibles["Scarecrow"]).toHaveLength(2);
  //   expect(state.collectibles["Scarecrow"]?.[0]).toEqual({
  //     id: expect.any(String),
  //     coordinates: { x: 1, y: 1 },
  //     readyAt: date,
  //     createdAt: date,
  //   });
  //   expect(state.collectibles["Scarecrow"]?.[1]).toEqual({
  //     id: expect.any(String),
  //     coordinates: { x: 0, y: 0 },
  //     readyAt: date,
  //     createdAt: date,
  //   });
  // });

  // it("Cannot place a building", () => {
  //   expect(() =>
  //     placeBud({
  //       state: {
  //         ...GAME_STATE,
  //         inventory: {
  //           Scarecrow: new Decimal(2),
  //           Carrot: new Decimal(10),
  //           "Fire Pit": new Decimal(10),
  //         },
  //         collectibles: {},
  //       },
  //       action: {
  //         id: "123",
  //         type: "collectible.placed",
  //         name: "Fire Pit" as CollectibleName,
  //         coordinates: {
  //           x: 0,
  //           y: 0,
  //         },
  //       },
  //     })
  //   ).toThrow("You cannot place this item");
  // });
});
