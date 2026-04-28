import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { useNavigate } from "react-router";
import Decimal from "decimal.js-light";

import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { HomeExpansionTier, InventoryItemName } from "features/game/types/game";
import { nextHomeExpansionTier } from "features/game/expansion/placeable/lib/interiorLayouts";
import { HOME_EXPANSION_UPGRADE_REQUIREMENTS } from "../lib/upgradeRequirements";
import { getKeys } from "lib/object";
import { hasFeatureAccess } from "lib/flags";
import upgradeImage from "assets/icons/upgrade_disc.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { RequirementLabel } from "components/ui/RequirementsLabel";

const _island = (state: MachineState) => state.context.state.island;
const _expansion = (state: MachineState) =>
  state.context.state.interior.expansion;
const _coins = (state: MachineState) => state.context.state.coins;
const _inventory = (state: MachineState) => state.context.state.inventory;
const _hasInteriorAccess = (state: MachineState) =>
  hasFeatureAccess(state.context.state, "HOME_EXPANSIONS");

/**
 * Flat "Upgrade" button + cost-confirmation modal — meant to be wrapped in
 * a MapPlacement by the caller so it sits on the gameboard at a chosen tile
 * (see UPGRADE_BUTTON_TILE in Interior.tsx / LevelOne.tsx).
 *
 * Self-hides for non-beta players, when the player isn't on volcano island,
 * and when the expansion is already maxed at level-one-full.
 *
 * Clicking opens a small panel showing the next tier's coin + inventory cost
 * and a confirm button. Confirm dispatches the `interior.upgrade` event; on
 * the first upgrade the player is auto-navigated to /level_one.
 */
export const UpgradeButton: React.FC = () => {
  const { gameService } = useContext(Context);
  const navigate = useNavigate();

  const island = useSelector(gameService, _island);
  const expansion = useSelector(gameService, _expansion);
  const coins = useSelector(gameService, _coins);
  const inventory = useSelector(gameService, _inventory);
  const hasAccess = useSelector(gameService, _hasInteriorAccess);

  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hide for non-beta players.
  if (!hasAccess) return null;
  // Only show on volcano.
  if (island.type !== "volcano") return null;

  const targetTier: HomeExpansionTier | null = expansion
    ? nextHomeExpansionTier(expansion)
    : "level-one-start";

  // Already maxed — no more upgrades available.
  if (!targetTier) return null;

  const cost = HOME_EXPANSION_UPGRADE_REQUIREMENTS[targetTier];

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
  const canAfford = hasCoins && hasInventory;

  // First upgrade unlocks a new floor; subsequent upgrades unlock new rooms
  // on the same floor.
  const upgradeCopy = expansion ? "Unlock new room" : "Unlock new floor";

  const onConfirm = () => {
    setError(null);
    const wasFirstUpgrade = !expansion;
    try {
      gameService.send({ type: "interior.upgrade" });
      setOpen(false);
      // On the very first upgrade, drop the player into the new floor.
      if (wasFirstUpgrade) {
        navigate("/level_one");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upgrade failed");
    }
  };

  return (
    <>
      <img
        src={upgradeImage}
        onClick={() => setOpen(true)}
        className="cursor-pointer"
        style={{ width: `${PIXEL_SCALE * 20}px` }}
      />
      <Modal show={open} onHide={() => setOpen(false)}>
        <CloseButtonPanel onClose={() => setOpen(false)} title="Upgrade home">
          <div className="p-2 flex flex-col gap-3">
            <p className="text-sm">{upgradeCopy}</p>
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
            <Button disabled={!canAfford} onClick={onConfirm}>
              {canAfford ? "Confirm" : "Not enough resources"}
            </Button>
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
