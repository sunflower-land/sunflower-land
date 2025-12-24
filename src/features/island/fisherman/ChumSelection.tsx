import React, { useState } from "react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import { GameState, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  CHUM_AMOUNTS,
  CHUM_DETAILS,
  Chum,
  FishingBait,
} from "features/game/types/fishing";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  getBasketItems,
  getChestItems,
} from "../hud/components/inventory/utils/inventory";

const RARE_CHUM: InventoryItemName[] = [
  "Rich Chicken",
  "Speed Chicken",
  "Fat Chicken",
];

export const ChumSelection: React.FC<{
  state: GameState;
  bait: FishingBait;
  onList: (item: Chum) => void;
  onCancel: () => void;
  initialChum?: Chum;
}> = ({ state, bait, onList, onCancel, initialChum }) => {
  const { t } = useAppTranslation();
  const [selected, setSelected] = useState<Chum | undefined>(initialChum);
  const select = (name: Chum) => {
    setSelected(name);
  };

  const items = {
    ...getBasketItems(state.inventory),
    ...getChestItems(state),
  };

  const hasRequirements =
    selected && items[selected]?.gte(CHUM_AMOUNTS[selected] ?? 0);

  return (
    <div>
      <p className="mb-1 p-1 text-xs">{t("select.resource")}</p>

      <div className="flex flex-wrap">
        {getKeys(CHUM_AMOUNTS)
          .filter((name) => !!items[name]?.gte(1))
          .filter((name) => {
            if (bait !== "Red Wiggler" && RARE_CHUM.includes(name)) {
              return false;
            }

            return true;
          })
          .map((name) => (
            <Box
              image={ITEM_DETAILS[name].image}
              count={items[name]}
              onClick={() => select(name)}
              key={name}
              isSelected={selected === name}
            />
          ))}
      </div>

      {selected && (
        <div className="p-2">
          <div className="flex justify-between">
            <Label
              type="default"
              className="mb-1"
              icon={ITEM_DETAILS[selected].image}
            >
              {selected}
            </Label>
            <Label
              type={!hasRequirements ? "danger" : "default"}
              className="mb-1"
            >
              {`${CHUM_AMOUNTS[selected]} ${selected}`}
            </Label>
          </div>
          <p className="text-xs">{CHUM_DETAILS[selected]}</p>
        </div>
      )}

      <div className="flex">
        <Button className="mr-1" onClick={() => onCancel()}>
          {t("cancel")}
        </Button>
        <Button
          disabled={!hasRequirements}
          onClick={() => onList(selected as Chum)}
        >
          {t("confirm")}
        </Button>
      </div>
    </div>
  );
};
