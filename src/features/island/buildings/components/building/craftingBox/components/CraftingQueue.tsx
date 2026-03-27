import React, { useContext } from "react";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { MachineState } from "features/game/lib/gameMachine";
import { useVipAccess } from "lib/utils/hooks/useVipAccess";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { CraftingQueueItem } from "features/game/types/game";
import { VIPAccess } from "features/game/components/VipAccess";
import { CraftingQueueSlot } from "./CraftingQueueSlot";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

type Props = {
  readyProducts: CraftingQueueItem[];
  /** Display order must match CraftTab's liveDisplayItems for slot indices to align */
  displayItems: CraftingQueueItem[];
  onClose: () => void;
  selectedItemId: string | null;
  selectedPreparingSlotIndex: number;
  onSlotSelect?: (
    slotIndex: number,
    isEmpty: boolean,
    item?: CraftingQueueItem,
  ) => void;
};

const _state = (state: MachineState) => state.context.state;

export const CraftingQueue: React.FC<Props> = ({
  readyProducts,
  displayItems,
  onClose,
  selectedItemId,
  selectedPreparingSlotIndex,
  onSlotSelect,
}) => {
  const { gameService } = useContext(Context);
  const { openModal } = useContext(ModalContext);
  const state = useSelector(gameService, _state);
  const { t } = useAppTranslation();

  return (
    <div className="mb-2">
      <div className="w-full flex">
        <Label
          className="mr-3 ml-2 mb-1"
          icon={SUNNYSIDE.icons.arrow_right}
          type="default"
        >
          {t("crafting.queue")}
        </Label>
        <VIPAccess
          isVIP={useVipAccess({ game: state })}
          onUpgrade={() => {
            onClose();
            openModal("BUY_BANNER");
          }}
        />
      </div>

      <div className="flex flex-wrap h-fit items-start">
        {Array(4)
          .fill(null)
          .map((_, index) => {
            const matchByPreparing =
              selectedPreparingSlotIndex > 0 &&
              selectedPreparingSlotIndex === index;
            const matchById = displayItems[index]?.id === selectedItemId;
            const isSelected = matchByPreparing || matchById;
            return (
              <div key={`slot-wrapper-${index}`} className="flex">
                <CraftingQueueSlot
                  key={`slot-${index}`}
                  item={displayItems[index]}
                  readyProducts={readyProducts}
                  slotIndex={index}
                  isSelected={isSelected}
                  onSelect={onSlotSelect}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};
