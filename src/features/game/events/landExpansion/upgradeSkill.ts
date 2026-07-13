import Decimal from "decimal.js-light";
import { produce } from "immer";
import {
  type BumpkinRevampSkillName,
  type BumpkinSkillRevamp,
  BUMPKIN_REVAMP_SKILL_TREE,
  getSkillUpgradeCost,
} from "features/game/types/bumpkinSkills";
import type { GameState } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import { getAvailableBumpkinSkillPoints } from "./choseSkill";

export type UpgradeSkillAction = {
  type: "skill.upgraded";
  skill: BumpkinRevampSkillName;
};

type Options = {
  state: Readonly<GameState>;
  action: UpgradeSkillAction;
  createdAt?: number;
};

export function upgradeSkill({ state, action }: Options): GameState {
  return produce(state, (game) => {
    const { bumpkin } = game;

    if (!bumpkin) {
      throw new Error("You do not have a Bumpkin!");
    }

    if (!hasFeatureAccess(game, "ASCENSION_SKILLS")) {
      throw new Error("Skill upgrades are not available");
    }

    const skillData: BumpkinSkillRevamp =
      BUMPKIN_REVAMP_SKILL_TREE[action.skill];

    if (!skillData) {
      throw new Error("Skill does not exist");
    }

    const { upgrade } = skillData;

    if (!upgrade) {
      throw new Error("This skill cannot be upgraded");
    }

    if (skillData.disabled) {
      throw new Error("This skill is disabled");
    }

    const currentLevel = bumpkin.skills[action.skill] ?? 0;

    if (currentLevel < 1) {
      throw new Error("You do not own this skill");
    }

    if (currentLevel >= upgrade.maxLevel) {
      throw new Error("Skill is already at max level");
    }

    const cost = getSkillUpgradeCost(skillData.requirements.tier);

    if (getAvailableBumpkinSkillPoints(game) < cost.points) {
      throw new Error("You do not have enough skill points");
    }

    const shards = game.inventory["Ascension Shard"] ?? new Decimal(0);

    if (shards.lt(cost.shards)) {
      throw new Error("You do not have enough Ascension Shards");
    }

    game.inventory["Ascension Shard"] = shards.sub(cost.shards);
    bumpkin.skills[action.skill] = currentLevel + 1;

    return game;
  });
}
