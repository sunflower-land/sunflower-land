import Decimal from "decimal.js-light";
import { INVENTORY_LIMIT } from "features/game/lib/constants";
import { getBumpkinLevel } from "features/game/lib/level";
import { getKeys } from "features/game/types/craftables";
import {
  BoostName,
  GameState,
  InventoryItemName,
  Rock,
  Tree,
} from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { Dispatch, SetStateAction, useState, type JSX } from "react";
import { BoostsDisplay } from "./BoostsDisplay";
import { Label } from "../Label";
import { RequirementLabel } from "../RequirementsLabel";
import { SquareIcon } from "../SquareIcon";
import { formatDateRange, secondsToString } from "lib/utils/time";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  BUMPKIN_ITEM_PART,
  BumpkinItem,
  ITEM_IDS,
} from "features/game/types/bumpkin";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getImageUrl } from "lib/utils/getImageURLS";
import { ITEM_ICONS } from "features/island/hud/components/inventory/Chest";
import { IngredientsPopover } from "../IngredientsPopover";
import { BuffLabel } from "features/game/types";
import { isSeed } from "features/game/types/seeds";
import { getCurrentBiome } from "features/island/biomes/biomes";
import {
  EXPIRY_COOLDOWNS,
  TemporaryCollectibleName,
} from "features/game/lib/collectibleBuilt";
import {
  RESOURCES_UPGRADES_TO,
  ADVANCED_RESOURCES,
  UpgradedResourceName,
  RESOURCE_STATE_ACCESSORS,
} from "features/game/types/resources";
import { SEASON_ICONS } from "features/island/buildings/components/building/market/SeasonalSeeds";
import { capitalize } from "lib/utils/capitalize";
import classNames from "classnames";

function getResourceTier(name: UpgradedResourceName): number | undefined {
  if (name in ADVANCED_RESOURCES) {
    return ADVANCED_RESOURCES[name].tier;
  }

  // Upgradeable base resources (Tree, Stone Rock, etc.) are tier 1
  if (name in RESOURCES_UPGRADES_TO) {
    return 1;
  }

  return undefined;
}

/**
 * The props for the details for items.
 * @param type The type is item.
 * @param item The item.
 * @param quantity The item quantity. Leave it undefined if quantity is not displayed.
 */
type BaseProps = {
  quantity?: Decimal;
  from?: Date;
  to?: Date;
  item?: InventoryItemName;
  wearable?: BumpkinItem;
};
type InventoryDetailsProps = BaseProps & {
  item: InventoryItemName;
};
type WearableDetailsProps = BaseProps & {
  wearable: BumpkinItem;
};
type ItemDetailsProps = InventoryDetailsProps | WearableDetailsProps;

/**
 * The props for harvests requirement label.
 * @param minHarvest The minimum number of harvests.
 * @param maxHarvest The maximum number of harvests.
 */
interface HarvestsRequirementProps {
  minHarvest: number;
  maxHarvest: number;
}

/**
 * The props for the crafting requirements.
 * @param resources The item resources requirements.
 * @param coins The Coins requirements.
 * @param showCoinsIfFree Whether to show free Coins requirement if cost is 0. Defaults to false.
 * @param sfl The FLOWER requirements.
 * @param showSflIfFree Whether to show free FLOWER requirement if FLOWER cost is 0. Defaults to false.
 * @param harvests The min/max harvests for the item.
 * @param xp The XP gained for consuming the item.
 * @param timeSeconds The wait time in seconds for crafting the item.
 * @param level The level requirements.
 */
interface RequirementsProps {
  resources?: Partial<Record<InventoryItemName, Decimal>>;
  sfl?: Decimal;
  coins?: number;
  showCoinsIfFree?: boolean;
  showSflIfFree?: boolean;
  harvests?: HarvestsRequirementProps;
  xp?: Decimal;
  xpBoostsUsed?: { name: BoostName; value: string }[];
  baseXp?: number;
  timeSeconds?: number;
  baseTimeSeconds?: number;
  timeBoostsUsed?: { name: BoostName; value: string }[];
  level?: number;
}

/**
 * The props for the component.
 * @param gameState The game state.
 * @param stock The stock of the item available to craft.  Undefined if the stock is unlimited.
 * @param isLimitedItem true if the item quantity is limited to a certain number in the blockchain, else false. Defaults to false.
 * @param details The item details.
 * @param boost The available boost of the item.
 * @param requirements The item quantity requirement.
 * @param actionView The view for displaying the crafting action.
 * @param label Information label for the item.
 */
interface Props {
  gameState: GameState;
  stock?: Decimal;
  isLimitedItem?: boolean;
  details: ItemDetailsProps;
  boost?: BuffLabel[];
  requirements?: RequirementsProps;
  limit?: number;
  actionView?: JSX.Element;
  hideDescription?: boolean;
  label?: JSX.Element;
  showSeason?: boolean;
  showBoosts?: boolean;
  setShowBoosts?: (show: boolean) => void;
  showTimeBoosts?: boolean;
  setShowTimeBoosts?: Dispatch<SetStateAction<boolean>>;
}

function getDetails(
  game: GameState,
  details: ItemDetailsProps,
): {
  limit: Decimal | undefined;
  count: Decimal;
  image: string;
  name: string;
  description: string;
} {
  if (details.item) {
    const count = game.inventory[details.item] ?? new Decimal(0);
    const limit = isSeed(details.item)
      ? INVENTORY_LIMIT(game)[details.item]
      : undefined;

    const {
      description,
      image: defaultImage,
      translatedName,
    } = ITEM_DETAILS[details.item];

    const image =
      ITEM_ICONS(game.season.season, getCurrentBiome(game.island))[
        details.item
      ] ?? defaultImage;
    const name = translatedName ?? details.item;

    return { count, description, image, name, limit };
  }

  const wardrobeCount = game.wardrobe[details.wearable] ?? 0;

  return {
    count: new Decimal(wardrobeCount),
    limit: new Decimal(1),
    description: "?",
    image: getImageUrl(ITEM_IDS[details.wearable]),
    name: details.wearable,
  };
}

/**
 * The view for displaying item name, details, crafting requirements and action.
 * @props The component props.
 */
export const CraftingRequirements: React.FC<Props> = ({
  gameState,
  stock,
  isLimitedItem = false,
  limit,
  details,
  boost,
  requirements,
  actionView,
  hideDescription,
  showSeason = false,
  label,
  showBoosts,
  setShowBoosts,
  showTimeBoosts,
  setShowTimeBoosts,
}: Props) => {
  const { t } = useAppTranslation();
  const [showIngredients, setShowIngredients] = useState(false);
  const getStock = () => {
    if (!stock) return <></>;

    if (stock.lessThanOrEqualTo(0)) {
      return (
        <div className="flex justify-center mt-0 sm:mb-1">
          <Label type="danger">{t("statements.soldOut")}</Label>
        </div>
      );
    }

    const { count, limit } = getDetails(gameState, details);

    const isInventoryFull =
      limit === undefined ? false : count.greaterThanOrEqualTo(limit);

    return (
      <div className="flex justify-center mt-0 sm:mb-1">
        <Label type={isInventoryFull ? "danger" : "info"}>
          {isLimitedItem
            ? t("stock.left", { stock: stock })
            : t("stock.inStock", { stock: stock })}
        </Label>
      </div>
    );
  };

  const getItemDetail = ({
    hideDescription,
  }: {
    hideDescription?: boolean;
  }) => {
    const { image: icon, description, name } = getDetails(gameState, details);
    const title = details.quantity ? `${details.quantity} x ${name}` : name;

    return (
      <>
        <div className="flex space-x-2 justify-start items-center sm:flex-col-reverse md:space-x-0 mb-1">
          {icon && !!details.item && (
            <div className="sm:mt-2">
              <SquareIcon icon={icon} width={14} />
            </div>
          )}
          {details.wearable && (
            <div className="relative sm:w-4/5 my-1 flex">
              <img src={icon} className="sm:w-full w-14 my-2 rounded-lg" />
              <div className="sm:absolute -ml-4 bottom-16 w-10 h-4 right-0">
                <NPCIcon
                  key={details.wearable}
                  parts={{
                    body: "Beige Farmer Potion",
                    hair: "Sun Spots",
                    [BUMPKIN_ITEM_PART[details.wearable]]: details.wearable,
                  }}
                />
              </div>
            </div>
          )}
          <span className="sm:text-center">{title}</span>
        </div>
        {!hideDescription && description !== "?" && (
          <span className="text-xs mb-2 sm:mt-1 whitespace-pre-line sm:text-center">
            {description}
          </span>
        )}
      </>
    );
  };

  const getBoost = () => {
    if (!boost) return <></>;
    let expiry: number | undefined;

    const isTemporaryCollectible = (
      item: InventoryItemName,
    ): item is TemporaryCollectibleName => item in EXPIRY_COOLDOWNS;
    if (details.item && isTemporaryCollectible(details.item)) {
      expiry = EXPIRY_COOLDOWNS[details.item];
    }

    return (
      <div className="flex flex-wrap sm:flex-col gap-x-3 sm:gap-x-0 gap-y-1 mb-2 items-center">
        {boost.map(
          (
            { labelType, boostTypeIcon, boostedItemIcon, shortDescription },
            index,
          ) => (
            <Label
              key={index}
              type={labelType}
              icon={boostTypeIcon}
              secondaryIcon={boostedItemIcon}
              className="text-center"
            >
              {shortDescription}
            </Label>
          ),
        )}
        {expiry && (
          <>
            <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
              {t("shrine.expiryLabel", {
                time: secondsToString(expiry / 1000, { length: "short" }),
              })}
            </Label>
            <Label type="danger" className="text-center">
              {t("shrine.activated.uponPurchase")}
            </Label>
          </>
        )}
      </div>
    );
  };

  const getRequirements = () => {
    if (!requirements) return <></>;

    return (
      <div className="border-t border-white w-full mb-2 pt-2 flex justify-between gap-x-3 gap-y-2 flex-wrap sm:flex-col sm:items-center sm:flex-nowrap my-1">
        {showSeason && (
          <Label
            type="default"
            icon={SEASON_ICONS[gameState.season.season]}
            className="-mb-3.5"
          >
            {capitalize(gameState.season.season)}
          </Label>
        )}
        <div
          className={classNames(
            "w-full mb-2 flex justify-between gap-x-3 gap-y-2 flex-wrap sm:flex-col sm:items-center sm:flex-nowrap my-1",
            {
              "pt-2": showSeason,
            },
          )}
        >
          {/* Item ingredients requirements */}
          {!!requirements.resources && (
            <div
              className="relative cursor-pointer flex justify-between gap-x-3 gap-y-2 flex-wrap sm:flex-col sm:items-center sm:flex-nowrap"
              onClick={() => setShowIngredients(!showIngredients)}
            >
              <IngredientsPopover
                className="-top-1 left-1 sm:-left-[150%]"
                show={showIngredients}
                ingredients={getKeys(requirements.resources ?? {})}
                onClick={() => setShowIngredients(false)}
              />
              {getKeys(requirements.resources).map((ingredientName, index) => {
                // If ingredient is a node, require it to be placed
                let balance =
                  gameState.inventory[ingredientName] ?? new Decimal(0);

                const isNode = (
                  ingredientName: InventoryItemName,
                ): ingredientName is UpgradedResourceName =>
                  ingredientName in ADVANCED_RESOURCES;

                if (isNode(ingredientName)) {
                  const stateAccessor =
                    RESOURCE_STATE_ACCESSORS[ingredientName](gameState);
                  const nodes: (Rock | Tree)[] = Object.values(stateAccessor);

                  const requiredTier = getResourceTier(ingredientName);

                  const activeNodes = nodes.filter(
                    (n) => n.removedAt === undefined,
                  );

                  const matchingNodes =
                    requiredTier === undefined
                      ? activeNodes
                      : activeNodes.filter((node) => {
                          // Prefer `tier` for correctness; `name` may be absent on-chain/older state.
                          if (typeof node.tier === "number") {
                            return node.tier === requiredTier;
                          }

                          if (typeof node.name === "string") {
                            return node.name === ingredientName;
                          }

                          // No metadata: treat as base tier-1 node only.
                          return requiredTier === 1;
                        });

                  balance = new Decimal(matchingNodes.length);
                }

                return (
                  <div key={index}>
                    <RequirementLabel
                      type="item"
                      item={ingredientName}
                      balance={balance}
                      requirement={
                        new Decimal(
                          (requirements.resources ?? {})[ingredientName] ?? 0,
                        )
                      }
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* FLOWER requirement */}
          {!!requirements.sfl &&
            (requirements.sfl.greaterThan(0) || requirements.showSflIfFree) && (
              <RequirementLabel
                type="sfl"
                balance={gameState.balance}
                requirement={requirements.sfl}
              />
            )}

          {/* Coin requirement */}
          {requirements.coins !== undefined &&
            (requirements.coins > 0 || requirements.showCoinsIfFree) && (
              <RequirementLabel
                type="coins"
                balance={gameState.coins}
                requirement={requirements.coins}
              />
            )}

          {/* Harvests display */}
          {!!requirements.harvests && (
            <RequirementLabel
              type="harvests"
              minHarvest={requirements.harvests.minHarvest}
              maxHarvest={requirements.harvests.maxHarvest}
            />
          )}

          {/* XP display */}
          {!!requirements.xp &&
            (() => {
              const isXpBoosted =
                requirements.xpBoostsUsed &&
                requirements.xpBoostsUsed.length > 0 &&
                requirements.baseXp !== undefined &&
                requirements.xp.greaterThan(requirements.baseXp);

              if (
                isXpBoosted &&
                requirements.xpBoostsUsed &&
                setShowBoosts &&
                showBoosts !== undefined
              ) {
                return (
                  <div
                    className="flex flex-row sm:flex-col items-center cursor-pointer"
                    onClick={() => setShowBoosts(!showBoosts)}
                  >
                    <RequirementLabel type="xp" xp={requirements.xp} boosted />
                    <RequirementLabel
                      type="xp"
                      xp={new Decimal(requirements.baseXp ?? 0)}
                      strikethrough
                    />
                    <BoostsDisplay
                      boosts={requirements.xpBoostsUsed}
                      show={showBoosts}
                      state={gameState}
                      onClick={() => setShowBoosts(!showBoosts)}
                    />
                  </div>
                );
              }

              return <RequirementLabel type="xp" xp={requirements.xp} />;
            })()}

          {/* Instant ready display */}
          {requirements.timeSeconds === 0 && (
            <RequirementLabel type="instantReady" />
          )}

          {/* Time requirement display */}
          {!!requirements.timeSeconds &&
            (() => {
              const baseTimeSeconds = requirements.baseTimeSeconds;
              const timeBoostsUsed = requirements.timeBoostsUsed;
              const isTimeBoosted =
                baseTimeSeconds != null &&
                requirements.timeSeconds < baseTimeSeconds &&
                !!(timeBoostsUsed?.length ?? 0);

              if (
                isTimeBoosted &&
                setShowTimeBoosts &&
                showTimeBoosts !== undefined
              ) {
                return (
                  <div
                    className="flex flex-row sm:flex-col items-center cursor-pointer"
                    onClick={() => setShowTimeBoosts(!showTimeBoosts)}
                  >
                    <RequirementLabel
                      type="time"
                      waitSeconds={requirements.timeSeconds}
                      boosted
                    />
                    <RequirementLabel
                      type="time"
                      waitSeconds={baseTimeSeconds ?? 0}
                      strikethrough
                    />
                    {showTimeBoosts && (
                      <BoostsDisplay
                        boosts={timeBoostsUsed ?? []}
                        show={showTimeBoosts}
                        state={gameState}
                        onClick={() => setShowTimeBoosts((prev) => !prev)}
                      />
                    )}
                  </div>
                );
              }

              return (
                <RequirementLabel
                  type="time"
                  waitSeconds={requirements.timeSeconds}
                />
              );
            })()}

          {/* Level requirement */}
          {!!requirements.level && (
            <RequirementLabel
              type="level"
              currentLevel={getBumpkinLevel(gameState.bumpkin?.experience ?? 0)}
              requirement={requirements.level}
            />
          )}

          {label}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col h-full px-1 py-0">
        {getStock()}
        {details.from && details.to && (
          <Label
            icon={SUNNYSIDE.icons.stopwatch}
            type="warning"
            className="my-1 mx-auto whitespace-nowrap"
          >
            {formatDateRange(details.from, details.to)}
          </Label>
        )}
        {getItemDetail({ hideDescription })}
        {limit && (
          <p className="my-1 text-xs text-left sm:text-center">{`${t(
            "max",
          )} ${limit} ${t("statements.perplayer")}`}</p>
        )}
        {getBoost()}
        {getRequirements()}
      </div>
      {requirements && actionView}
    </div>
  );
};
