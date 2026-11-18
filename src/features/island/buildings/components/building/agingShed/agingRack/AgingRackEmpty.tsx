import React, { useState } from "react";
import Decimal from "decimal.js-light";

import { Button } from "components/ui/Button";
import { StackedPanelView } from "components/ui/StackedPanelView";
import { Label } from "components/ui/Label";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { getFishBaseXP } from "features/game/types/aging";
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
import type { BoostName, GameState, Inventory } from "features/game/types/game";
import {
  ITEM_DETAILS,
  getTranslatedItemName,
} from "features/game/types/images";
import {
  getBasketItems,
  getChestItems,
} from "features/island/hud/components/inventory/utils/inventory";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { secondsToString } from "lib/utils/time";
import { getKeys } from "lib/object";
import {
  type Consumable,
  CONSUMABLES,
  FISH,
} from "features/game/types/consumables";
import { getFoodExpBoost } from "features/game/expansion/lib/boosts";
import { BoostsDisplay } from "components/ui/layouts/BoostsDisplay";
import classNames from "classnames";
import levelup from "assets/icons/level_up.png";
import { formatNumber } from "lib/utils/formatNumber";

function getMergedInventory(state: GameState): Inventory {
  return {
    ...getBasketItems(state.inventory),
    ...getChestItems(state),
  };
}

function hasEnoughAgingIngredients(
  merged: Inventory,
  fishName: FishName,
  gameState: GameState,
): boolean {
  const baseXP = getFishBaseXP(fishName);
  const { cost: saltCost } = getBoostedAgingSaltCost(baseXP, gameState);
  const fishCost = getBoostedAgingFishCost(gameState);
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

  const fishOptions = getKeys(FISH)
    .sort((a, b) => FISH[a].experience - FISH[b].experience)
    .map((fishName) => {
      const baseXP = getFishBaseXP(fishName);
      const { cost: saltCost } = getBoostedAgingSaltCost(baseXP, gameState);
      const { timeMs } = getBoostedAgingTimeMs(baseXP, gameState);
      const saltLabel = getTranslatedItemName("Salt");

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
    <StackedPanelView
      title={
        selectedFish
          ? getTranslatedItemName(selectedFish)
          : t("agingShed.agingRack.selectFish")
      }
      titleIcon={selectedFish && ITEM_DETAILS[selectedFish]?.image}
      selected={!!selectedFish}
      options={fishOptions.map((opt) => ({
        id: opt.value,
        image: opt.icon,
        count: merged[opt.value],
        selected: selectedFish === opt.value,
        onClick: () => onSelectFish(opt.value),
        status: hasEnoughAgingIngredients(merged, opt.value, gameState)
          ? "ready"
          : "missing",
      }))}
      panels={[
        selectedFish && {
          id: "details",
          title: t("agingShed.agingRack.requirements"),
          content: (
            <SelectedFishDetails
              selectedFish={selectedFish}
              merged={merged}
              gameState={gameState}
              now={now}
            />
          ),
        },
      ]}
      errors={[validationMessage, startError]}
      action={
        <Button disabled={startDisabled} onClick={onStart}>
          {t("agingShed.agingRack.startAging")}
        </Button>
      }
    />
  );
};

const SelectedFishDetails: React.FC<{
  selectedFish: FishName;
  merged: Inventory;
  gameState: GameState;
  now: number;
}> = ({ selectedFish, merged, gameState, now }) => {
  const [boostDisplay, setBoostDisplay] = useState<
    { boosts: { name: BoostName; value: string }[]; baseXp: number } | undefined
  >(undefined);
  const { t } = useAppTranslation();
  const { chance: primeAgedChance } = getPrimeAgedChance(gameState);
  const agedChance = 100 - primeAgedChance;
  const recipeDef = selectedFish
    ? {
        saltCost: getBoostedAgingSaltCost(
          getFishBaseXP(selectedFish),
          gameState,
        ).cost,
        fishCost: getBoostedAgingFishCost(gameState),
        timeMs: getBoostedAgingTimeMs(getFishBaseXP(selectedFish), gameState)
          .timeMs,
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
    <>
      <div className="flex flex-col justify-between items-start">
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
              ? setBoostDisplay({
                  boosts: boostedAgedFishXp.boostsUsed,
                  baseXp: baseAgedFishXp,
                })
              : undefined
          }
        >
          <Label
            type="transparent"
            className="text-xs ml-3"
            icon={ITEM_DETAILS[agedFishName]?.image}
          >
            {t("agingShed.agingRack.outputChance", {
              item: getTranslatedItemName(agedFishName),
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
              ? setBoostDisplay({
                  boosts: boostedPrimeAgedFishXp.boostsUsed,
                  baseXp: basePrimeAgedFishXp,
                })
              : undefined
          }
        >
          <Label
            type="transparent"
            className="text-xs ml-3"
            icon={ITEM_DETAILS[primeAgedFishName]?.image}
          >
            {t("agingShed.agingRack.outputChance", {
              item: getTranslatedItemName(primeAgedFishName),
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
        {boostDisplay && (
          <BoostsDisplay
            boosts={boostDisplay.boosts}
            base={{
              value: `${formatNumber(boostDisplay.baseXp)}XP`,
              icon: levelup,
            }}
            show={!!boostDisplay}
            state={gameState}
            onClick={() => setBoostDisplay(undefined)}
          />
        )}
      </div>
    </>
  );
};
