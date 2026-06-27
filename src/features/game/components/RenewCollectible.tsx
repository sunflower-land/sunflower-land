import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "./CloseablePanel";
import { Label } from "components/ui/Label";
import React, { useContext, useState } from "react";
import { Context } from "../GameProvider";
import { useSelector } from "@xstate/react";
import type { MachineState } from "../lib/gameMachine";
import type { PlaceableLocation } from "../types/collectibles";
import type { GameState, Inventory } from "../types/game";
import type { InventoryRenewableCollectibleName } from "../lib/renewableCollectibles";
import { COLLECTIBLE_BUFF_LABELS } from "../types/collectibleItemBuffs";
import Decimal from "decimal.js-light";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const available = inventory[name] ?? new Decimal(0);
  const canRenew = available.gte(1);
  const buffLabels = COLLECTIBLE_BUFF_LABELS[name]?.(gameState);

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
            <Label type="danger" icon={SUNNYSIDE.icons.stopwatch}>
              {t("shrine.expired", { name })}
            </Label>

            <p className="text-xs">{t("renew.expired.message", { name })}</p>
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

        <div className="flex flex-wrap p-2 gap-2">
          <RequirementLabel
            type="item"
            item={name}
            balance={available}
            requirement={new Decimal(1)}
          />
        </div>
      </div>

      {showConfirmation ? (
        <div className="flex justify-between gap-1">
          <Button onClick={() => setShowConfirmation(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleRenew} disabled={!canRenew}>
            {t("renew")}
          </Button>
        </div>
      ) : (
        <div className="flex justify-between gap-1">
          <Button
            onClick={() => setShowConfirmation(true)}
            disabled={!canRenew}
          >
            {t("renew")}
          </Button>
          <Button onClick={handleRemove}>{t("remove")}</Button>
        </div>
      )}
    </>
  );
};
