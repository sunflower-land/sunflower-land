import { FieldItem, GameState } from "../types/game";
import { harvest } from "./harvest";

const EMPTY_FIELDS: FieldItem[] = Array(5)
  .fill(null)
  .map((_, fieldIndex) => ({ fieldIndex }));

let GAME_STATE: GameState = {
  fields: EMPTY_FIELDS,
  balance: 0,
  inventory: {},
};

describe("harvest", () => {
  it("does not harvest if the field is not unlocked", () => {
    expect(() =>
      harvest(GAME_STATE, {
        type: "item.harvested",
        index: GAME_STATE.fields.length + 1,
      })
    ).toThrow("Field is not unlocked");
  });

  it("does not harvest empty air", () => {
    expect(() =>
      harvest(GAME_STATE, {
        type: "item.harvested",
        index: 0,
      })
    ).toThrow("Nothing was planted");
  });

  it("does not harvest if the crop is not ripe", () => {
    expect(() =>
      harvest(
        {
          ...GAME_STATE,
          fields: [
            {
              fieldIndex: 0,
              crop: {
                name: "Sunflower",
                plantedAt: new Date(Date.now() - 100),
              },
            },
          ],
        },
        {
          type: "item.harvested",
          index: 0,
        }
      )
    ).toThrow("Crop is not ready to harvest");
  });

  it("harvests a crop", () => {
    const state = harvest(
      {
        ...GAME_STATE,
        fields: [
          {
            fieldIndex: 0,
            crop: {
              name: "Sunflower",
              plantedAt: new Date(Date.now() - 2 * 60 * 1000),
            },
          },
        ],
      },
      {
        type: "item.harvested",
        index: 0,
      }
    );

    expect(state.inventory.Sunflower).toBe(1);
    expect(state.fields).toEqual([
      {
        fieldIndex: 0,
        crop: undefined,
      },
    ]);
  });
});
