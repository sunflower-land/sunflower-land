import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";
import { useVipAccess } from "lib/utils/hooks/useVipAccess";
import { Context } from "features/game/GameProvider";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { VIPAccess } from "features/game/components/VipAccess";
import { SaltHarvestQueueSlot } from "./SaltHarvestQueueSlot";
import type { SaltHarvestSlotUi } from "./getSaltModalState";

type Props = {
  queueGridSlots: SaltHarvestSlotUi[];
  queueGridCapacity: number;
  now: number;
  onCloseModal: () => void;
};

const _state = (state: MachineState) => state.context.state;

export const SaltHarvestQueue: React.FC<Props> = ({
  queueGridSlots,
  queueGridCapacity,
  now,
  onCloseModal,
}) => {
  const { gameService } = useContext(Context);
  const { openModal } = useContext(ModalContext);
  const state = useSelector(gameService, _state);
  const { t } = useAppTranslation();
  const hasVip = useVipAccess({ game: state });

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
          isVIP={hasVip}
          onUpgrade={() => {
            onCloseModal();
            openModal("BUY_BANNER");
          }}
        />
      </div>

      <div className="flex flex-wrap h-fit">
        {Array.from({ length: queueGridCapacity }, (_, index) => (
          <SaltHarvestQueueSlot
            key={`salt-queue-${index}`}
            slot={queueGridSlots[index]}
            now={now}
          />
        ))}
      </div>
    </div>
  );
};
