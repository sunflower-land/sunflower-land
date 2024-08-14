import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { getCurrentSeason, SeasonName } from "features/game/types/seasons";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import React from "react";

type SeasonalMutants = {
  banner: string;
  chicken: InventoryItemName;
  flower: InventoryItemName;
  fish: InventoryItemName;
};

const DEFAULT: SeasonalMutants = {
  chicken: "Fat Chicken",
  flower: "Red Pansy",
  fish: "Anchovy",
  banner: "?",
};

const SEASONAL_MUTANTS: Partial<Record<SeasonName, SeasonalMutants>> = {
  "Pharaoh's Treasure": {
    chicken: "Pharaoh Chicken",
    flower: "Desert Rose",
    fish: "Lemon Shark",
    banner: SUNNYSIDE.announcement.pharaohSeasonRares,
  },
};

export const SeasonalMutants: React.FC = () => {
  const mutants = SEASONAL_MUTANTS[getCurrentSeason()];

  if (!mutants) {
    return null;
  }
  return (
    <InnerPanel className="mb-1">
      <div className="p-1">
        <div className="flex justify-between mb-2">
          <Label className="-ml-1" type="default">
            Mutants
          </Label>
        </div>
        <p className="text-xs">Discover the seasonal mutants!</p>
        <img className="my-1 w-full rounded-md" src={mutants.banner} />

        <NoticeboardItems
          iconWidth={8}
          items={[
            {
              text: `Collect eggs to discover the ${mutants.chicken}.`,
              icon: ITEM_DETAILS.Chicken.image,
            },
            {
              text: `Fish in the depths for the ${mutants.fish}.`,

              icon: ITEM_DETAILS.Rod.image,
            },
            {
              text: `Experiment with flowers to discover the ${mutants.flower}.`,
              icon: ITEM_DETAILS["Red Pansy"].image,
            },
          ]}
        />
      </div>
    </InnerPanel>
  );
};
