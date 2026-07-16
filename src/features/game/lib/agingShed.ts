import type { UpgradableBuilding } from "../types/game";
import type { FermentationRecipeName } from "../types/fermentation";
import type {
  AgedFishName,
  FishName,
  PrimeAgedFishName,
} from "../types/fishing";
import type { SpiceRackRecipeName } from "../types/spiceRack";

// The Ager rank applied when the job was started, so its output collects at the
// rank whose inputs were paid. Optional for backwards compatibility with jobs
// queued before the stamp existed; jobs queued before Ager was upgradeable store
// a boolean (`true` = the old single-rank behaviour).
export type AgingSkillStamp = { Ager?: boolean | number };

/**
 * The Ager rank a rack job was started at. Legacy jobs stored a boolean, so
 * `true` resolves to rank 1 (the 2x it was charged for) and `false`/absent to 0.
 */
export const getStampedAgerLevel = (stamp?: AgingSkillStamp): number => {
  const stored = stamp?.Ager;
  if (stored === true) return 1;
  return typeof stored === "number" ? stored : 0;
};

export type FermentationJob = {
  id: string;
  recipe: FermentationRecipeName;
  startedAt: number;
  readyAt: number;
  skills?: AgingSkillStamp;
};

export type AgingRackSlot = {
  id: string;
  fish: FishName;
  startedAt: number;
  readyAt: number;
  skills?: AgingSkillStamp;
};

export type AgingCollectResult = {
  item: AgedFishName | PrimeAgedFishName;
  primeAged: boolean;
};

export type SpiceRackJob = {
  id: string;
  recipe: SpiceRackRecipeName;
  startedAt: number;
  readyAt: number;
  skills?: AgingSkillStamp;
};

export type AgingShed = UpgradableBuilding & {
  racks: {
    aging: AgingRackSlot[];
    fermentation: FermentationJob[];
    spice: SpiceRackJob[];
  };
  lastAgingCollect?: AgingCollectResult[];
};

/** Fresh aging shed state — call per farm/template to avoid shared nested array aliasing. */
export function createInitialAgingShed(): AgingShed {
  return {
    level: 1,
    racks: {
      aging: [],
      fermentation: [],
      spice: [],
    },
  };
}
