import Decimal from "decimal.js-light";
import type { GameState, Skills } from "features/game/types/game";
import { populateSaltFarm } from "features/game/types/salt";
import { produce } from "immer";
import {
  getPointsRemoved,
  sanitizeSkillSelection,
  validateSkillSelection,
} from "./choseSkill";
import {
  MAX_FREE_POINTS,
  REGEN_AMOUNT,
  chargeSkillEdit,
  getEffectiveFreeSkillPoints,
} from "./chargeSkillEdit";
import {
  getRemainingSkillCooldownMs,
  pruneExpiredSkillCooldowns,
} from "./skillCooldown";
import type { BumpkinRevampSkillName } from "features/game/types/bumpkinSkills";
import { hasFeatureAccess } from "lib/flags";

export type UpdateSkillsAction = {
  type: "skills.updated";
  skills: Skills;
  // Optional: consume 1 Skill Reset Ticket as part of this apply. Granted
  // +REGEN_AMOUNT to the free balance (capped at MAX_FREE_POINTS) before the
  // edit is charged, atomically. Throws if the player has no ticket.
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

    // Every skill whose on/off state flipped — either being added or being
    // removed — is subject to the 7-day per-skill cooldown.
    const transitioned = [...new Set([...currentKeys, ...newKeys])].filter(
      (key) => !currentKeys.includes(key) || !newKeys.includes(key),
    ) as BumpkinRevampSkillName[];

    const cooldownMap = stateCopy.bumpkin.skillLastChangedAt;
    for (const skill of transitioned) {
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

    if (action.useTicket) {
      // A ticket is intended to offset gem cost of *removing* skills. A
      // pure-addition edit has no cost to offset, so the ticket would just
      // grant +50 free balance without anything to consume it — reject
      // defensively. The UI never offers the toggle in this case anyway.
      if (pointsRemoved === 0) {
        throw new Error(
          "Skill Reset Ticket can only be used when removing skills",
        );
      }

      const ticketBalance =
        stateCopy.inventory["Skill Reset Ticket"] ?? new Decimal(0);
      if (ticketBalance.lt(1)) {
        throw new Error("You do not have a Skill Reset Ticket");
      }

      // Apply pending regen before bumping so the cap is honored against an
      // up-to-date balance. Surplus past MAX_FREE_POINTS is wasted by design.
      const { balance, lastRegenAt } = getEffectiveFreeSkillPoints(
        stateCopy.bumpkin,
        createdAt,
      );
      stateCopy.bumpkin.freeSkillPoints = Math.min(
        MAX_FREE_POINTS,
        balance + REGEN_AMOUNT,
      );
      stateCopy.bumpkin.lastFreeSkillPointsRegenAt = lastRegenAt;
      stateCopy.inventory["Skill Reset Ticket"] = ticketBalance.minus(1);
    }

    chargeSkillEdit({
      game: stateCopy,
      pointsRemoved,
      createdAt,
    });

    stateCopy.bumpkin.skills = skills;

    // Stamp the cooldown clock for every skill that transitioned, then drop
    // any expired entries so the map stays bounded.
    const nextCooldown = { ...(stateCopy.bumpkin.skillLastChangedAt ?? {}) };
    for (const skill of transitioned) nextCooldown[skill] = createdAt;
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
