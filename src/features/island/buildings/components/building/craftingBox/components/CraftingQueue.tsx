import React, { useContext } from "react";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useTranslation } from "react-i18next";
import { MachineState } from "features/game/lib/gameMachine";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { CraftingQueueItem } from "features/game/types/game";
import { VIPAccess } from "features/game/components/VipAccess";
import { CraftingQueueSlot } from "./CraftingQueueSlot";

type Props = {
  product?: CraftingQueueItem;
  readyProducts: CraftingQueueItem[];
  queue: CraftingQueueItem[];
  onClose: () => void;
  selectedQueueSlot?: number | null;
  onSlotSelect?: (slotIndex: number, isEmpty: boolean) => void;
};

const _state = (state: MachineState) => state.context.state;

export const CraftingQueue: React.FC<Props> = ({
  product,
  queue,
  readyProducts,
  onClose,
  selectedQueueSlot = null,
  onSlotSelect,
}) => {
  const { gameService } = useContext(Context);
  const { openModal } = useContext(ModalContext);
  const state = useSelector(gameService, _state);
  const { t } = useTranslation();
  const sortedQueue = [...queue].sort((a, b) => a.readyAt - b.readyAt);
  const displayItems = [...sortedQueue, ...readyProducts];

  return (
    <div className="mb-2">
      <div className="w-full flex justify-between">
        <Label
          className="mr-3 ml-2 mb-1"
          icon={SUNNYSIDE.icons.arrow_right}
          type="default"
        >
          {t("crafting.queue")}
        </Label>
        <VIPAccess
          isVIP={hasVipAccess({ game: state })}
          onUpgrade={() => {
            onClose();
            openModal("BUY_BANNER");
          }}
        />
      </div>

      <div className="flex flex-wrap h-fit">
        {Array(product ? 3 : 4)
          .fill(null)
          .map((_, index) => (
            <CraftingQueueSlot
              key={`slot-${index}`}
              item={displayItems[index]}
              readyProducts={readyProducts}
              slotIndex={index}
              isSelected={selectedQueueSlot === index}
              onSelect={onSlotSelect}
            />
          ))}
      </div>
    </div>
  );
};
