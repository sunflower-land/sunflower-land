import type { GameState, Skills } from "features/game/types/game";
import { populateSaltFarm } from "features/game/types/salt";
import { produce } from "immer";
import {
  getPointsRemoved,
  sanitizeSkillSelection,
  validateSkillSelection,
} from "./choseSkill";
import { chargeSkillEdit } from "./chargeSkillEdit";
import {
  getRemainingSkillCooldownMs,
  isCooldownSkill,
  pruneExpiredSkillCooldowns,
} from "./skillCooldown";
import type { BumpkinRevampSkillName } from "features/game/types/bumpkinSkills";
import { hasFeatureAccess } from "lib/flags";

export type UpdateSkillsAction = {
  type: "skills.updated";
  skills: Skills;
  // Optional: offer 1 Skill Reset Ticket toward this apply. The ticket grants
  // +REGEN_AMOUNT free balance (capped at MAX_FREE_POINTS) and is consumed only
  // when that actually lowers the gem cost — see chargeSkillEdit.
  useTicket?: boolean;
};

type Options = {
  state: GameState;
  action: UpdateSkillsAction;
  createdAt?: number;
};

export function updateSkills({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (stateCopy) => {
    if (!hasFeatureAccess(stateCopy, "EDIT_SKILLSET")) {
      throw new Error("skills.updated requires the EDIT_SKILLSET feature flag");
    }

    if (!stateCopy.bumpkin) {
      throw new Error("You do not have a Bumpkin!");
    }

    const skills = sanitizeSkillSelection(action.skills);

    validateSkillSelection({
      state: stateCopy,
      skills,
    });

    const currentKeys = Object.keys(stateCopy.bumpkin.skills)
      .filter((key) => !!stateCopy.bumpkin?.skills[key as keyof Skills])
      .sort();
    const newKeys = Object.keys(skills).sort();
    if (
      currentKeys.length === newKeys.length &&
      currentKeys.every((key, index) => key === newKeys[index])
    ) {
      throw new Error("No skill changes to apply");
    }

    const addedSkills = newKeys.filter(
      (key) => !currentKeys.includes(key),
    ) as BumpkinRevampSkillName[];
    const removedSkills = currentKeys.filter(
      (key) => !newKeys.includes(key),
    ) as BumpkinRevampSkillName[];

    // Double Nom and Ager can't be removed until SKILL_COOLDOWN_MS after they
    // were picked. Adding any skill is always allowed and every other skill is
    // freely removable, so clearing a build never gets stuck.
    const cooldownMap = stateCopy.bumpkin.skillLastChangedAt;
    for (const skill of removedSkills) {
      if (!isCooldownSkill(skill)) continue;
      const remaining = getRemainingSkillCooldownMs(
        cooldownMap,
        skill,
        createdAt,
      );
      if (remaining > 0) {
        throw new Error(`Skill "${skill}" is on cooldown for ${remaining}ms`);
      }
    }

    const pointsRemoved = getPointsRemoved(stateCopy.bumpkin.skills, skills);

    chargeSkillEdit({
      game: stateCopy,
      pointsRemoved,
      useTicket: action.useTicket,
      createdAt,
    });

    stateCopy.bumpkin.skills = skills;

    // Stamp the pick time for any cooldown skill just added, clear it for any
    // just removed, then prune so the map stays bounded.
    const nextCooldown = { ...(stateCopy.bumpkin.skillLastChangedAt ?? {}) };
    for (const skill of addedSkills) {
      if (isCooldownSkill(skill)) nextCooldown[skill] = createdAt;
    }
    for (const skill of removedSkills) {
      if (isCooldownSkill(skill)) delete nextCooldown[skill];
    }
    pruneExpiredSkillCooldowns(nextCooldown, createdAt);
    stateCopy.bumpkin.skillLastChangedAt = nextCooldown;

    populateSaltFarm({
      gameBefore: state,
      gameAfter: stateCopy,
      now: createdAt,
    });

    return stateCopy;
  });
}
