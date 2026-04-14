import React, { useState } from "react";
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
  getPrimeAgedChance,
} from "features/game/types/agingFormulas";
import type {
  AgedFishName,
  FishName,
  PrimeAgedFishName,
} from "features/game/types/fishing";
import type {
  BoostName,
  GameState,
  Inventory,
  Skills,
} from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getBasketItems,
  getChestItems,
} from "features/island/hud/components/inventory/utils/inventory";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { secondsToString } from "lib/utils/time";
import { getObjectEntries } from "lib/object";
import { SUNNYSIDE } from "assets/sunnyside";
import { Consumable, CONSUMABLES, FISH } from "features/game/types/consumables";
import { getFoodExpBoost } from "features/game/expansion/lib/boosts";
import { BoostsDisplay } from "components/ui/layouts/BoostsDisplay";
import classNames from "classnames";

function getMergedInventory(state: GameState): Inventory {
  return {
    ...getBasketItems(state.inventory),
    ...getChestItems(state),
  };
}

function hasEnoughAgingIngredients(
  merged: Inventory,
  fishName: FishName,
  skills: Skills,
): boolean {
  const baseXP = getFishBaseXP(fishName);
  const saltCost = getBoostedAgingSaltCost(baseXP, skills);
  const fishCost = getBoostedAgingFishCost(skills);
  return (
    (merged["Salt"]?.gte(saltCost) && merged[fishName]?.gte(fishCost)) ?? false
  );
}

type Props = {
  gameState: GameState;
  now: number;
  selectedFish?: FishName;
  onSelectFish: (fish: FishName) => void;
  onStart: () => void;
  startDisabled: boolean;
  validationMessage?: string;
  startError?: string;
};

export const AgingRackEmpty: React.FC<Props> = ({
  gameState,
  now,
  selectedFish,
  onSelectFish,
  onStart,
  startDisabled,
  validationMessage,
  startError,
}) => {
  const { t } = useAppTranslation();
  const merged = getMergedInventory(gameState);

  const skills = gameState.bumpkin.skills;

  const fishOptions = getObjectEntries(merged)
    .filter(
      (entry): entry is [FishName, Decimal | undefined] =>
        isFishName(entry[0]) && (entry[1]?.gte(1) ?? false),
    )
    .sort(([a], [b]) => FISH[a].experience - FISH[b].experience)
    .map(([fishName]) => {
      const baseXP = getFishBaseXP(fishName);
      const saltCost = getBoostedAgingSaltCost(baseXP, skills);
      const timeMs = getBoostedAgingTimeMs(baseXP, skills);
      const saltLabel = ITEM_DETAILS["Salt"]?.translatedName ?? "Salt";

      return {
        value: fishName,
        icon: ITEM_DETAILS[fishName]?.image,
        detail: t("agingShed.agingRack.fishOptionDetail", {
          saltCost,
          salt: saltLabel,
          time: secondsToString(timeMs / 1000, { length: "medium" }),
        }),
      };
    });

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
            const fishName = opt.value;

            return (
              <div
                key={fishName}
                className="flex flex-col items-center shrink-0 max-w-[72px]"
              >
                <Box
                  image={opt.icon}
                  hideCount
                  isSelected={selectedFish === fishName}
                  onClick={() => onSelectFish(fishName)}
                  secondaryImage={
                    hasEnoughAgingIngredients(merged, fishName, skills)
                      ? SUNNYSIDE.icons.confirm
                      : SUNNYSIDE.icons.cancel
                  }
                />
              </div>
            );
          })}
        </div>
      </InnerPanel>

      {selectedFish && (
        <SelectedFishDetails
          selectedFish={selectedFish}
          merged={merged}
          skills={skills}
          gameState={gameState}
          now={now}
        />
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

const SelectedFishDetails: React.FC<{
  selectedFish: FishName;
  merged: Inventory;
  skills: Skills;
  gameState: GameState;
  now: number;
}> = ({ selectedFish, merged, skills, gameState, now }) => {
  const [boostDisplayBoosts, setBoostsUsed] = useState<
    { name: BoostName; value: string }[] | undefined
  >(undefined);
  const { t } = useAppTranslation();
  const primeAgedChance = getPrimeAgedChance(skills);
  const agedChance = 100 - primeAgedChance;
  const selectedFishLabel =
    ITEM_DETAILS[selectedFish]?.translatedName ?? selectedFish;
  const recipeDef = selectedFish
    ? {
        saltCost: getBoostedAgingSaltCost(getFishBaseXP(selectedFish), skills),
        fishCost: getBoostedAgingFishCost(skills),
        timeMs: getBoostedAgingTimeMs(getFishBaseXP(selectedFish), skills),
      }
    : undefined;
  if (!recipeDef) {
    return null;
  }

  const agedFishName: AgedFishName = `Aged ${selectedFish}`;
  const primeAgedFishName: PrimeAgedFishName = `Prime Aged ${selectedFish}`;
  const agedFish: Consumable = CONSUMABLES[agedFishName];
  const primeAgedFish: Consumable = CONSUMABLES[primeAgedFishName];
  const boostedAgedFishXp = getFoodExpBoost({
    food: agedFish,
    game: gameState,
    createdAt: now,
  });
  const baseAgedFishXp = agedFish.experience;
  const isAgedFishXpBoosted = boostedAgedFishXp.boostsUsed.length > 0;

  const boostedPrimeAgedFishXp = getFoodExpBoost({
    food: primeAgedFish,
    game: gameState,
    createdAt: now,
  });
  const basePrimeAgedFishXp = primeAgedFish.experience;
  const isPrimeAgedFishXpBoosted = boostedPrimeAgedFishXp.boostsUsed.length > 0;

  return (
    <InnerPanel className="mb-1">
      <div className="flex flex-col justify-between items-start">
        <Label type="default" className="text-xs ml-1">
          {t("agingShed.agingRack.requirements")}
        </Label>
        <div className="flex flex-wrap p-2 gap-2">
          <RequirementLabel
            type="item"
            item={"Salt"}
            balance={merged["Salt"] ?? new Decimal(0)}
            requirement={new Decimal(recipeDef.saltCost)}
          />
          <RequirementLabel
            type="item"
            item={selectedFish}
            balance={merged[selectedFish] ?? new Decimal(0)}
            requirement={new Decimal(recipeDef.fishCost)}
          />
          <RequirementLabel type="time" waitSeconds={recipeDef.timeMs / 1000} />
        </div>
      </div>
      <div className="flex flex-col justify-between items-start">
        <Label type="default" className="text-xs mb-2 ml-1">
          {t("agingShed.agingRack.output")}
        </Label>
        <div
          className={classNames(
            "flex flex-col sm:flex-row justify-between w-full pl-2",
            {
              "cursor-pointer": isAgedFishXpBoosted,
            },
          )}
          onClick={() =>
            isAgedFishXpBoosted
              ? setBoostsUsed(boostedAgedFishXp.boostsUsed)
              : undefined
          }
        >
          <Label
            type="transparent"
            className="text-xs ml-3"
            icon={ITEM_DETAILS[`Aged ${selectedFish}`]?.image}
          >
            {t("agingShed.agingRack.outputChance", {
              item: t("agingShed.agingRack.agedFishLabel", {
                fish: selectedFishLabel,
              }),
              chance: agedChance,
            })}
          </Label>
          <div className="flex flex-row items-start">
            {isAgedFishXpBoosted && (
              <RequirementLabel
                type="xp"
                xp={boostedAgedFishXp.boostedExp}
                boosted
              />
            )}
            {baseAgedFishXp !== undefined && (
              <RequirementLabel
                type="xp"
                xp={new Decimal(baseAgedFishXp)}
                strikethrough={!!isAgedFishXpBoosted}
              />
            )}
          </div>
        </div>
        <p className="text-sm my-2 ml-3">{t("agingShed.agingRack.or")}</p>
        <div
          className={classNames(
            "flex flex-col sm:flex-row justify-between w-full pl-2",
            {
              "cursor-pointer": isPrimeAgedFishXpBoosted,
            },
          )}
          onClick={() =>
            isPrimeAgedFishXpBoosted
              ? setBoostsUsed(boostedPrimeAgedFishXp.boostsUsed)
              : undefined
          }
        >
          <Label
            type="transparent"
            className="text-xs ml-3"
            icon={ITEM_DETAILS[`Prime Aged ${selectedFish}`]?.image}
          >
            {t("agingShed.agingRack.outputChance", {
              item: t("agingShed.agingRack.primeAgedFishLabel", {
                fish: selectedFishLabel,
              }),
              chance: primeAgedChance,
            })}
          </Label>
          <div className="flex flex-row items-start">
            {isPrimeAgedFishXpBoosted && (
              <RequirementLabel
                type="xp"
                xp={boostedPrimeAgedFishXp.boostedExp}
                boosted
              />
            )}
            {basePrimeAgedFishXp !== undefined && (
              <RequirementLabel
                type="xp"
                xp={new Decimal(basePrimeAgedFishXp)}
                strikethrough={!!isPrimeAgedFishXpBoosted}
              />
            )}
          </div>
        </div>
        {boostDisplayBoosts && (
          <BoostsDisplay
            boosts={boostDisplayBoosts}
            show={!!boostDisplayBoosts}
            state={gameState}
            onClick={() => setBoostsUsed(undefined)}
          />
        )}
      </div>
    </InnerPanel>
  );
};
