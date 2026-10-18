import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { getIslandName } from "features/game/types/game";
import { CAVE_TIERS, getNextCaveTier } from "features/game/types/caveTiers";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "lib/object";
import { secondsToString } from "lib/utils/time";
import { useNow } from "lib/utils/hooks/useNow";
import { useSpeedUpPayment } from "features/game/lib/useSpeedUpPayment";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { ResizableBar } from "components/ui/ProgressBar";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { SpeedUpPaymentSelector } from "features/game/components/SpeedUpPaymentSelector";
import fastForward from "assets/icons/fast_forward.png";

const _game = (state: MachineState) => state.context.state;

/**
 * The Cave expansion popover, opened from the next tier's sign. Three states:
 * idle (the next tier's cost, island gate and Expand), building (timer + gem
 * finish) and ready (open the new slot; clicking the site does the same).
 */
export const CaveExpansionModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const game = useSelector(gameService, _game);
  const construction = game.cave?.construction;
  const tier = getNextCaveTier(game.cave?.tier ?? 0);

  const [showConfirm, setShowConfirm] = useState(false);
  const now = useNow({ live: true, autoEndAt: construction?.readyAt });
  const payment = useSpeedUpPayment({
    readyAt: construction?.readyAt ?? 0,
    game,
  });

  if (!tier) return null;

  const { island, coins, ingredients, buildMs } = CAVE_TIERS[tier];
  const onIsland = hasRequiredIslandExpansion(game.island.type, island);
  const canAfford =
    game.coins >= coins &&
    getKeys(ingredients).every((item) =>
      (game.inventory[item] ?? new Decimal(0)).gte(ingredients[item] ?? 0),
    );

  const isReady = !!construction && construction.readyAt <= now;

  return (
    <Modal show onHide={onClose}>
      <CloseButtonPanel onClose={onClose} title={t("cave.expand.title")}>
        {!construction && (
          <div className="flex flex-col items-center p-1">
            <span className="text-sm text-center mb-2">
              {t("cave.expand.description", { tier })}
            </span>
            {!onIsland && (
              <Label type="danger" className="mb-2">
                {t("islandupgrade.requiredIsland", {
                  islandType: getIslandName(island),
                })}
              </Label>
            )}
            <div className="flex flex-col items-center w-full mb-2">
              {coins > 0 && (
                <RequirementLabel
                  type="coins"
                  balance={game.coins}
                  requirement={coins}
                />
              )}
              {getKeys(ingredients).map((item) => (
                <RequirementLabel
                  key={item}
                  type="item"
                  item={item}
                  balance={game.inventory[item] ?? new Decimal(0)}
                  requirement={ingredients[item] ?? new Decimal(0)}
                />
              ))}
              <RequirementLabel type="time" waitSeconds={buildMs / 1000} />
            </div>
            <Button
              disabled={!onIsland || !canAfford}
              onClick={() => {
                gameService.send({ type: "cave.expanded" });
                onClose();
              }}
            >
              {t("cave.expand.expand")}
            </Button>
          </div>
        )}

        {construction && !isReady && (
          <div className="flex flex-col items-center p-2">
            <Label type="warning" className="mb-2">
              {t("cave.expand.building")}
            </Label>
            <span className="text-xs mb-1">
              {secondsToString(
                Math.max(0, (construction.readyAt - now) / 1000),
                {
                  length: "medium",
                },
              )}
            </span>
            <div className="w-full mb-3">
              <ResizableBar
                percentage={Math.min(
                  100,
                  ((now - construction.startedAt) /
                    Math.max(
                      1,
                      construction.readyAt - construction.startedAt,
                    )) *
                    100,
                )}
                type="progress"
              />
            </div>

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
                  type: "cave.expansionSpedUp",
                  paymentMethod: payment.paymentMethod,
                });
                setShowConfirm(false);
              }}
              messages={[t("cave.expand.confirmFinish")]}
              confirmButtonLabel={t("cave.batch.finishNow")}
              bodyContent={<SpeedUpPaymentSelector payment={payment} />}
              disabled={!payment.canAfford}
            />
          </div>
        )}

        {isReady && (
          <div className="flex flex-col items-center p-2">
            <Label type="success" className="mb-2">
              {t("cave.expand.ready")}
            </Label>
            <Button
              onClick={() => {
                gameService.send({ type: "cave.expansionCompleted" });
                onClose();
              }}
            >
              {t("cave.expand.complete")}
            </Button>
          </div>
        )}
      </CloseButtonPanel>
    </Modal>
  );
};
