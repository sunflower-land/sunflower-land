import React, { useContext, useState } from "react";
import Decimal from "decimal.js-light";
import { useSelector } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  getTranslatedItemName,
  ITEM_DETAILS,
} from "features/game/types/images";
import {
  FLOWER_CROSS_BREED_AMOUNTS,
  FLOWERS,
  type FlowerCrossBreedName,
  type FlowerName,
  type FlowerSeedName,
} from "features/game/types/flowers";
import { SEASONAL_SEEDS } from "features/game/types/seeds";
import { Label } from "components/ui/Label";
import { ButtonPanel } from "components/ui/Panel";
import { SquareIcon } from "components/ui/SquareIcon";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { SimpleBox } from "features/island/hud/components/codex/SimpleBox";
import { getFlowerBySeed } from "features/island/hud/components/codex/lib/utils";
import { getKeys } from "lib/object";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const FLOWERS_BY_SEED = getFlowerBySeed();

const _discovered = (state: MachineState) =>
  state.context.state.flowers.discovered;
const _inventory = (state: MachineState) => state.context.state.inventory;
const _season = (state: MachineState) => state.context.state.season.season;

interface Props {
  onSelect: (seed: FlowerSeedName, crossbreed: FlowerCrossBreedName) => void;
}

/**
 * Lists the seed + crossbreed combinations the player has already grown, so
 * they can replant a flower without clicking through every crossbreed again.
 * Only reads `flowers.discovered`, so nothing undiscovered is revealed.
 */
export const FlowerBedRecipes: React.FC<Props> = ({ onSelect }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const discovered = useSelector(gameService, _discovered);
  const inventory = useSelector(gameService, _inventory);
  const season = useSelector(gameService, _season);

  const [flower, setFlower] = useState<FlowerName>();

  const isFound = (name: FlowerName) => (discovered[name] ?? []).length > 0;

  if (!flower) {
    return (
      <div className="p-2 max-h-[400px] overflow-y-auto scrollable">
        <p className="text-xs mb-2">{t("flowerBedRecipes.pickFlower")}</p>
        {getKeys(FLOWERS_BY_SEED).map((seed) => (
          <div key={seed} className="mb-2">
            <Label type="default" icon={ITEM_DETAILS[seed].image}>
              {getTranslatedItemName(seed)}
            </Label>
            <div className="flex flex-wrap">
              {FLOWERS_BY_SEED[seed].map((name) => (
                <SimpleBox
                  key={name}
                  image={ITEM_DETAILS[name].image}
                  silhouette={!isFound(name)}
                  onClick={isFound(name) ? () => setFlower(name) : undefined}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const seed = FLOWERS[flower].seed;
  const seedCount = inventory[seed] ?? new Decimal(0);
  const isInSeason = SEASONAL_SEEDS[season].includes(seed);
  const hasSeed = seedCount.gte(1);

  // Sorted by crossbreed amount only, so rows don't move as inventory changes.
  const crossbreeds = [...(discovered[flower] ?? [])].sort(
    (a, b) =>
      (FLOWER_CROSS_BREED_AMOUNTS[seed][a] ?? 0) -
      (FLOWER_CROSS_BREED_AMOUNTS[seed][b] ?? 0),
  );

  return (
    <div className="p-2">
      <div className="flex items-center mb-2">
        <img
          src={SUNNYSIDE.icons.arrow_left}
          className="cursor-pointer"
          alt={t("back")}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            marginRight: `${PIXEL_SCALE * 4}px`,
          }}
          onClick={() => setFlower(undefined)}
        />
        <Label type="default" icon={ITEM_DETAILS[flower].image}>
          {getTranslatedItemName(flower)}
        </Label>
      </div>

      {!isInSeason && (
        <Label type="danger" icon={ITEM_DETAILS[seed].image} className="mb-2">
          {t("flowerBedRecipes.outOfSeason", {
            seed: getTranslatedItemName(seed),
          })}
        </Label>
      )}
      {isInSeason && !hasSeed && (
        <Label type="danger" icon={ITEM_DETAILS[seed].image} className="mb-2">
          {t("flowerBedContent.required", {
            amount: 1,
            item: getTranslatedItemName(seed),
          })}
        </Label>
      )}

      <p className="text-xs mb-2">{t("flowerBedRecipes.tapRecipe")}</p>

      <div className="flex flex-col gap-1">
        {crossbreeds.map((crossbreed) => {
          const amount = FLOWER_CROSS_BREED_AMOUNTS[seed][crossbreed] ?? 0;
          const balance = inventory[crossbreed] ?? new Decimal(0);
          const canPlant = isInSeason && hasSeed && balance.gte(amount);

          return (
            <ButtonPanel
              key={crossbreed}
              disabled={!canPlant}
              onClick={canPlant ? () => onSelect(seed, crossbreed) : undefined}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-1 min-w-0">
                <SquareIcon icon={ITEM_DETAILS[seed].image} width={10} />
                <span className="text-xs">{"+"}</span>
                <SquareIcon icon={ITEM_DETAILS[crossbreed].image} width={10} />
                <span className="text-xs ml-1">
                  {getTranslatedItemName(crossbreed)}
                </span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <RequirementLabel
                  type="item"
                  item={crossbreed}
                  balance={balance}
                  requirement={new Decimal(amount)}
                />
                <img
                  src={SUNNYSIDE.icons.chevron_right}
                  alt=""
                  style={{ width: `${PIXEL_SCALE * 5}px` }}
                />
              </div>
            </ButtonPanel>
          );
        })}
      </div>
    </div>
  );
};
