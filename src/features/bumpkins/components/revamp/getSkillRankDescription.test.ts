import { getSkillRankDescription } from "./getSkillRankDescription";
import { translate } from "lib/i18n/translate";
import { SKILL_RANKS } from "features/game/types/bumpkinSkills";
import { getKeys } from "lib/object";

type T = Parameters<typeof getSkillRankDescription>[2];
const t = translate as unknown as T;

describe("getSkillRankDescription — floating point safety", () => {
  // 0.55 * 100 = 55.00000000000001 in raw JS, which was rendering literally in
  // the panel. The fraction -> percentage conversion must stay float-exact.
  it("renders Turbo Fry rank 2 as a clean -55%", () => {
    const { buff } = getSkillRankDescription("Turbo Fry", 2, t);

    expect(buff).toEqual("-55% Kitchen cooking time with oil");
  });

  // No rank of any upgradeable skill may surface a float artefact (a long run of
  // 0s/9s from lossy decimal maths). All maxLevel === 3, so ranks 1..3 cover it.
  it("never renders a floating point artefact for any skill/rank", () => {
    const offenders: string[] = [];

    for (const name of getKeys(SKILL_RANKS)) {
      for (let rank = 1; rank <= 3; rank++) {
        const { buff, debuff } = getSkillRankDescription(name, rank, t);
        const lines = [...(Array.isArray(buff) ? buff : [buff]), debuff ?? ""];
        for (const line of lines) {
          if (/\d{5,}/.test(line)) {
            offenders.push(`${name} rank ${rank}: "${line}"`);
          }
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});

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
