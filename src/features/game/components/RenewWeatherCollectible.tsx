import { IngredientsPopover } from "components/ui/IngredientsPopover";
import { Modal } from "components/ui/Modal";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import Decimal from "decimal.js-light";
import React, { useContext, useState } from "react";
import { getKeys } from "lib/object";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { Context } from "../GameProvider";
import type { PlaceableLocation } from "../types/collectibles";
import type { MachineState } from "../lib/gameMachine";
import { useSelector } from "@xstate/react";
import type { GameState, Inventory } from "../types/game";
import { getWeatherShop, type WeatherShopItem } from "../types/calendar";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CloseButtonPanel } from "./CloseablePanel";

type Props = {
  show: boolean;
  onHide: () => void;
  name: WeatherShopItem;
  id: string;
  location: PlaceableLocation;
};

const _inventory = (state: MachineState) => state.context.state.inventory;
const _coinBalance = (state: MachineState) => state.context.state.coins;
const _gameState = (state: MachineState) => state.context.state;

export const RenewWeatherCollectible: React.FC<Props> = ({
  show,
  onHide,
  name,
  id,
  location,
}) => {
  const { gameService } = useContext(Context);

  const inventory = useSelector(gameService, _inventory);
  const coinBalance = useSelector(gameService, _coinBalance);
  const gameState = useSelector(gameService, _gameState);

  const handleRenew = () => {
    gameService.send("weatherCollectible.renewed", { name, location, id });
  };

  return (
    <Modal show={show} onHide={onHide}>
      <CloseButtonPanel onClose={onHide}>
        <RenewWeatherCollectibleContent
          handleRenew={handleRenew}
          name={name}
          inventory={inventory}
          coinBalance={coinBalance}
          gameState={gameState}
        />
      </CloseButtonPanel>
    </Modal>
  );
};

const RenewWeatherCollectibleContent: React.FC<{
  handleRenew: () => void;
  name: WeatherShopItem;
  inventory: Inventory;
  coinBalance: number;
  gameState: GameState;
}> = ({ handleRenew, name, inventory, coinBalance, gameState }) => {
  const { t } = useAppTranslation();
  const [showIngredients, setShowIngredients] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Renewal costs the same as buying a new one from the Weather Shop.
  const shopItem = getWeatherShop(gameState.island.type)[name];
  const requirements = shopItem.ingredients();
  const coinCost = shopItem.price;

  const canRenew = () => {
    if (coinBalance < coinCost) return false;

    return getKeys(requirements).every(
      (itemName) =>
        inventory[itemName]?.gte(requirements[itemName] ?? new Decimal(0)) ??
        false,
    );
  };

  const isRenewable = canRenew();

  return (
    <>
      <div className="flex flex-col gap-2 p-1">
        {showConfirmation && (
          <>
            <Label type="warning">{t("confirm.renew")}</Label>
            <p className="text-xs">{t("confirm.renew.message", { name })}</p>
          </>
        )}
        {!showConfirmation && (
          <>
            <Label type="danger">
              {t("weatherCollectible.used", { name })}
            </Label>
            <p className="text-xs">
              {t("weatherCollectible.renew.message", { name })}
            </p>
          </>
        )}
        <div
          className="flex flex-wrap p-2 gap-2 cursor-pointer"
          onClick={() => setShowIngredients(!showIngredients)}
        >
          <IngredientsPopover
            show={showIngredients}
            ingredients={getKeys(requirements)}
            onClick={() => setShowIngredients(false)}
          />
          {coinCost > 0 && (
            <RequirementLabel
              type="coins"
              balance={coinBalance}
              requirement={coinCost}
            />
          )}
          {getKeys(requirements).map((itemName) => {
            return (
              <RequirementLabel
                key={itemName}
                type="item"
                item={itemName}
                balance={inventory[itemName] ?? new Decimal(0)}
                requirement={requirements[itemName] ?? new Decimal(0)}
              />
            );
          })}
        </div>
      </div>
      {showConfirmation && (
        <div className="flex justify-between gap-1">
          <Button onClick={() => setShowConfirmation(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleRenew}>{t("renew")}</Button>
        </div>
      )}
      {!showConfirmation && (
        <div className="flex justify-between gap-1">
          <Button
            onClick={() => setShowConfirmation(true)}
            disabled={!isRenewable}
          >
            {t("renew")}
          </Button>
        </div>
      )}
    </>
  );
};
