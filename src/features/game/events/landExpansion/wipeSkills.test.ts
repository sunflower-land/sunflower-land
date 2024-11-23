import { TEST_FARM, INITIAL_BUMPKIN } from "features/game/lib/constants";
import { wipeSkills } from "./wipeSkills";

describe("resetSkills", () => {
  const dateNow = Date.now();

  it("requires Bumpkin to have skills", () => {
    expect(() => {
      wipeSkills({
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            skills: {},
          },
        },
        action: { type: "skills.wipe" },
        createdAt: dateNow,
      });
    }).toThrow("You do not have any skills to wipe");
  });

  it("requires Bumpkin to have old skills", () => {
    const state = wipeSkills({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: {
            "Green Thumb": 1,
            Cultivator: 1,
          },
        },
      },
      action: { type: "skills.wipe" },
      createdAt: dateNow,
    });

    expect(state.bumpkin?.skills).toEqual({});
  });

  it("does not wipe if Bumpkin has new skills", () => {
    expect(() => {
      wipeSkills({
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            skills: {
              "Green Thumb": 1,
              "Acre Farm": 1,
            },
          },
        },
        action: { type: "skills.wipe" },
        createdAt: dateNow,
      });
    }).toThrow("You can only wipe your old skills");
  });

  it("wipes Bumpkin skills", () => {
    const state = wipeSkills({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: {
            "Green Thumb": 1,
          },
        },
      },
      action: { type: "skills.wipe" },
      createdAt: dateNow,
    });

    expect(state.bumpkin?.skills).toEqual({});
  });
});
