import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { claimBountyBonus } from "./claimBountyBonus";
import { getChapterTicket } from "features/game/types/chapters";
import { getWeekKey } from "features/game/lib/factions";

describe("claimBountyBonus", () => {
  const createdAt = new Date("2025-05-06").getTime();
  const ticket = getChapterTicket(createdAt);
  const GAME_STATE: GameState = {
    ...TEST_FARM,
    bounties: {
      completed: [
        {
          id: "1",
          soldAt: 100000,
        },
        {
          id: "2",
          soldAt: 100000,
        },
        {
          id: "3",
          soldAt: 100000,
        },
      ],
      requests: [
        {
          id: "1",
          name: "White Lotus",
          items: { Gem: 7 },
        },
        {
          id: "2",
          name: "Yellow Daffodil",
          items: { Gem: 9 },
        },
        {
          id: "3",
          name: "Olive Flounder",
          items: { Gem: 3 },
        },
      ],
    },
  };

  it("throws an error if not all bounties are completed", () => {
    expect(() =>
      claimBountyBonus({
        state: {
          ...GAME_STATE,
          bounties: {
            ...GAME_STATE.bounties,
            completed: [
              {
                id: "1",
                soldAt: 100000,
              },
            ],
          },
        },
        action: {
          type: "claim.bountyBoardBonus",
        },
        createdAt,
      }),
    ).toThrow("Bounty Board not completed");
  });

  it("throws an error if bonus was already claimed this week", () => {
    const currentWeek = getWeekKey({ date: new Date(createdAt) });
    const weekStart = new Date(currentWeek).getTime();
    const bonusClaimedAt = weekStart + 1000; // 1 second after week start

    expect(() =>
      claimBountyBonus({
        state: {
          ...GAME_STATE,
          bounties: {
            ...GAME_STATE.bounties,
            bonusClaimedAt,
          },
        },
        action: {
          type: "claim.bountyBoardBonus",
        },
        createdAt,
      }),
    ).toThrow("Bounty Bonus already claimed for the week");
  });

  it("claims bonus and adds 50 seasonal tickets", () => {
    const result = claimBountyBonus({
      state: GAME_STATE,
      action: {
        type: "claim.bountyBoardBonus",
      },
      createdAt,
    });

    expect(result.inventory[ticket]).toEqual(new Decimal(50));
    expect(result.bounties.bonusClaimedAt).toBe(createdAt);
  });

  it("adds to existing seasonal tickets if player has some", () => {
    const result = claimBountyBonus({
      state: {
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
          [ticket]: new Decimal(10),
        },
      },
      action: {
        type: "claim.bountyBoardBonus",
      },
      createdAt,
    });

    expect(result.inventory[ticket]).toEqual(new Decimal(60));
    expect(result.bounties.bonusClaimedAt).toBe(createdAt);
  });
});
