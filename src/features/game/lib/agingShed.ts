import type { UpgradableBuilding } from "../types/game";
import type { FermentationRecipeName } from "../types/fermentation";
import type {
  AgedFishName,
  FishName,
  PrimeAgedFishName,
} from "../types/fishing";

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

export type AgingShed = UpgradableBuilding & {
  racks: {
    aging: AgingRackSlot[];
    fermentation: FermentationJob[];
    spice: SpiceRackSlot[];
  };
  lastAgingCollect?: AgingCollectResult[];
};

export type SpiceRackSlot = Record<string, never>;

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
