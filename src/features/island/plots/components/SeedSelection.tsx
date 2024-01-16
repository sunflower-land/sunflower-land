import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import { Inventory } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { CROP_SEEDS, SEEDS, SeedName } from "features/game/types/seeds";
import React, { useState } from "react";
import { translate } from "lib/i18n/translate";

interface Props {
  onPlant: (seed: SeedName) => void;
  inventory: Inventory;
}
export const SeedSelection: React.FC<Props> = ({ onPlant, inventory }) => {
  const [seed, setSeed] = useState<SeedName>();

  const availableSeeds = getKeys(CROP_SEEDS()).filter((name) =>
    inventory[name]?.gte(1)
  );

  return (
    <>
      <div className="p-2">
        {!seed && (
          <Label className="mb-1" icon={SUNNYSIDE.icons.seeds} type="danger">
            {translate("availableSeeds.select")}
          </Label>
        )}

        {seed && (
          <Label
            className="mb-1"
            icon={ITEM_DETAILS[SEEDS()[seed].yield].image}
            type="default"
          >
            {seed}
          </Label>
        )}

        <p className="text-xs">{translate("availableSeeds.select.plant")}</p>
        <div className="flex flex-wrap my-1">
          {availableSeeds.map((name) => (
            <Box
              key={name}
              image={ITEM_DETAILS[name].image}
              count={inventory[name]}
              onClick={() => setSeed(name as SeedName)}
              isSelected={seed === name}
            />
          ))}
        </div>
      </div>
      <Button
        disabled={!seed}
        onClick={() => {
          onPlant(seed as SeedName);
        }}
      >
        {translate("availableSeeds.plant")}
      </Button>
    </>
  );
};
