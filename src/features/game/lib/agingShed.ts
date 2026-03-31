import type { UpgradableBuilding } from "../types/game";
import type { FermentationRecipeName } from "../types/fermentation";

export type FermentationJob = {
  id: string;
  recipe: FermentationRecipeName;
  startedAt: number;
  readyAt: number;
};

export type AgingShed = UpgradableBuilding & {
  racks: {
    aging: AgingRackSlot[];
    fermentation: FermentationJob[];
    spice: SpiceRackSlot[];
  };
};

export type AgingRackSlot = Record<string, never>;
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
