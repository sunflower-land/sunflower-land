import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/craftables";
import { FRUIT_SEEDS } from "features/game/types/fruits";
import { Inventory } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { SEEDS, SeedName } from "features/game/types/seeds";
import React, { useState } from "react";

interface Props {
  onPlant: (seed: SeedName) => void;
  inventory: Inventory;
}
export const SeedSelection: React.FC<Props> = ({ onPlant, inventory }) => {
  const [seed, setSeed] = useState<SeedName>();

  const availableSeeds = getKeys(inventory).filter(
    (name) =>
      name in SEEDS() && !(name in FRUIT_SEEDS()) && inventory[name]?.gte(1)
  );

  return (
    <>
      <div className="p-2">
        {!seed && (
          <Label className="mb-1" icon={SUNNYSIDE.icons.seeds} type="danger">
            Seed not selected
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

        <p className="text-xs">What seed would you like to select and plant?</p>
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
        Plant
      </Button>
    </>
  );
};
