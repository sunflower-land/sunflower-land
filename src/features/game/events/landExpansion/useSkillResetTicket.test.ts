import { TEST_FARM, INITIAL_BUMPKIN } from "features/game/lib/constants";
import Decimal from "decimal.js-light";
import { useSkillResetTicket } from "./useSkillResetTicket";
import { MAX_FREE_POINTS, REGEN_MS } from "./chargeSkillEdit";

describe("useSkillResetTicket", () => {
  const dateNow = Date.now();

  it("throws without a Bumpkin", () => {
    expect(() =>
      useSkillResetTicket({
        state: {
          ...TEST_FARM,
          bumpkin: undefined,
        } as unknown as typeof TEST_FARM,
        action: { type: "skillResetTicket.used" },
        createdAt: dateNow,
      }),
    ).toThrow("You do not have a Bumpkin!");
  });

  it("throws when the player has no ticket", () => {
    expect(() =>
      useSkillResetTicket({
        state: {
          ...TEST_FARM,
          inventory: {
            ...TEST_FARM.inventory,
            "Skill Reset Ticket": new Decimal(0),
          },
          bumpkin: { ...INITIAL_BUMPKIN },
        },
        action: { type: "skillResetTicket.used" },
        createdAt: dateNow,
      }),
    ).toThrow("You do not have a Skill Reset Ticket");
  });

  it("burns one ticket and grants +50 free points (capped)", () => {
    const result = useSkillResetTicket({
      state: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          "Skill Reset Ticket": new Decimal(2),
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          freeSkillPoints: 10,
          lastFreeSkillPointsRegenAt: dateNow,
        },
      },
      action: { type: "skillResetTicket.used" },
      createdAt: dateNow,
    });

    expect(result.inventory["Skill Reset Ticket"]?.toNumber()).toEqual(1);
    expect(result.bumpkin?.freeSkillPoints).toEqual(60);
  });

  it("caps at MAX_FREE_POINTS even when surplus is wasted", () => {
    const result = useSkillResetTicket({
      state: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          "Skill Reset Ticket": new Decimal(1),
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          freeSkillPoints: 70,
          lastFreeSkillPointsRegenAt: dateNow,
        },
      },
      action: { type: "skillResetTicket.used" },
      createdAt: dateNow,
    });

    expect(result.bumpkin?.freeSkillPoints).toEqual(MAX_FREE_POINTS);
  });

  it("applies the pending regen tick before adding the ticket bonus", () => {
    const result = useSkillResetTicket({
      state: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          "Skill Reset Ticket": new Decimal(1),
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          freeSkillPoints: 0,
          lastFreeSkillPointsRegenAt: dateNow - REGEN_MS - 1,
        },
      },
      action: { type: "skillResetTicket.used" },
      createdAt: dateNow,
    });

    // Regen tick brings balance to 50, ticket adds another 50, capped at 75.
    expect(result.bumpkin?.freeSkillPoints).toEqual(MAX_FREE_POINTS);
    expect(result.bumpkin?.lastFreeSkillPointsRegenAt).toEqual(dateNow);
  });
});
