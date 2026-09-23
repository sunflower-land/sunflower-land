import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type {
  CaveRecipeName,
  CaveTileType,
} from "features/game/types/caveRecipes";
import {
  CAVE_RECIPES,
  getCaveTileCounts,
} from "features/game/types/caveRecipes";
import type { InventoryItemName } from "features/game/types/game";
import { getKeys } from "lib/object";
import { ITEM_DETAILS } from "features/game/types/images";
import { getChapterArtefact } from "features/game/types/chapters";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { useNow } from "lib/utils/hooks/useNow";
import { useSpeedUpPayment } from "features/game/lib/useSpeedUpPayment";

import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";
import { Label } from "components/ui/Label";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { ResizableBar } from "components/ui/ProgressBar";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { SpeedUpPaymentSelector } from "features/game/components/SpeedUpPaymentSelector";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import fastForward from "assets/icons/fast_forward.png";

const RECIPE_NAMES = getKeys(CAVE_RECIPES);

/** A representative item image for each recipe / buried tile kind. */
const RECIPE_IMAGE: Record<CaveRecipeName, InventoryItemName> = {
  Mushroom: "Wild Mushroom",
  Beetle: "Brown Beetle",
  Mud: "Mud",
};
// The Artefact tile's icon is the current chapter's artefact, resolved per
// render; the rest are fixed representative images.
const TILE_IMAGE: Record<Exclude<CaveTileType, "Artefact">, string> = {
  Mushroom: ITEM_DETAILS["Wild Mushroom"].image,
  Beetle: ITEM_DETAILS["Brown Beetle"].image,
  Mud: ITEM_DETAILS["Mud"].image,
};

const _game = (state: MachineState) => state.context.state;

interface Props {
  machineId: string;
  onClose: () => void;
}

/**
 * The Myco-Composter batch popover. Three states: idle (pick a mix and start),
 * growing (12h timer + gem finish), and ready (dig it up later — 430). The
 * hidden dig layout never reaches the client, so the patch shows nothing here.
 */
export const CaveMachineModal: React.FC<Props> = ({ machineId, onClose }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const game = useSelector(gameService, _game);
  const batch = game.cave?.machines[machineId]?.batch;

  const [selected, setSelected] = useState<CaveRecipeName>("Mushroom");
  const [showConfirm, setShowConfirm] = useState(false);

  const now = useNow({ live: true, autoEndAt: batch?.readyAt });
  const payment = useSpeedUpPayment({ readyAt: batch?.readyAt ?? 0, game });

  const isReady = !!batch && batch.readyAt <= now;
  const isGrowing = !!batch && !isReady;

  // Every chapter has an artefact, so a patch always buries one; the preview
  // shows the current chapter's artefact (awarded when the tile is dug in 430).
  const artefact = getChapterArtefact(now);
  const buriedCounts = getCaveTileCounts(selected, true);

  return (
    <Modal show onHide={onClose}>
      <CloseButtonPanel
        onClose={onClose}
        title={t("cave.machine", { id: machineId })}
      >
        {!batch && (
          <div className="flex flex-col items-center p-1">
            <Label type="default" className="mb-2">
              {t("cave.batch.chooseRecipe")}
            </Label>

            <div className="flex mb-2">
              {RECIPE_NAMES.map((recipe) => (
                <Box
                  key={recipe}
                  image={ITEM_DETAILS[RECIPE_IMAGE[recipe]].image}
                  isSelected={selected === recipe}
                  onClick={() => setSelected(recipe)}
                />
              ))}
            </div>

            <span className="text-sm mb-1">
              {t(`cave.recipe.${selected}` as const)}
            </span>

            <Label type="default" className="mt-1 mb-1">
              {t("cave.batch.buried")}
            </Label>
            <div className="flex flex-wrap justify-center gap-1 mb-2">
              {getKeys(buriedCounts).map((tile) => {
                const count = buriedCounts[tile];
                if (count <= 0) return null;
                const icon =
                  tile === "Artefact"
                    ? ITEM_DETAILS[artefact].image
                    : TILE_IMAGE[tile];
                return (
                  <Label key={tile} type="default" icon={icon}>
                    {count}
                  </Label>
                );
              })}
            </div>

            <div className="flex flex-col items-center w-full mb-2">
              {getKeys(CAVE_RECIPES[selected].ingredients).map((item) => (
                <RequirementLabel
                  key={item}
                  type="item"
                  item={item}
                  balance={game.inventory[item] ?? new Decimal(0)}
                  requirement={
                    CAVE_RECIPES[selected].ingredients[item] ?? new Decimal(0)
                  }
                />
              ))}
              <RequirementLabel
                type="time"
                waitSeconds={(batch ? 0 : 12 * 60 * 60) as number}
              />
            </div>

            <Button
              disabled={getKeys(CAVE_RECIPES[selected].ingredients).some(
                (item) =>
                  (game.inventory[item] ?? new Decimal(0)).lt(
                    CAVE_RECIPES[selected].ingredients[item] ?? new Decimal(0),
                  ),
              )}
              onClick={() => {
                gameService.send({
                  type: "cave.batchStarted",
                  machineId,
                  recipe: selected,
                });
                onClose();
              }}
            >
              {t("cave.batch.start")}
            </Button>
          </div>
        )}

        {isGrowing && batch && (
          <div className="flex flex-col items-center p-1">
            <Label
              type="default"
              icon={SUNNYSIDE.icons.stopwatch}
              className="mb-2"
            >
              {t("cave.batch.growing")}
            </Label>
            <span className="text-xs mb-1">
              {secondsToString(Math.max(0, (batch.readyAt - now) / 1000), {
                length: "medium",
              })}
            </span>
            <div className="w-full mb-3">
              <ResizableBar
                percentage={
                  batch.readyAt <= batch.startedAt
                    ? 100
                    : Math.min(
                        100,
                        ((now - batch.startedAt) /
                          (batch.readyAt - batch.startedAt)) *
                          100,
                      )
                }
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
                  type: "cave.batchSpedUp",
                  machineId,
                  paymentMethod: payment.paymentMethod,
                });
                setShowConfirm(false);
                onClose();
              }}
              messages={[t("cave.batch.confirmFinish")]}
              confirmButtonLabel={t("cave.batch.finishNow")}
              bodyContent={<SpeedUpPaymentSelector payment={payment} />}
              disabled={!payment.canAfford}
            />
          </div>
        )}

        {isReady && (
          <div className="flex flex-col items-center p-2">
            <Label type="success" className="mb-2">
              {t("cave.batch.ready")}
            </Label>
            <span className="text-xs text-center">
              {t("cave.batch.readyDescription")}
            </span>
          </div>
        )}
      </CloseButtonPanel>
    </Modal>
  );
};
