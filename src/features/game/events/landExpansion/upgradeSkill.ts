import Decimal from "decimal.js-light";
import { produce } from "immer";
import {
  type BumpkinRevampSkillName,
  type BumpkinSkillRevamp,
  BUMPKIN_REVAMP_SKILL_TREE,
  getSkillUpgradeCost,
  getSkillUpgradeTierRequirement,
} from "features/game/types/bumpkinSkills";
import type { GameState } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import {
  getAvailableBumpkinSkillPoints,
  getUnlockedTierForTree,
} from "./choseSkill";
import { getSkillCooldown } from "./skillUsed";

export type UpgradeSkillAction = {
  type: "skill.upgraded";
  skill: BumpkinRevampSkillName;
};

type Options = {
  state: Readonly<GameState>;
  action: UpgradeSkillAction;
  createdAt?: number;
};

export function upgradeSkill({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
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

    // Same-tree investment gate: each rank-up requires the tree unlocked one tier
    // further than the last (capped at the max tier).
    const requiredTier = getSkillUpgradeTierRequirement(
      skillData.requirements.tier,
      currentLevel,
    );
    const { availableTier } = getUnlockedTierForTree(skillData.tree, bumpkin);
    if (availableTier < requiredTier) {
      throw new Error(`You need to unlock tier ${requiredTier} first`);
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

    // Power-skill cooldowns shrink with rank and are evaluated live against the
    // current rank. If the skill is on cooldown when it is upgraded, recomputing
    // the gate with the shorter cooldown would retroactively shorten — or clear —
    // the active cooldown. Capture the effective cooldown at the old rank first,
    // then re-anchor `previousPowerUseAt` so the current ready time is preserved;
    // the shorter cooldown only applies to the next use.
    const prevUse = bumpkin.previousPowerUseAt?.[action.skill];
    const oldCooldown = getSkillCooldown({
      cooldown: skillData.requirements.cooldown ?? 0,
      state: game,
      skillName: action.skill,
    });

    bumpkin.skills[action.skill] = currentLevel + 1;

    if (prevUse !== undefined && prevUse + oldCooldown > createdAt) {
      const newCooldown = getSkillCooldown({
        cooldown: skillData.requirements.cooldown ?? 0,
        state: game,
        skillName: action.skill,
      });
      bumpkin.previousPowerUseAt![action.skill] =
        prevUse + (oldCooldown - newCooldown);
    }

    return game;
  });
}
