import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { HudContainer } from "components/ui/HudContainer";
import { OuterPanel } from "components/ui/Panel";
import type { AnimalBounty, InventoryItemName } from "features/game/types/game";
import { AnimalBountyQuickPanel } from "./AnimalBountyQuickPanel";

interface Props {
  animalTypes: InventoryItemName[];
  selectedDeal?: AnimalBounty;
  onSelect: (deal?: AnimalBounty) => void;
  onClose: () => void;
}

export const AnimalBountySellPanel: React.FC<Props> = ({
  animalTypes,
  selectedDeal,
  onSelect,
  onClose,
}) => (
  <HudContainer zIndex="z-50">
    <div className="absolute bottom-0 left-0 right-0">
      <button
        type="button"
        aria-label="Close"
        className="absolute z-20 -top-5 right-2 cursor-pointer border-0 bg-transparent p-0"
        onClick={onClose}
      >
        <img src={SUNNYSIDE.icons.chevron_down} className="h-4" alt="" />
      </button>

      <OuterPanel className="relative !max-h-[50vh] overflow-y-hidden flex flex-col">
        <div className="min-h-0 flex flex-1 overflow-hidden">
          <AnimalBountyQuickPanel
            animalTypes={animalTypes}
            selectedDeal={selectedDeal}
            onSelect={onSelect}
          />
        </div>
      </OuterPanel>
    </div>
  </HudContainer>
);
