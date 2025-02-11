import { QueueSlot } from "./QueueSlot";

import React, { useContext } from "react";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useTranslation } from "react-i18next";
import { MachineState } from "features/game/lib/gameMachine";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { BuildingProduct } from "features/game/types/game";
import { VIPAccess } from "features/game/components/VipAccess";

type Props = {
  cooking?: BuildingProduct;
  readyRecipes: BuildingProduct[];
  queue: BuildingProduct[];
  onClose: () => void;
};

const _state = (state: MachineState) => state.context.state;

export const Queue: React.FC<Props> = ({
  cooking,
  queue,
  readyRecipes,
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const { openModal } = useContext(ModalContext);
  const state = useSelector(gameService, _state);
  const { t } = useTranslation();

  return (
    <div className="mb-2">
      <div className="w-full flex justify-between">
        <Label
          className="mr-3 ml-2 mb-1"
          icon={SUNNYSIDE.icons.arrow_right}
          type="default"
        >
          {t("recipes.queue")}
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
        {Array(cooking ? 3 : 4)
          .fill(null)
          .map((_, index) => {
            const isVIP = hasVipAccess({ game: state });
            const availableSlots = isVIP ? 4 : cooking ? 0 : 1;

            const displayItems = [...queue, ...readyRecipes];

            return (
              <QueueSlot
                key={`slot-${index}`}
                item={displayItems[index]}
                isLocked={!isVIP && index >= availableSlots}
                readyRecipes={readyRecipes}
              />
            );
          })}
      </div>
    </div>
  );
};
