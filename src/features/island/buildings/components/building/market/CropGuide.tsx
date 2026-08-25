import { InnerPanel } from "components/ui/Panel";
import { Chip } from "components/ui/Chip";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { useContext, useMemo, useRef, useState } from "react";
import { SEASON_ICONS } from "./SeasonalSeeds";
import { SUNNYSIDE } from "assets/sunnyside";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import seasonIcon from "assets/icons/season.webp";
import lightningIcon from "assets/icons/lightning.png";
import { getKeys } from "lib/object";
import {
  CROP_SEEDS,
  type CropName,
  CROPS,
  getCropCategory,
  GREENHOUSE_SEEDS,
  type GreenHouseCropName,
  type ProduceName,
} from "features/game/types/crops";
import { SEASONAL_SEEDS, type SeedName } from "features/game/types/seeds";
import { EXOTIC_CROPS, type ExoticCropName } from "features/game/types/beans";
import { Label } from "components/ui/Label";
import { FLOWER_SEEDS, type FlowerSeedName } from "features/game/types/flowers";
import {
  GREENHOUSE_FRUIT_SEEDS,
  PATCH_FRUIT,
  PATCH_FRUIT_SEEDS,
} from "features/game/types/fruits";
import { secondsToString } from "lib/utils/time";
import { SELLABLE } from "features/game/events/landExpansion/sellCrop";
import { GREENHOUSE_CROP_TIME_SECONDS } from "features/game/lib/greenhouseGrowTimes";
import { useGame } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { translate } from "lib/i18n/translate";
import { isFullMoonBerry } from "features/game/events/landExpansion/seedBought";
import fullMoon from "assets/icons/full_moon.png";
import { BoostsDisplay } from "components/ui/layouts/BoostsDisplay";
import type { BoostName, GameState } from "features/game/types/game";
import { getCropPlotTime } from "features/game/events/landExpansion/plant";
import { getFruitPatchTime } from "features/game/events/landExpansion/fruitPlanted";
import {
  getGreenhouseCropTime,
  SEED_TO_PLANT,
} from "features/game/events/landExpansion/plantGreenhouse";
import { getFlowerTime } from "features/game/events/landExpansion/plantFlower";
import { useNow } from "lib/utils/hooks/useNow";
import classNames from "classnames";
import { Context } from "features/game/GameProvider";
import { getPreActionDisplay } from "features/game/lib/timerDisplay";
import { getSeedBoostWindows } from "features/game/lib/seedBoostWindows";
import {
  getBoostContributionEntries,
  getSeedBoostContributions,
} from "features/game/lib/boostContributions";
import {
  INITIAL_STOCK,
  INVENTORY_LIMIT,
  getSeedInventoryLimitMultiplier,
  isBuildingReady,
} from "features/game/lib/constants";
import stockIcon from "assets/icons/stock.webp";
import { getSkillLevel, SKILL_RANKS } from "features/game/types/bumpkinSkills";
import Decimal from "decimal.js-light";

type GrowthTime = {
  seconds: number;
  boostsUsed: { name: BoostName; value: string }[];
};

type GuideCategory = "crops" | "fruits" | "greenhouse" | "flowers" | "exotics";

export const CropGuide = () => {
  const { gameState } = useGame();
  const state = gameState.context.state;
  const inventory = state.inventory;
  const { t } = useAppTranslation();
  const now = useNow();
  const [showBoostsKey, setShowBoostsKey] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<GuideCategory>("crops");

  const categories: {
    id: GuideCategory;
    label: string;
    icon: string;
  }[] = [
    {
      id: "crops",
      label: t("cropGuide.crops"),
      icon: ITEM_DETAILS.Sunflower.image,
    },
    {
      id: "fruits",
      label: t("cropGuide.fruits"),
      icon: ITEM_DETAILS.Apple.image,
    },
    {
      id: "greenhouse",
      label: t("cropGuide.greenhouse"),
      icon: ITEM_DETAILS.Olive.image,
    },
    {
      id: "flowers",
      label: t("cropGuide.flower"),
      icon: ITEM_DETAILS["Sunpetal Seed"].image,
    },
    {
      id: "exotics",
      label: t("cropGuide.exotics"),
      icon: ITEM_DETAILS["Giant Apple"].image,
    },
  ];

  return (
    <InnerPanel
      className="scrollable max-h-[360px] overflow-y-scroll overflow-x-hidden"
      onClick={() => setShowBoostsKey(null)}
    >
      <div className="p-1">
        <NoticeboardItems
          items={[
            {
              text: t("cropGuide.earnCoins"),
              icon: SUNNYSIDE.ui.coins,
            },

            {
              text: t("cropGuide.payAttentionToSeason"),
              icon: seasonIcon,
            },
            {
              text: t("cropGuide.capacityLimits"),
              icon: SUNNYSIDE.icons.basket,
            },
            ...(gameState.context.state.island.type === "basic"
              ? [
                  {
                    text: t("cropGuide.tutorialAlwaysSpring"),
                    icon: SEASON_ICONS["spring"],
                  },
                ]
              : []),
          ]}
        />
      </div>
      <div className="mb-2 flex flex-wrap justify-center gap-2 px-1">
        {categories.map((category) => (
          <Chip
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            selected={selectedCategory === category.id}
            icon={category.icon}
            className="shrink-0 whitespace-nowrap"
          >
            {category.label}
          </Chip>
        ))}
      </div>

      {selectedCategory === "crops" &&
        getKeys({ ...CROP_SEEDS }).map((seed, index) => {
          const crop = CROP_SEEDS[seed].yield as CropName;
          return (
            <CropRow
              key={seed}
              crop={crop}
              seed={seed}
              seconds={CROPS[crop].harvestSeconds}
              coins={CROPS[crop].sellPrice}
              state={state}
              now={now}
              alternateBg={index % 2 === 0}
              showBoostsKey={showBoostsKey}
              setShowBoostsKey={setShowBoostsKey}
            />
          );
        })}
      {selectedCategory === "fruits" && (
        <>
          {!inventory["Fruit Patch"] && (
            <Label type="danger" className="mb-2">
              {t("cropGuide.fruitPatchRequired")}
            </Label>
          )}
          <p className="ml-2 mb-2 text-xs">
            {t("cropGuide.fruit.description")}
          </p>
          {getKeys({ ...PATCH_FRUIT_SEEDS }).map((seed, index) => {
            const crop = PATCH_FRUIT_SEEDS[seed].yield;
            return (
              <CropRow
                key={seed}
                seed={seed}
                crop={crop}
                seconds={PATCH_FRUIT_SEEDS[seed].plantSeconds}
                coins={PATCH_FRUIT[crop].sellPrice}
                state={state}
                now={now}
                alternateBg={index % 2 === 0}
                showBoostsKey={showBoostsKey}
                setShowBoostsKey={setShowBoostsKey}
              />
            );
          })}
        </>
      )}
      {selectedCategory === "greenhouse" && (
        <>
          {!inventory.Greenhouse && (
            <Label type="danger" className="mb-2">
              {t("cropGuide.greenhouseRequired")}
            </Label>
          )}
          {getKeys({ ...GREENHOUSE_FRUIT_SEEDS, ...GREENHOUSE_SEEDS }).map(
            (seed, index) => {
              const crop = {
                ...GREENHOUSE_FRUIT_SEEDS,
                ...GREENHOUSE_SEEDS,
              }[seed].yield as GreenHouseCropName;
              return (
                <CropRow
                  key={seed}
                  crop={crop}
                  seed={seed}
                  seconds={GREENHOUSE_CROP_TIME_SECONDS[crop]}
                  coins={SELLABLE[crop].sellPrice}
                  state={state}
                  now={now}
                  alternateBg={index % 2 === 0}
                  showBoostsKey={showBoostsKey}
                  setShowBoostsKey={setShowBoostsKey}
                />
              );
            },
          )}
        </>
      )}
      {selectedCategory === "flowers" && (
        <>
          {!inventory["Flower Bed"] && (
            <Label type="danger" className="mb-2">
              {t("cropGuide.flowerbedRequired")}
            </Label>
          )}
          <p className="ml-2 mb-2 text-xs">
            {t("cropGuide.flower.description")}
          </p>
          {getKeys({ ...FLOWER_SEEDS }).map((seed, index) => (
            <FlowerRow
              key={seed}
              seed={seed}
              seconds={FLOWER_SEEDS[seed].plantSeconds}
              state={state}
              alternateBg={index % 2 === 0}
              showBoostsKey={showBoostsKey}
              setShowBoostsKey={setShowBoostsKey}
            />
          ))}
        </>
      )}
      {selectedCategory === "exotics" && (
        <>
          <p className="ml-2 mb-2 text-xs">
            {t("cropGuide.discoverExoticsDuringSpecialEvents")}
          </p>
          {getKeys({ ...EXOTIC_CROPS }).map((crop, index) => (
            <ExoticRow
              key={crop}
              crop={crop}
              coins={EXOTIC_CROPS[crop].sellPrice}
              alternateBg={index % 2 === 0}
            />
          ))}
        </>
      )}
    </InnerPanel>
  );
};

export const CropRow: React.FC<{
  crop: ProduceName;
  seed: SeedName;
  seconds: number;
  coins: number;
  state: GameState;
  now: number;
  alternateBg?: boolean;
  showBoostsKey: string | null;
  setShowBoostsKey: (key: string | null) => void;
}> = ({
  crop,
  seed,
  seconds,
  coins,
  state,
  now,
  alternateBg,
  showBoostsKey,
  setShowBoostsKey,
}) => {
  const seasons = getKeys(SEASONAL_SEEDS).filter((season) =>
    SEASONAL_SEEDS[season].includes(seed as SeedName),
  );
  const { t } = useAppTranslation();
  const boostedTime = useMemo(
    () => getSeedGrowthTime({ crop, seed, state, now }),
    [crop, seed, state, now],
  );

  return (
    <div
      className={`flex justify-between items-center p-1 ${
        alternateBg ? "bg-[#ead4aa] rounded-md" : ""
      }`}
    >
      <div className="flex items-center flex-1 min-w-0">
        <div className="flex items-center min-w-24 max-w-32 sm:min-w-32 sm:max-w-40 mr-4 shrink-0">
          <img src={ITEM_DETAILS[crop].image} className="w-6 h-auto mr-2" />
          <div className="flex-1 min-w-0">
            <p className="text-xs break-words" title={crop}>
              {crop}
            </p>
            <p className="text-xxs">{t(getCropCategory(crop))}</p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col min-w-0">
            <GrowthTimeCell
              boostKey={`${seed}-growth-time`}
              seed={seed}
              baseSeconds={seconds}
              boostedTime={boostedTime}
              state={state}
              showBoostsKey={showBoostsKey}
              setShowBoostsKey={setShowBoostsKey}
            />
            <div className="flex items-center">
              <img src={SUNNYSIDE.ui.coins} className="w-3 mr-1" />
              <p className="text-xxs">{coins.toLocaleString()}</p>
            </div>
          </div>
          <SeedCapacityLimits
            seed={seed}
            state={state}
            showBoostsKey={showBoostsKey}
            setShowBoostsKey={setShowBoostsKey}
          />
        </div>
      </div>

      <div className="flex items-center shrink-0">
        {seasons.map((season) => (
          <img
            key={season}
            src={SEASON_ICONS[season]}
            className="w-5 sm:w-6 ml-1"
          />
        ))}
        {isFullMoonBerry(seed) && (
          <img src={fullMoon} className="w-5 sm:w-6 ml-1" />
        )}
      </div>
    </div>
  );
};

export const FlowerRow: React.FC<{
  seed: FlowerSeedName;
  seconds: number;
  state: GameState;
  alternateBg?: boolean;
  showBoostsKey: string | null;
  setShowBoostsKey: (key: string | null) => void;
}> = ({
  seed,
  seconds,
  state,
  alternateBg,
  showBoostsKey,
  setShowBoostsKey,
}) => {
  const seasons = getKeys(SEASONAL_SEEDS).filter((season) =>
    SEASONAL_SEEDS[season].includes(seed as SeedName),
  );
  const { t } = useAppTranslation();
  const boostedTime = useMemo(() => getFlowerTime(seed, state), [seed, state]);

  return (
    <div
      className={`flex justify-between items-center p-1 ${
        alternateBg ? "bg-[#ead4aa] rounded-md" : ""
      }`}
    >
      <div className="flex items-center flex-1 min-w-0">
        <div className="flex items-center min-w-24 max-w-32 sm:min-w-32 sm:max-w-40 mr-4 shrink-0">
          <img src={ITEM_DETAILS[seed].image} className="w-6 h-auto mr-2" />
          <div className="flex-1 min-w-0">
            <p className="text-xs break-words" title={seed}>
              {seed}
            </p>
            <p className="text-xxs">{t("crops.flower")}</p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col min-w-0">
            <GrowthTimeCell
              boostKey={`${seed}-growth-time`}
              seed={seed}
              baseSeconds={seconds}
              boostedTime={boostedTime}
              state={state}
              showBoostsKey={showBoostsKey}
              setShowBoostsKey={setShowBoostsKey}
            />
          </div>
          <SeedCapacityLimits
            seed={seed}
            state={state}
            showBoostsKey={showBoostsKey}
            setShowBoostsKey={setShowBoostsKey}
          />
        </div>
      </div>

      <div className="flex items-center shrink-0">
        {seasons.map((season) => (
          <img
            key={season}
            src={SEASON_ICONS[season]}
            className="w-5 sm:w-6 ml-1"
          />
        ))}
      </div>
    </div>
  );
};

const SeedCapacityLimits: React.FC<{
  seed: SeedName;
  state: GameState;
  showBoostsKey: string | null;
  setShowBoostsKey: (key: string | null) => void;
}> = ({ seed, state, showBoostsKey, setShowBoostsKey }) => {
  const { inventoryLimit, restockLimit, baseRestockLimit, baseInventoryLimit } =
    useMemo(
      () => ({
        inventoryLimit: INVENTORY_LIMIT(state)[seed],
        restockLimit: INITIAL_STOCK(state)[seed],
        baseRestockLimit: INITIAL_STOCK()[seed],
        baseInventoryLimit: getBaseInventoryLimit(seed),
      }),
      [seed, state],
    );

  if (
    !inventoryLimit ||
    !restockLimit ||
    !baseInventoryLimit ||
    !baseRestockLimit
  ) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1">
      <CapacityLimit
        seed={seed}
        baseAmount={baseInventoryLimit.toString()}
        amount={inventoryLimit.toString()}
        icon={SUNNYSIDE.icons.basket}
        boostKey={`${seed}-inventory-limit`}
        state={state}
        showBoostsKey={showBoostsKey}
        setShowBoostsKey={setShowBoostsKey}
      />
      <CapacityLimit
        seed={seed}
        baseAmount={baseRestockLimit.toString()}
        amount={restockLimit.toString()}
        icon={stockIcon}
        boostKey={`${seed}-restock-limit`}
        state={state}
        showBoostsKey={showBoostsKey}
        setShowBoostsKey={setShowBoostsKey}
      />
    </div>
  );
};

const CapacityLimit: React.FC<{
  seed: SeedName;
  baseAmount: string;
  amount: string;
  icon: string;
  boostKey: string;
  state: GameState;
  showBoostsKey: string | null;
  setShowBoostsKey: (key: string | null) => void;
}> = ({
  seed,
  baseAmount,
  amount,
  icon,
  boostKey,
  state,
  showBoostsKey,
  setShowBoostsKey,
}) => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const boosts = getSeedCapacityBoosts(state, seed);
  const isBoosted = amount !== baseAmount && boosts.length > 0;

  if (!isBoosted) return <CapacityAmount amount={amount} icon={icon} />;

  return (
    <button
      ref={anchorRef}
      type="button"
      className="flex items-center cursor-pointer relative"
      aria-expanded={showBoostsKey === boostKey}
      aria-controls={`${boostKey}-panel`}
      onClick={(e) => {
        e.stopPropagation();
        setShowBoostsKey(showBoostsKey === boostKey ? null : boostKey);
      }}
    >
      <CapacityAmount amount={amount} icon={icon} />
      <img src={SUNNYSIDE.icons.lightning} className="w-3 mx-1" />
      <p className="text-xxs line-through">{baseAmount}</p>
      <BoostsDisplay
        boosts={boosts}
        show={showBoostsKey === boostKey}
        state={state}
        onClick={() =>
          setShowBoostsKey(showBoostsKey === boostKey ? null : boostKey)
        }
        className="-translate-x-1/2"
        portalAlign="center"
        anchorRef={anchorRef}
      />
    </button>
  );
};

const CapacityAmount: React.FC<{ amount: string; icon: string }> = ({
  amount,
  icon,
}) => (
  <div className="flex items-center">
    <img src={icon} className="w-3 mr-1" />
    <p className="text-xxs">{amount}</p>
  </div>
);

const getBaseInventoryLimit = (seed: SeedName) => {
  const baseRestockLimit = INITIAL_STOCK()[seed];
  if (!baseRestockLimit) return undefined;

  if (isFullMoonBerry(seed)) return baseRestockLimit.add(10);

  return new Decimal(
    Math.ceil(
      baseRestockLimit.mul(getSeedInventoryLimitMultiplier(seed)).toNumber(),
    ),
  );
};

const getSeedCapacityBoosts = (state: GameState, seed: SeedName) => {
  const boosts: { name: BoostName; value: string }[] = [];

  if (isBuildingReady(state.buildings.Warehouse ?? [])) {
    boosts.push({ name: "Warehouse", value: "+20%" });
  }

  const crimeFruitLevel = getSkillLevel(state.bumpkin.skills, "Crime Fruit");
  if (crimeFruitLevel && (seed === "Tomato Seed" || seed === "Lemon Seed")) {
    const bonus = SKILL_RANKS["Crime Fruit"].ranks[seed]?.[crimeFruitLevel - 1];
    if (bonus) boosts.push({ name: "Crime Fruit", value: `+${bonus}` });
  }

  return boosts;
};

const getSeedGrowthTime = ({
  crop,
  seed,
  state,
  now,
}: {
  crop: ProduceName;
  seed: SeedName;
  state: GameState;
  now: number;
}): GrowthTime => {
  if (seed in CROP_SEEDS) {
    const { time: seconds, boostsUsed } = getCropPlotTime({
      crop: crop as CropName,
      game: state,
      createdAt: now,
    });

    return { seconds, boostsUsed };
  }

  if (seed in PATCH_FRUIT_SEEDS) {
    return getFruitPatchTime(seed as keyof typeof PATCH_FRUIT_SEEDS, state);
  }

  if (seed in GREENHOUSE_FRUIT_SEEDS || seed in GREENHOUSE_SEEDS) {
    return getGreenhouseCropTime({
      crop: SEED_TO_PLANT[seed as keyof typeof SEED_TO_PLANT],
      game: state,
    });
  }

  return { seconds: 0, boostsUsed: [] };
};

const GrowthTimeCell: React.FC<{
  boostKey: string;
  seed: SeedName;
  baseSeconds: number;
  boostedTime: GrowthTime;
  state: GameState;
  showBoostsKey: string | null;
  setShowBoostsKey: (key: string | null) => void;
}> = ({
  boostKey,
  seed,
  baseSeconds,
  boostedTime,
  state,
  showBoostsKey,
  setShowBoostsKey,
}) => {
  const { showActualTime } = useContext(Context);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const now = useNow();

  // A live speed window isn't folded into `boostedTime` — show it as the current
  // rate, or (in the actual-time view) as the real "plant now → ready in X",
  // which credits only the part of the grow the booster still covers.
  // The windowed boosters aren't in `boostsUsed` (they apply over the grow rather
  // than being baked into it), so name them for the boost panel: their rate in
  // the speed view, the time each one actually saves in the other.
  const windowedBoosts = getBoostContributionEntries({
    contributions: getSeedBoostContributions(state, seed),
    seconds: boostedTime.seconds,
    at: now,
    showActualTime,
    formatSeconds: (seconds) => secondsToString(seconds, { length: "medium" }),
    formatSpeed: (speed) => translate("description.boostedSpeed", { speed }),
  });
  const boostsUsed = [...boostedTime.boostsUsed, ...windowedBoosts];
  const {
    displaySeconds,
    hasNamedBoosts,
    isBoosted: isTimeBoosted,
  } = getPreActionDisplay({
    showActualTime,
    seconds: boostedTime.seconds,
    baseSeconds,
    namedBoostCount: boostsUsed.length,
    windows: getSeedBoostWindows(state, seed),
    at: now,
  });
  const showMediumTime = Math.max(baseSeconds, displaySeconds) > 24 * 60 * 60;

  if (!isTimeBoosted) {
    return (
      <div className="flex items-center mr-2">
        <img src={SUNNYSIDE.icons.stopwatch} className="w-3 mr-1" />
        <p className="text-xxs">
          {secondsToString(baseSeconds, {
            length: showMediumTime ? "medium" : "short",
          })}
        </p>
      </div>
    );
  }

  return (
    <button
      ref={anchorRef}
      type="button"
      className={classNames("flex items-center mr-2 relative", {
        // Only named boosts can be itemised, so only they open the breakdown.
        "cursor-pointer": hasNamedBoosts,
      })}
      aria-expanded={hasNamedBoosts && showBoostsKey === boostKey}
      aria-controls={`${boostKey}-panel`}
      onClick={(e) => {
        if (!hasNamedBoosts) return;
        e.stopPropagation();
        setShowBoostsKey(showBoostsKey === boostKey ? null : boostKey);
      }}
    >
      <div className="flex items-center">
        <div className="flex items-center">
          <img src={SUNNYSIDE.icons.stopwatch} className="w-3 mr-1" />
          <p className="text-xxs">
            {secondsToString(displaySeconds, {
              length: showMediumTime ? "medium" : "short",
            })}
          </p>
        </div>
        <div className="flex items-center">
          <img src={SUNNYSIDE.icons.lightning} className="w-3 mx-1" />
          {displaySeconds !== baseSeconds && (
            <p className="text-xxs line-through">
              {secondsToString(baseSeconds, {
                length: showMediumTime ? "medium" : "short",
              })}
            </p>
          )}
        </div>
      </div>
      <BoostsDisplay
        boosts={boostsUsed}
        show={hasNamedBoosts && showBoostsKey === boostKey}
        state={state}
        onClick={() =>
          setShowBoostsKey(showBoostsKey === boostKey ? null : boostKey)
        }
        className="-translate-x-1/2"
        portalAlign="center"
        anchorRef={anchorRef}
      />
    </button>
  );
};

export const ExoticRow: React.FC<{
  crop: ExoticCropName;
  coins: number;
  alternateBg?: boolean;
}> = ({ crop, coins, alternateBg }) => {
  const { t } = useAppTranslation();
  return (
    <div
      className={`flex justify-between items-center p-1 ${
        alternateBg ? "bg-[#ead4aa] rounded-md" : ""
      }`}
    >
      <div className="flex items-center">
        <div className="flex items-center w-32 mr-2">
          <img src={ITEM_DETAILS[crop].image} className="w-6 h-auto mr-2" />
          <div className="flex-1">
            <p className="text-xs">{crop}</p>
            <p className="text-xxs">{t(getCropCategory(crop))}</p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center">
            <img src={SUNNYSIDE.ui.coins} className="w-3 mr-1" />
            <p className="text-xxs">{coins.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <div className="w-6 ml-1 flex justify-center items-center">
          <img src={lightningIcon} className="w-4 " />
        </div>
      </div>
    </div>
  );
};
