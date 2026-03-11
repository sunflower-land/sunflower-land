import React from "react";
import { ButtonPanel } from "components/ui/Panel";
import { SquareIcon } from "components/ui/SquareIcon";
import { SUNNYSIDE } from "assets/sunnyside";
import { CraftStatus } from "./CraftStatus";

interface Props {
  isPending: boolean;
  isCrafting: boolean;
  isViewingReadyItem: boolean;
  isViewingQueuedRecipe: boolean;
  isPreparingQueueSlot: boolean;
  isDisabled: boolean;
  onClearIngredients: () => void;
}

export const CraftingHeader: React.FC<Props> = ({
  isPending,
  isCrafting,
  isViewingReadyItem,
  isViewingQueuedRecipe,
  isPreparingQueueSlot,
  isDisabled,
  onClearIngredients,
}) => (
  <div className="flex pl-1 pt-1">
    <div className="flex justify-between items-center w-full mr-1">
      <CraftStatus
        isPending={isPending}
        isCrafting={isCrafting}
        isViewingReadyItem={isViewingReadyItem}
        isViewingQueuedRecipe={isViewingQueuedRecipe}
        isPreparingQueueSlot={isPreparingQueueSlot}
      />
      <ButtonPanel
        disabled={isDisabled}
        onClick={isDisabled ? undefined : onClearIngredients}
      >
        <SquareIcon icon={SUNNYSIDE.icons.cancel} width={5} />
      </ButtonPanel>
    </div>
  </div>
);
