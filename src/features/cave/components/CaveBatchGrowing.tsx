import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { getCavePatchComposition } from "features/game/types/cavePatch";
import type { CaveBatch } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { useSpeedUpPayment } from "features/game/lib/useSpeedUpPayment";

import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { ResizableBar } from "components/ui/ProgressBar";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { SpeedUpPaymentSelector } from "features/game/components/SpeedUpPaymentSelector";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import fastForward from "assets/icons/fast_forward.png";
import { getCaveBatchPercentage } from "features/cave/lib/caveBatchProgress";
import { CaveBuriedTiles, RECIPE_IMAGE } from "./CaveBuriedTiles";

const _game = (state: MachineState) => state.context.state;

interface Props {
  machineId: string;
  batch: CaveBatch;
  now: number;
  onClose: () => void;
}

/**
 * The growing batch, shown while its slot is selected (like a filled Aging
 * Shed slot): time left, progress, what it will bury and the gem finish.
 */
export const CaveBatchGrowing: React.FC<Props> = ({
  machineId,
  batch,
  now,
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const game = useSelector(gameService, _game);
  const payment = useSpeedUpPayment({ readyAt: batch.readyAt, game });
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <InnerPanel className="mb-1">
        <div className="flex flex-wrap gap-1 ml-1 mb-2">
          <Label
            type="default"
            icon={ITEM_DETAILS[RECIPE_IMAGE[batch.recipe]].image}
          >
            {t(`cave.recipe.${batch.recipe}` as const)}
          </Label>
          <Label type="default" icon={SUNNYSIDE.icons.stopwatch}>
            {t("cave.batch.growing")}
          </Label>
        </div>
        <div className="mx-1 mb-2">
          <span className="text-xs">
            {secondsToString(Math.max(0, (batch.readyAt - now) / 1000), {
              length: "medium",
            })}
          </span>
          <ResizableBar
            percentage={getCaveBatchPercentage(batch, now)}
            type="progress"
          />
        </div>
        <CaveBuriedTiles
          counts={getCavePatchComposition(batch.recipe, batch.skills)}
        />
      </InnerPanel>

      <Button
        disabled={!payment.canAffordAnyMethod}
        onClick={() => {
          payment.resetPaymentMethod();
          setShowConfirm(true);
        }}
      >
        <div className="flex items-center justify-center gap-1">
          <img src={fastForward} className="h-5" />
          <span>{t("cave.batch.finishNow")}</span>
          {!payment.canPayWithCoins && (
            <>
              <span className="text-sm">{payment.gemCost}</span>
              <img src={ITEM_DETAILS.Gem.image} className="h-5" />
            </>
          )}
        </div>
      </Button>

      <ConfirmationModal
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          gameService.send({
            type: "cave.batchSpedUp",
            machineId,
            paymentMethod: payment.paymentMethod,
          });
          gameService.send("SAVE");
          setShowConfirm(false);
          onClose();
        }}
        messages={[t("cave.batch.confirmFinish")]}
        confirmButtonLabel={t("cave.batch.finishNow")}
        bodyContent={<SpeedUpPaymentSelector payment={payment} />}
        disabled={!payment.canAfford}
      />
    </>
  );
};
