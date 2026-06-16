import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "./CloseablePanel";
import { Label } from "components/ui/Label";
import React, { useContext } from "react";
import { Context } from "../GameProvider";
import { useSelector } from "@xstate/react";
import type { MachineState } from "../lib/gameMachine";
import type { PlaceableLocation } from "../types/collectibles";
import type { GameState, Inventory, InventoryItemName } from "../types/game";
import {
  canRenewWeatherCollectible,
  getWeatherRenewalRequirements,
  isWeatherProtectionCollectible,
  type InventoryRenewableCollectibleName,
} from "../lib/renewableCollectibles";
import { COLLECTIBLE_BUFF_LABELS } from "../types/collectibleItemBuffs";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import Decimal from "decimal.js-light";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";

type Props = {
  show: boolean;
  onHide: () => void;
  name: InventoryRenewableCollectibleName;
  id: string;
  location: PlaceableLocation;
};

const _gameState = (state: MachineState) => state.context.state;

export const RenewCollectible: React.FC<Props> = ({
  show,
  onHide,
  name,
  id,
  location,
}) => {
  const { gameService } = useContext(Context);
  const gameState = useSelector(gameService, _gameState);
  const chestItems = getChestItems(gameState);

  const handleRenew = () => {
    gameService.send("collectible.renewed", { name, location, id });
  };

  const handleRemove = () => {
    if (isWeatherProtectionCollectible(name)) {
      gameService.send("collectible.removed", { name, location, id });
      return;
    }

    gameService.send("collectible.burned", { name, location, id });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <CloseButtonPanel onClose={onHide}>
        <RenewCollectibleContent
          handleRenew={handleRenew}
          handleRemove={handleRemove}
          name={name}
          inventory={chestItems}
          gameState={gameState}
        />
      </CloseButtonPanel>
    </Modal>
  );
};

const RenewCollectibleContent: React.FC<{
  handleRenew: () => void;
  handleRemove: () => void;
  name: InventoryRenewableCollectibleName;
  inventory: Inventory;
  gameState: GameState;
}> = ({ handleRenew, handleRemove, name, inventory, gameState }) => {
  const { t } = useAppTranslation();
  const available = inventory[name] ?? new Decimal(0);
  const isWeatherItem = isWeatherProtectionCollectible(name);
  const weatherRequirements = isWeatherItem
    ? getWeatherRenewalRequirements({ game: gameState, name })
    : undefined;
  const canRenew = isWeatherItem
    ? canRenewWeatherCollectible({ game: gameState, name })
    : available.gte(1);

  const buffLabels = COLLECTIBLE_BUFF_LABELS[name]?.(gameState);
  const showShrineLikeDisabledRenewOnly = isWeatherItem && !canRenew;

  return (
    <>
      <div className="flex flex-col gap-2 p-1">
        <>
          <Label type="danger" icon={SUNNYSIDE.icons.stopwatch}>
            {t("shrine.expired", { name })}
          </Label>
          <p className="text-xs">
            {isWeatherItem
              ? `Renew ${name} to prepare for the next weather event.`
              : t("renew.expired.message", { name })}
          </p>
        </>

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

        <div className="flex flex-wrap p-2 gap-2">
          {isWeatherItem && weatherRequirements ? (
            <>
              {Object.entries(weatherRequirements.resources ?? {}).map(
                ([itemName, requirement]) => (
                  <RequirementLabel
                    key={`${name}-${itemName}`}
                    type="item"
                    item={itemName as InventoryItemName}
                    balance={
                      gameState.inventory[itemName as InventoryItemName] ??
                      new Decimal(0)
                    }
                    requirement={requirement ?? new Decimal(0)}
                  />
                ),
              )}
              <RequirementLabel
                type="coins"
                balance={gameState.coins}
                requirement={weatherRequirements.coins ?? 0}
              />
            </>
          ) : (
            <RequirementLabel
              type="item"
              item={name}
              balance={available}
              requirement={new Decimal(1)}
            />
          )}
        </div>
      </div>

      {showShrineLikeDisabledRenewOnly ? (
        <div className="flex justify-between gap-1">
          <Button onClick={handleRenew} disabled>
            {t("renew")}
          </Button>
        </div>
      ) : (
        <div className="flex justify-between gap-1">
          <Button onClick={handleRenew} disabled={!canRenew}>
            {t("renew")}
          </Button>
          <Button onClick={handleRemove}>{t("remove")}</Button>
        </div>
      )}
    </>
  );
};
