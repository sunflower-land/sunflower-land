import { COLLECTIBLE_BUFF_LABELS } from "./collectibleItemBuffs";
import { INITIAL_FARM } from "../lib/constants";
import type { GameState } from "./game";

const gameWithSkills = (skills: GameState["bumpkin"]["skills"]): GameState => ({
  ...INITIAL_FARM,
  bumpkin: { ...INITIAL_FARM.bumpkin, skills },
});

const eggLabel = (game: GameState) =>
  COLLECTIBLE_BUFF_LABELS.Bale?.(game)?.[0]?.shortDescription;

describe("Bale collectible buff label", () => {
  it("shows the base +0.1 Egg boost without Double Bale", () => {
    expect(eggLabel(gameWithSkills({}))).toEqual("+0.1 Egg");
  });

  // Double Bale is upgradeable: x2 / x2.5 / x3 over Bale's 0.1 base.
  it.each([
    [1, "+0.2 Egg"],
    [2, "+0.25 Egg"],
    [3, "+0.3 Egg"],
  ])("reflects Double Bale rank %s as %s", (rank, expected) => {
    expect(eggLabel(gameWithSkills({ "Double Bale": rank }))).toEqual(expected);
  });

  it("scales the Milk/Wool labels too when Bale Economy is present", () => {
    const labels = COLLECTIBLE_BUFF_LABELS.Bale?.(
      gameWithSkills({ "Double Bale": 3, "Bale Economy": 1 }),
    );

    const descriptions = labels?.map((l) => l.shortDescription);
    expect(descriptions).toEqual(
      expect.arrayContaining(["+0.3 Egg", "+0.3 Milk", "+0.3 Wool"]),
    );
  });
});
