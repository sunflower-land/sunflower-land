import { KNOWN_IDS } from "features/game/types";
import {
  type ComposterName,
  type Worm,
  composterDetails,
} from "features/game/types/composters";
import type { BoostName, GameState } from "features/game/types/game";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { isWearableActive } from "features/game/lib/wearables";
import { prng } from "lib/prng";
import { SKILL_RANKS, getSkillLevel } from "features/game/types/bumpkinSkills";

export const WORM_AMOUNTS: Record<Worm, number[]> = {
  Earthworm: [2, 3, 3, 3, 4],
  Grub: [2, 2, 2, 3, 3],
  "Red Wiggler": [1, 1, 2, 2, 2, 3],
};

type WormBoost = {
  delta: number;
  boostsUsed: { name: BoostName; value: string }[];
};

function getWormAdjustment(state: GameState): WormBoost {
  const { skills } = state.bumpkin;
  const boostsUsed: { name: BoostName; value: string }[] = [];
  let delta = 0;

  if (isWearableActive({ name: "Bucket O' Worms", game: state })) {
    delta += 1;
    boostsUsed.push({ name: "Bucket O' Worms", value: "+1" });
  }

  const wormyTreatLevel = getSkillLevel(skills, "Wormy Treat");
  if (wormyTreatLevel) {
    const v = SKILL_RANKS["Wormy Treat"].ranks[wormyTreatLevel - 1];
    delta += v;
    boostsUsed.push({ name: "Wormy Treat", value: `+${v}` });
  }

  const compostingOverhaulLevel = getSkillLevel(skills, "Composting Overhaul");
  if (compostingOverhaulLevel) {
    const v =
      SKILL_RANKS["Composting Overhaul"].ranks[compostingOverhaulLevel - 1];
    delta += v;
    boostsUsed.push({ name: "Composting Overhaul", value: `+${v}` });
  }

  const compostingRevampLevel = getSkillLevel(skills, "Composting Revamp");
  if (compostingRevampLevel) {
    const v =
      SKILL_RANKS["Composting Revamp"].debuff[compostingRevampLevel - 1];
    delta -= v;
    boostsUsed.push({ name: "Composting Revamp", value: `-${v}` });
  }

  if (isWearableActive({ name: "Saw Fish", game: state })) {
    delta += 1;
    boostsUsed.push({ name: "Saw Fish", value: "+1" });
  }

  if (isCollectibleBuilt({ name: "Deep Sea Slug", game: state })) {
    delta += 1;
    boostsUsed.push({ name: "Deep Sea Slug", value: "+1" });
  }

  return { delta, boostsUsed };
}

export function getWormRange({
  state,
  building,
}: {
  state: GameState;
  building: ComposterName;
}): {
  min: number;
  max: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const { worm } = composterDetails[building];
  const amounts = WORM_AMOUNTS[worm];
  const { delta, boostsUsed } = getWormAdjustment(state);
  return {
    min: Math.max(0, Math.min(...amounts) + delta),
    max: Math.max(0, Math.max(...amounts) + delta),
    boostsUsed,
  };
}

export function rollWormAmount({
  state,
  building,
  farmId,
  counter,
}: {
  state: GameState;
  building: ComposterName;
  farmId: number;
  counter: number;
}): {
  worms: number;
  boostsUsed: { name: BoostName; value: string }[];
} {
  const { worm } = composterDetails[building];
  const amounts = WORM_AMOUNTS[worm];
  const roll = prng({
    farmId,
    itemId: KNOWN_IDS[worm],
    counter,
    criticalHitName: "Native",
  });
  const base = amounts[Math.floor(roll * amounts.length)];
  const { delta, boostsUsed } = getWormAdjustment(state);
  return {
    worms: Math.max(0, base + delta),
    boostsUsed,
  };
}
