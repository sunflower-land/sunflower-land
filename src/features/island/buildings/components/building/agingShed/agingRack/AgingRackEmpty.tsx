import React, { useMemo, useState } from "react";
import Decimal from "decimal.js-light";

import { Button } from "components/ui/Button";
import { DropdownPanel } from "components/ui/DropdownPanel";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import {
  getAgingSaltCost,
  getAgingTimeMs,
  getFishBaseXP,
  isFishName,
} from "features/game/types/aging";
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
  const [showIngredients, setShowIngredients] = useState(false);
  const merged = useMemo(() => getMergedInventory(gameState), [gameState]);

  const fishOptions = useMemo(() => {
    return Object.entries(merged)
      .filter(
        ([name, qty]) => isFishName(name) && qty !== undefined && qty.gte(1),
      )
      .map(([name]) => {
        const fish = name as FishName;
        const baseXP = getFishBaseXP(fish);
        const saltCost = getAgingSaltCost(baseXP);
        const timeMs = getAgingTimeMs(baseXP);
        return {
          value: fish,
          icon: ITEM_DETAILS[fish]?.image,
          label: (
            <div className="flex flex-col gap-1">
              <p className="text-xs">
                {ITEM_DETAILS[fish]?.translatedName ?? fish}
              </p>
              <p className="text-xxs">
                {`${saltCost} Salt · ${secondsToString(timeMs / 1000, { length: "short" })}`}
              </p>
            </div>
          ),
        };
      });
  }, [merged]);

  const recipeDef = selectedFish
    ? {
        saltCost: getAgingSaltCost(getFishBaseXP(selectedFish)),
        timeMs: getAgingTimeMs(getFishBaseXP(selectedFish)),
      }
    : undefined;

  return (
    <>
      <DropdownPanel
        options={fishOptions}
        value={selectedFish}
        placeholder={t("agingShed.agingRack.selectFish")}
        onChange={(fish) => onSelectFish(fish as FishName)}
        className="mb-1"
      />

      {selectedFish && recipeDef && (
        <InnerPanel className="mb-1">
          <Label type="default" className="text-xs mb-2 ml-1">
            {t("agingShed.agingRack.requirements")}
          </Label>
          <div
            className="flex flex-wrap p-2 gap-2 cursor-pointer"
            onClick={() => setShowIngredients(!showIngredients)}
          >
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
              requirement={new Decimal(1)}
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
