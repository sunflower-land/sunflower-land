import type { UpgradableBuilding } from "../types/game";
import type { FermentationRecipeName } from "../types/fermentation";
import type {
  AgedFishName,
  FishName,
  PrimeAgedFishName,
} from "../types/fishing";
import type { SpiceRackRecipeName } from "../types/spiceRack";

// Marks whether an Ager-stamped skill was applied at the time of starting the job.
// Optional for backwards compatibility with jobs queued before the stamp existed.
export type AgingSkillStamp = { Ager?: boolean };

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
