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
import { BuildingName } from "features/game/types/buildings";

type Props = {
  cooking?: BuildingProduct;
  readyRecipes: BuildingProduct[];
  queue: BuildingProduct[];
  buildingName: BuildingName;
  buildingId: string;
  onClose: () => void;
};

const _state = (state: MachineState) => state.context.state;

export const Queue: React.FC<Props> = ({
  cooking,
  queue,
  buildingName,
  buildingId,
  readyRecipes,
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const { openModal } = useContext(ModalContext);
  const state = useSelector(gameService, _state);
  const { t } = useTranslation();
  const sortedQueue = [...queue].sort((a, b) => a.readyAt - b.readyAt);

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
            const displayItems = [...sortedQueue, ...readyRecipes];

            return (
              <QueueSlot
                key={`slot-${index}`}
                buildingName={buildingName}
                buildingId={buildingId}
                item={displayItems[index]}
                readyRecipes={readyRecipes}
              />
            );
          })}
      </div>
    </div>
  );
};
