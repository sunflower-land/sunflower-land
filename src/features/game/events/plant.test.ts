import { FieldItem, GameState } from "../GameProvider";

import { plant } from "./plant";

const EMPTY_FIELDS: FieldItem[] = Array(5)
  .fill(null)
  .map((_, fieldIndex) => ({ fieldIndex }));

let GAME_STATE: GameState = {
  fields: EMPTY_FIELDS,
  actions: [],
  balance: 0,
  inventory: {},
  level: 1,
};

describe("plant", () => {
  it("does not plant if field is locked", () => {
    expect(() =>
      plant(GAME_STATE, {
        type: "item.planted",
        index: GAME_STATE.fields.length + 1,
        item: "Sunflower Seed",
      })
    ).toThrow("Field is not unlocked");
  });

  it("does not plant if crop already exists", () => {
    expect(() =>
      plant(
        {
          ...GAME_STATE,
          fields: [
            {
              fieldIndex: 0,
              crop: {
                name: "Sunflower",
                plantedAt: new Date(),
              },
            },
          ],
        },
        {
          type: "item.planted",
          index: 0,
          item: "Sunflower Seed",
        }
      )
    ).toThrow("Crop is already planted");
  });

  it("does not plant an invalid item", () => {
    expect(() =>
      plant(GAME_STATE, {
        type: "item.planted",
        index: 0,
        item: "Pickaxe",
      })
    ).toThrow("Not a seed");
  });

  it("does not plant if user does not have seeds", () => {
    expect(() =>
      plant(GAME_STATE, {
        type: "item.planted",
        index: 0,
        item: "Sunflower Seed",
      })
    ).toThrow("Not enough seeds");
  });

  it("plants a seed", () => {
    const state = plant(
      {
        ...GAME_STATE,
        inventory: {
          "Sunflower Seed": 5,
        },
      },
      {
        type: "item.planted",
        index: 0,
        item: "Sunflower Seed",
      }
    );

    expect(state).toEqual({
      ...GAME_STATE,
      inventory: {
        "Sunflower Seed": 4,
      },
      fields: [
        {
          crop: {
            name: "Sunflower",
            plantedAt: expect.any(Date),
          },
          fieldIndex: 0,
        },
        ...EMPTY_FIELDS.slice(1),
      ],
    });
  });
});
