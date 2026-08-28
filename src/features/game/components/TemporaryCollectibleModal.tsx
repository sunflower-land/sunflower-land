import { SUNNYSIDE } from "assets/sunnyside";
import { IngredientsPopover } from "components/ui/IngredientsPopover";
import { Modal } from "components/ui/Modal";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import Decimal from "decimal.js-light";
import React, { useContext, useState } from "react";
import { getKeys } from "lib/object";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { useSelector } from "@xstate/react";
import { secondsToString } from "lib/utils/time";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";
import { ITEM_DETAILS, getTranslatedItemName } from "../types/images";
import { Context } from "../GameProvider";
import type { MachineState } from "../lib/gameMachine";
import type { PlaceableLocation } from "../types/collectibles";
import type { GameState, Inventory } from "../types/game";
import { COLLECTIBLE_BUFF_LABELS } from "../types/collectibleItemBuffs";
import { getExpiryCooldown } from "../lib/collectibleBuilt";
import {
  getExtensionCost,
  type ExtendableCollectibleName,
} from "../lib/collectibleExtension";
import { CloseButtonPanel } from "./CloseablePanel";

type Props = {
  show: boolean;
  onHide: () => void;
  name: ExtendableCollectibleName;
  id: string;
  location: PlaceableLocation;
  /** Current expiry of THIS placement, including any earlier extension. */
  expiresAt: number;
  /**
   * Whether this player can pay to top the booster up right now. False when
   * visiting or without the SPEED_BOOSTS flag, in which case this is a read-only
   * detail panel — the boost and its time remaining, with nothing to buy.
   */
  canExtend: boolean;
};

const _gameState = (state: MachineState) => state.context.state;
const _coinBalance = (state: MachineState) => state.context.state.coins;

/**
 * The detail view for a placed temporary collectible: what it boosts and how
 * long it has left, plus the option to extend it where that is available. Opened
 * by clicking the collectible itself.
 */
export const TemporaryCollectibleModal: React.FC<Props> = ({
  show,
  onHide,
  name,
  id,
  location,
  expiresAt,
  canExtend,
}) => {
  const { gameService } = useContext(Context);
  const gameState = useSelector(gameService, _gameState);
  const coinBalance = useSelector(gameService, _coinBalance);

  const handleExtend = () => {
    gameService.send("collectible.extended", { name, location, id });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <CloseButtonPanel onClose={onHide}>
        <TemporaryCollectibleContent
          handleExtend={handleExtend}
          name={name}
          expiresAt={expiresAt}
          canExtend={canExtend}
          // Chest balances, not raw inventory: the placement being extended still
          // counts towards the inventory, but cannot pay for its own extension.
          inventory={getChestItems(gameState)}
          coinBalance={coinBalance}
          gameState={gameState}
        />
      </CloseButtonPanel>
    </Modal>
  );
};

const TemporaryCollectibleContent: React.FC<{
  handleExtend: () => void;
  name: ExtendableCollectibleName;
  expiresAt: number;
  canExtend: boolean;
  inventory: Inventory;
  coinBalance: number;
  gameState: GameState;
}> = ({
  handleExtend,
  name,
  expiresAt,
  canExtend,
  inventory,
  coinBalance,
  gameState,
}) => {
  const { t } = useAppTranslation();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);

  const { totalSeconds: secondsToExpire } = useCountdown(expiresAt);
  const { coins: coinCost, ingredients } = getExtensionCost(name);
  const extraSeconds = getExpiryCooldown(name, gameState) / 1000;

  const canAfford =
    coinBalance >= coinCost &&
    getKeys(ingredients).every((itemName) =>
      (inventory[itemName] ?? new Decimal(0)).gte(
        ingredients[itemName] ?? new Decimal(0),
      ),
    );

  // Belt and braces: the host component swaps to its expired branch and unmounts
  // this modal the moment the booster lapses, but its countdown and the one above
  // tick on separate intervals - so refuse an extension the reducer would reject.
  const canPayNow = canExtend && canAfford && secondsToExpire > 0;

  const buffLabels = COLLECTIBLE_BUFF_LABELS[name]?.(gameState);
  const addedTime = secondsToString(extraSeconds, {
    length: "short",
    removeTrailingZeros: true,
  });

  return (
    <>
      <div className="flex flex-col gap-2 p-1">
        {showConfirmation ? (
          <>
            <Label type="warning">{t("confirm.extend")}</Label>
            <p className="text-xs">
              {t("confirm.extend.message", { name, time: addedTime })}
            </p>
          </>
        ) : (
          <>
            <Label type="default" icon={ITEM_DETAILS[name].image}>
              {getTranslatedItemName(name)}
            </Label>
            {canExtend && (
              <p className="text-xs">
                {t("extend.collectible.message", { name })}
              </p>
            )}
          </>
        )}

        {buffLabels && (
          <div className="flex flex-wrap gap-2">
            {buffLabels.map(
              (
                { labelType, boostTypeIcon, boostedItemIcon, shortDescription },
                index,
              ) => (
                <Label
                  key={`${name}-${index}`}
                  type={labelType}
                  icon={boostTypeIcon}
                  secondaryIcon={boostedItemIcon}
                >
                  {shortDescription}
                </Label>
              ),
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
            {t("time.remaining", {
              time: secondsToString(secondsToExpire, {
                length: "medium",
                isShortFormat: true,
                removeTrailingZeros: true,
              }),
            })}
          </Label>
          {canExtend && (
            <Label type="success" icon={SUNNYSIDE.icons.stopwatch}>
              {t("extend.collectible.added", { time: addedTime })}
            </Label>
          )}
        </div>

        {canExtend && (
          <div
            className="flex flex-wrap p-2 gap-2 cursor-pointer"
            onClick={() => setShowIngredients(!showIngredients)}
          >
            <IngredientsPopover
              show={showIngredients}
              ingredients={getKeys(ingredients)}
              onClick={() => setShowIngredients(false)}
            />
            {coinCost > 0 && (
              <RequirementLabel
                type="coins"
                balance={coinBalance}
                requirement={coinCost}
              />
            )}
            {getKeys(ingredients).map((itemName) => (
              <RequirementLabel
                key={itemName}
                type="item"
                item={itemName}
                balance={inventory[itemName] ?? new Decimal(0)}
                requirement={ingredients[itemName] ?? new Decimal(0)}
              />
            ))}
          </div>
        )}
      </div>

      {canExtend &&
        (showConfirmation ? (
          <div className="flex justify-between gap-1">
            <Button onClick={() => setShowConfirmation(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleExtend} disabled={!canPayNow}>
              {t("extend")}
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setShowConfirmation(true)}
            disabled={!canPayNow}
          >
            {t("extend")}
          </Button>
        ))}
    </>
  );
};
