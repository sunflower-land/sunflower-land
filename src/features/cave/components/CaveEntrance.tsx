import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import type { InventoryItemName } from "features/game/types/game";
import { Label } from "components/ui/Label";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { getKeys } from "lib/object";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { CAVE_BUILD_REQUIREMENTS } from "features/game/events/landExpansion/buildCave";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const _island = (state: MachineState) => state.context.state.island;
const _coins = (state: MachineState) => state.context.state.coins;
const _inventory = (state: MachineState) => state.context.state.inventory;

/**
 * The Cave Entrance modal — the Cave's only modal. Shown from the world-map
 * node while the Cave has not been built. Lists the entrance cost and a Build
 * button; confirming dispatches `cave.built`. On success the caller drops the
 * player into `/cave`.
 */
export const CaveEntrance: React.FC<{
  show: boolean;
  onHide: () => void;
  onBuilt: () => void;
}> = ({ show, onHide, onBuilt }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const island = useSelector(gameService, _island);
  const coins = useSelector(gameService, _coins);
  const inventory = useSelector(gameService, _inventory);

  const [error, setError] = useState<string | null>(null);

  const onSpring = hasRequiredIslandExpansion(island.type, "spring");

  const cost = CAVE_BUILD_REQUIREMENTS;
  const hasCoins = coins >= cost.coins;
  const inventoryCheck: Array<{
    name: InventoryItemName;
    required: Decimal;
    owned: Decimal;
  }> = getKeys(cost.inventory).map((name) => ({
    name,
    required: cost.inventory[name] ?? new Decimal(0),
    owned: inventory[name] ?? new Decimal(0),
  }));
  const hasInventory = inventoryCheck.every((c) => c.owned.gte(c.required));
  const canAfford = onSpring && hasCoins && hasInventory;

  const onConfirm = () => {
    setError(null);
    try {
      gameService.send({ type: "cave.built" });
      onBuilt();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("cave.buildError"));
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <CloseButtonPanel onClose={onHide} title={t("cave.title")}>
        <div className="p-2 flex flex-col gap-3 mb-1">
          <p className="text-sm">{t("cave.description")}</p>
          {!onSpring && <Label type="danger">{t("cave.requiresSpring")}</Label>}
          <div className="flex flex-col gap-1">
            <RequirementLabel
              type="coins"
              balance={coins}
              showLabel
              requirement={cost.coins}
            />
            {inventoryCheck.map((c) => (
              <RequirementLabel
                key={c.name}
                type="item"
                item={c.name}
                balance={c.owned}
                showLabel
                requirement={c.required}
              />
            ))}
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
        <Button disabled={!canAfford} onClick={onConfirm}>
          {canAfford ? t("build") : t("cave.notEnough")}
        </Button>
      </CloseButtonPanel>
    </Modal>
  );
};
