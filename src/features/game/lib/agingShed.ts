import type { UpgradableBuilding } from "../types/game";
import type { FermentationRecipeName } from "../types/fermentation";
import type {
  AgedFishName,
  FishName,
  PrimeAgedFishName,
} from "../types/fishing";
import type { SpiceRackRecipeName } from "../types/spiceRack";

export type FermentationJob = {
  id: string;
  recipe: FermentationRecipeName;
  startedAt: number;
  readyAt: number;
};

export type AgingRackSlot = {
  id: string;
  fish: FishName;
  startedAt: number;
  readyAt: number;
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
