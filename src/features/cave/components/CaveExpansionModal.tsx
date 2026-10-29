import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { getIslandName } from "features/game/types/game";
import { CAVE_TIERS, getNextCaveTier } from "features/game/types/caveTiers";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "lib/object";
import { useNow } from "lib/utils/hooks/useNow";
import { useSpeedUpPayment } from "features/game/lib/useSpeedUpPayment";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { ResizableBar } from "components/ui/ProgressBar";
import { InnerPanel } from "components/ui/Panel";
import { SpeedUpPaymentSelector } from "features/game/components/SpeedUpPaymentSelector";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getReturnValues } from "lib/utils/hooks/useCountdown";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { CAVE_MYCO_BIN_IMAGES } from "features/cave/lib/caveImages";

const _game = (state: MachineState) => state.context.state;

/**
 * The Cave expansion popover, opened from the next tier's sign. Three states:
 * idle (the next tier's cost, island gate and Expand), building (laid out like
 * a land expansion: timer, what it unlocks and Speed up) and ready (open the
 * new slot; clicking the site does the same).
 */
export const CaveExpansionModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const game = useSelector(gameService, _game);
  const construction = game.cave?.construction;
  const tier = getNextCaveTier(game.cave?.tier ?? 0);

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
  const isBuilding = !!construction && !isReady;

  return (
    <Modal show onHide={onClose}>
      <CloseButtonPanel
        onClose={onClose}
        title={isBuilding ? undefined : t("cave.expand.title")}
      >
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

        {isBuilding && construction && (
          <>
            <div className="p-1">
              <Label type="default" icon={SUNNYSIDE.icons.stopwatch}>
                {t("crafting.inProgress")}
              </Label>
              <p className="text-sm my-2">
                {t("crafting.readySoon", {
                  name: t("cave.machine", { id: tier }),
                })}
              </p>
              <div className="flex items-center gap-x-1 mb-1">
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
                <TimerDisplay
                  time={getReturnValues(
                    Math.max(0, construction.readyAt - now),
                  )}
                />
              </div>
              <SpeedUpPaymentSelector payment={payment} />
            </div>

            {/* What the expansion opens up, like a land expansion's nodes. */}
            <InnerPanel className="mb-1 p-1">
              <Label type="info" className="mb-1">
                {t("cave.expand.unlocks")}
              </Label>
              <div className="flex items-center gap-2">
                <img
                  src={CAVE_MYCO_BIN_IMAGES.empty}
                  className="flex-none"
                  style={{ width: `${PIXEL_SCALE * 40}px` }}
                />
                <div className="flex flex-col items-start">
                  <Label type="default" className="mb-1">
                    {t("cave.machine", { id: tier })}
                  </Label>
                  <p className="text-xs ml-0.5">
                    {t("cave.expand.patchDescription")}
                  </p>
                </div>
              </div>
            </InnerPanel>

            <div className="flex">
              <Button onClick={onClose}>{t("close")}</Button>
              <Button
                disabled={!payment.canAfford}
                className="relative ml-1"
                onClick={() =>
                  gameService.send({
                    type: "cave.expansionSpedUp",
                    paymentMethod: payment.paymentMethod,
                  })
                }
              >
                {t("gems.speedUp")}
                {!payment.canPayWithCoins && (
                  <Label
                    type={payment.canAfford ? "default" : "danger"}
                    icon={ITEM_DETAILS.Gem.image}
                    className="flex absolute right-0 -top-5"
                  >
                    {payment.gemCost}
                  </Label>
                )}
              </Button>
            </div>
          </>
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
