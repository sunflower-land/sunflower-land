import { INITIAL_FARM } from "features/game/lib/constants";
import { activateInstantCrops } from "./activateInstantCrops";

describe("activateInstantCrops", () => {
  it("throws an error if Instant Growth skill is not picked up", () => {
    expect(() =>
      activateInstantCrops({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...INITIAL_FARM.bumpkin,
            skills: {},
          },
        },
        action: { type: "instantCrops.activated" },
        createdAt: Date.now(),
      }),
    ).toThrow("Skill not picked up!");
  });

  it("throws an error if cooldown not ended yet", () => {
    expect(() =>
      activateInstantCrops({
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...INITIAL_FARM.bumpkin,
            skills: {
              "Instant Growth": 1,
            },
            activationSkills: {
              "Instant Growth": {
                activatedAt: Date.now(),
              },
            },
          },
        },
        action: { type: "instantCrops.activated" },
        createdAt: Date.now(),
      }),
    ).toThrow("You can't activate this skill yet!");
  });
  it("activates instant crop", () => {
    const state = activateInstantCrops({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          skills: {
            "Instant Growth": 1,
          },
        },
        crops: {
          ...INITIAL_FARM.crops,
          "123": {
            crop: {
              id: "456",
              name: "Kale",
              plantedAt: Date.now(),
              amount: 20,
            },
            createdAt: Date.now(),
            x: 1,
            y: 1,
            height: 1,
            width: 1,
          },
          "789": {
            crop: {
              id: "147",
              name: "Kale",
              plantedAt: Date.now(),
              amount: 20,
            },
            createdAt: Date.now(),
            x: 1,
            y: 1,
            height: 1,
            width: 1,
          },
        },
      },
      action: { type: "instantCrops.activated" },
      createdAt: Date.now(),
    });

    expect(state.crops["123"].crop?.plantedAt).toEqual(1);
    expect(state.crops["789"].crop?.plantedAt).toEqual(1);
  });
});
