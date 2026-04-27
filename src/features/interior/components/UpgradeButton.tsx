import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { useNavigate } from "react-router";
import Decimal from "decimal.js-light";

import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { HomeExpansionTier } from "features/game/types/game";
import { nextHomeExpansionTier } from "features/game/expansion/placeable/lib/interiorLayouts";
import { HOME_EXPANSION_UPGRADE_REQUIREMENTS } from "../lib/upgradeRequirements";
import { getKeys } from "lib/object";

const _island = (state: MachineState) => state.context.state.island;
const _expansion = (state: MachineState) =>
  state.context.state.interior.expansion;
const _coins = (state: MachineState) => state.context.state.coins;
const _inventory = (state: MachineState) => state.context.state.inventory;

/**
 * Top-right "Upgrade" button shown only inside `/interior` while the player
 * is on volcano island AND the level_one floor isn't already maxed.
 *
 * Clicking opens a small panel showing the next tier's coin + inventory cost
 * and a confirm button. Confirm dispatches the `interior.upgrade` event; on
 * the first upgrade the player can also jump straight to /level_one.
 */
export const UpgradeButton: React.FC = () => {
  const { gameService } = useContext(Context);
  const navigate = useNavigate();

  const island = useSelector(gameService, _island);
  const expansion = useSelector(gameService, _expansion);
  const coins = useSelector(gameService, _coins);
  const inventory = useSelector(gameService, _inventory);

  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only show on volcano.
  if (island.type !== "volcano") return null;

  const targetTier: HomeExpansionTier | null = expansion
    ? nextHomeExpansionTier(expansion)
    : "level-one-start";

  // Already maxed — no more upgrades available.
  if (!targetTier) return null;

  const cost = HOME_EXPANSION_UPGRADE_REQUIREMENTS[targetTier];

  const hasCoins = coins >= cost.coins;
  const inventoryCheck: Array<{ name: string; required: Decimal; owned: Decimal }> =
    getKeys(cost.inventory).map((name) => ({
      name: String(name),
      required: cost.inventory[name] ?? new Decimal(0),
      owned: inventory[name] ?? new Decimal(0),
    }));
  const hasInventory = inventoryCheck.every((c) => c.owned.gte(c.required));
  const canAfford = hasCoins && hasInventory;

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
      <div
        className="absolute top-4 right-4"
        style={{ zIndex: 60, width: "auto" }}
      >
        <Button onClick={() => setOpen(true)}>Upgrade</Button>
      </div>
      <Modal show={open} onHide={() => setOpen(false)}>
        <CloseButtonPanel onClose={() => setOpen(false)} title="Upgrade home">
          <div className="p-2 flex flex-col gap-3">
            <p className="text-sm">
              {expansion
                ? `Upgrade to ${targetTier}.`
                : `Unlock the new floor (${targetTier}).`}
            </p>
            <div className="flex flex-col gap-1 text-sm">
              <div className={hasCoins ? "" : "text-red-500"}>
                Coins: {cost.coins.toLocaleString()}{" "}
                <span className="opacity-70">(you have {coins})</span>
              </div>
              {inventoryCheck.map((c) => (
                <div
                  key={c.name}
                  className={c.owned.gte(c.required) ? "" : "text-red-500"}
                >
                  {c.name}: {c.required.toString()}{" "}
                  <span className="opacity-70">
                    (you have {c.owned.toString()})
                  </span>
                </div>
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
