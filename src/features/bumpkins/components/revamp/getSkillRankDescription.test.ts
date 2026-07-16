import { getSkillRankDescription } from "./getSkillRankDescription";
import { translate } from "lib/i18n/translate";

type T = Parameters<typeof getSkillRankDescription>[2];
const t = translate as unknown as T;

describe("getSkillRankDescription — Healthy Livestock", () => {
  it("shows only the sickness cut at rank 1 (no spread benefit yet)", () => {
    const { buff, debuff } = getSkillRankDescription("Healthy Livestock", 1, t);

    expect(buff).toEqual("x0.5 chance of sickness");
    // The spread line is a positive effect folded into the buff, never a debuff.
    expect(debuff).toBeUndefined();
  });

  // Ranks 2/3 add the spread reduction to the (positive) buff line so it renders
  // for the owned rank — the skill has no tree `boosts.debuff` to host it.
  it.each([
    [2, "x0.5 chance of sickness, -50% chance of it spreading"],
    [3, "x0.5 chance of sickness, -99% chance of it spreading"],
  ])("folds the spread reduction into the rank %s buff", (rank, expected) => {
    const { buff, debuff } = getSkillRankDescription(
      "Healthy Livestock",
      rank,
      t,
    );

    expect(buff).toEqual(expected);
    expect(debuff).toBeUndefined();
  });
});
