import React, { useMemo } from "react";
import Decimal from "decimal.js-light";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { getFishBaseXP, isFishName } from "features/game/types/aging";
import {
  getBoostedAgingFishCost,
  getBoostedAgingSaltCost,
  getBoostedAgingTimeMs,
} from "features/game/types/agingFormulas";
import type { FishName } from "features/game/types/fishing";
import type {
  GameState,
  Inventory,
  InventoryItemName,
} from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getBasketItems,
  getChestItems,
} from "features/island/hud/components/inventory/utils/inventory";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { secondsToString } from "lib/utils/time";

function getMergedInventory(state: GameState): Inventory {
  return {
    ...getBasketItems(state.inventory),
    ...getChestItems(state),
  };
}

type Props = {
  gameState: GameState;
  selectedFish?: FishName;
  onSelectFish: (fish: FishName) => void;
  onStart: () => void;
  startDisabled: boolean;
  validationMessage?: string;
  startError?: string;
};

export const AgingRackEmpty: React.FC<Props> = ({
  gameState,
  selectedFish,
  onSelectFish,
  onStart,
  startDisabled,
  validationMessage,
  startError,
}) => {
  const { t } = useAppTranslation();
  const merged = useMemo(() => getMergedInventory(gameState), [gameState]);

  const skills = gameState.bumpkin.skills;

  const fishOptions = useMemo(() => {
    return Object.entries(merged)
      .filter(([name, qty]) => isFishName(name) && (qty?.gte(1) ?? false))
      .map(([name]) => {
        const fish = name as FishName;
        const baseXP = getFishBaseXP(fish);
        const saltCost = getBoostedAgingSaltCost(baseXP, skills);
        const timeMs = getBoostedAgingTimeMs(baseXP, skills);
        return {
          value: fish,
          icon: ITEM_DETAILS[fish]?.image,
          detail: `${saltCost} Salt · ${secondsToString(timeMs / 1000, { length: "medium" })}`,
        };
      });
  }, [merged, skills]);

  const recipeDef = selectedFish
    ? {
        saltCost: getBoostedAgingSaltCost(getFishBaseXP(selectedFish), skills),
        fishCost: getBoostedAgingFishCost(skills),
        timeMs: getBoostedAgingTimeMs(getFishBaseXP(selectedFish), skills),
      }
    : undefined;

  return (
    <>
      <InnerPanel className="mb-1">
        <Label
          type={selectedFish ? "info" : "default"}
          className="text-xs mb-2 ml-1"
          icon={selectedFish && ITEM_DETAILS[selectedFish]?.image}
        >
          {selectedFish ?? t("agingShed.agingRack.selectFish")}
        </Label>
        <div className="flex flex-wrap gap-1 px-1 pb-1 overflow-auto max-h-48 scrollable items-start">
          {fishOptions.map((opt) => {
            const fish = opt.value as FishName;

            return (
              <div
                key={fish}
                className="flex flex-col items-center shrink-0 max-w-[72px]"
              >
                <Box
                  image={opt.icon}
                  hideCount
                  isSelected={selectedFish === fish}
                  onClick={() => onSelectFish(fish)}
                />
              </div>
            );
          })}
        </div>
      </InnerPanel>

      {selectedFish && recipeDef && (
        <InnerPanel className="mb-1">
          <Label type="default" className="text-xs mb-2 ml-1">
            {t("agingShed.agingRack.requirements")}
          </Label>
          <div className="flex flex-wrap p-2 gap-2">
            <RequirementLabel
              type="item"
              item={"Salt" as InventoryItemName}
              balance={merged["Salt"] ?? new Decimal(0)}
              requirement={new Decimal(recipeDef.saltCost)}
            />
            <RequirementLabel
              type="item"
              item={selectedFish as InventoryItemName}
              balance={merged[selectedFish] ?? new Decimal(0)}
              requirement={new Decimal(recipeDef.fishCost)}
            />
            <RequirementLabel
              type="time"
              waitSeconds={recipeDef.timeMs / 1000}
            />
          </div>
        </InnerPanel>
      )}

      {validationMessage && (
        <Label type="danger" className="text-xs px-1 mb-1">
          {validationMessage}
        </Label>
      )}
      {startError && (
        <Label type="danger" className="text-xs px-1 mb-1">
          {startError}
        </Label>
      )}

      <Button disabled={startDisabled} onClick={onStart}>
        {t("agingShed.agingRack.startAging")}
      </Button>
    </>
  );
};
