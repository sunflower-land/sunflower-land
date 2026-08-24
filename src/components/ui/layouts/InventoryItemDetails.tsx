import classNames from "classnames";
import Decimal from "decimal.js-light";
import type {
  BoostName,
  GameState,
  InventoryItemName,
  TemperateSeasonName,
} from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { type JSX } from "react";
import { RequirementLabel } from "../RequirementsLabel";
import { SquareIcon } from "../SquareIcon";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { Label } from "../Label";
import { isPreActionBoosted } from "features/game/lib/timerDisplay";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ITEM_ICONS } from "features/island/hud/components/inventory/Chest";
import { SEASON_ICONS } from "features/island/buildings/components/building/market/SeasonalSeeds";
import {
  isBuildingUpgradable,
  type UpgradableBuildingType,
} from "features/game/events/landExpansion/upgradeBuilding";
import { makeUpgradableBuildingKey } from "features/game/events/landExpansion/upgradeBuilding";
import type { BuildingName } from "features/game/types/buildings";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { BoostsDisplay } from "./BoostsDisplay";
import { getItemDescription } from "features/game/lib/getItemDescription";

/**
 * The props for the details for items.
 * @param item The item.
 */
interface ItemDetailsProps {
  item: InventoryItemName;
  seasons?: string[];
}

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
 * The props for the inventory properties.
 * @param timeSeconds The wait time in seconds for using the item.
 * @param baseTimeSeconds The base wait time before boosts (for strikethrough display).
 * @param timeBoostsUsed The boosts applied to the grow time (for clickable boost display).
 * @param timeSpeed Live speed-window rate for this activity; > 1 shows the rate.
 * @param harvests The min/max harvests for the item.
 * @param xp The XP gained for consuming the item.
 * @param xpBoostsUsed The boosts applied to food XP (for clickable boost display).
 * @param baseXp The base XP before boosts (for strikethrough display).
 * @param showBoosts Whether the boost panel is visible.
 * @param setShowBoosts Callback to toggle the boost panel.
 * @param onMarketplaceClick Callback to open the item in the marketplace. The link is hidden when not provided.
 */
interface PropertiesProps {
  timeSeconds?: number;
  baseTimeSeconds?: number;
  timeBoostsUsed?: { name: BoostName; value: string }[];
  timeSpeed?: number;
  harvests?: HarvestsRequirementProps;
  xp?: Decimal;
  xpBoostsUsed?: { name: BoostName; value: string }[];
  baseXp?: number;
  showBoosts?: boolean;
  setShowBoosts?: (show: boolean) => void;
  onMarketplaceClick?: () => void;
}

/**
 * The props for the component.
 * @param wideLayout Whether to always use the wide layout for large screen or not.
 * @param details The item details.
 * @param requirements The item properties.
 * @param actionView The view for displaying the item action.
 */
interface Props {
  wideLayout?: boolean;
  game: GameState;
  details: ItemDetailsProps;
  properties?: PropertiesProps;
  actionView?: JSX.Element;
}

/**
 * The view for displaying item name, details, properties and action.
 * @props The component props.
 */
export const InventoryItemDetails: React.FC<Props> = ({
  wideLayout = false,
  game,
  details,
  properties,
  actionView,
}: Props) => {
  const { t } = useAppTranslation();
  const getItemDetail = () => {
    const item = ITEM_DETAILS[details.item];
    const hasLevel = isBuildingUpgradable(details.item as BuildingName)
      ? game[makeUpgradableBuildingKey(details.item as UpgradableBuildingType)]
          .level
      : undefined;
    const icon =
      ITEM_ICONS(game.season.season, getCurrentBiome(game.island), hasLevel)[
        details.item
      ] ?? item.image;
    const title = item.translatedName ?? details.item;

    const description = getItemDescription({ item: details.item, game });

    const boost = COLLECTIBLE_BUFF_LABELS[details.item]?.(game);

    return (
      <>
        <div
          className={classNames("flex space-x-2 justify-start items-center", {
            "sm:flex-col-reverse md:space-x-0": !wideLayout,
          })}
        >
          {icon && (
            <div className={classNames("", { "sm:mt-2": !wideLayout })}>
              <SquareIcon icon={icon} width={14} />
            </div>
          )}
          <span className={classNames("", { "sm:text-center": !wideLayout })}>
            {title}
          </span>
        </div>
        <span
          className={classNames("text-xs mb-2 sm:mt-1 whitespace-pre-line", {
            "sm:text-center": !wideLayout,
          })}
        >
          {description}
        </span>
        {boost && (
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
                >
                  {shortDescription}
                </Label>
              ),
            )}
          </div>
        )}
        {details.seasons && (
          <div className="flex items-center justify-center mb-2">
            {details.seasons.map((season) => (
              <img
                key={season}
                src={SEASON_ICONS[season as TemperateSeasonName]}
                className="w-5 ml-1"
              />
            ))}
          </div>
        )}
      </>
    );
  };

  const getProperties = () => {
    if (!properties) return <></>;

    const getTimeDisplay = () => {
      if (!properties.timeSeconds) return <></>;

      const hasNamedBoosts = (properties.timeBoostsUsed?.length ?? 0) > 0;
      const speed = properties.timeSpeed ?? 1;
      const isTimeBoosted = isPreActionBoosted({
        displaySeconds: properties.timeSeconds,
        baseSeconds: properties.baseTimeSeconds,
        speed,
        hasNamedBoosts,
      });

      if (
        isTimeBoosted &&
        properties.timeBoostsUsed &&
        properties.setShowBoosts &&
        properties.showBoosts !== undefined
      ) {
        return (
          <div
            className={classNames("flex flex-col items-center", {
              // Only itemisable (named) boosts open the breakdown; a live speed
              // window has no name to list.
              "cursor-pointer": hasNamedBoosts,
            })}
            onClick={() =>
              hasNamedBoosts &&
              properties.setShowBoosts?.(!properties.showBoosts)
            }
          >
            <RequirementLabel
              type="time"
              waitSeconds={properties.timeSeconds}
              boosted
            />
            {properties.baseTimeSeconds !== undefined &&
              properties.timeSeconds !== properties.baseTimeSeconds && (
                <RequirementLabel
                  type="time"
                  waitSeconds={properties.baseTimeSeconds}
                  strikethrough
                />
              )}
            {speed > 1 && (
              <Label type="transparent" icon={SUNNYSIDE.icons.lightning}>
                {t("description.boostedSpeed", {
                  speed: Number(speed.toFixed(2)),
                })}
              </Label>
            )}
            <BoostsDisplay
              boosts={properties.timeBoostsUsed}
              show={hasNamedBoosts && properties.showBoosts}
              state={game}
              onClick={() =>
                hasNamedBoosts &&
                properties.setShowBoosts?.(!properties.showBoosts)
              }
            />
          </div>
        );
      }

      return (
        <RequirementLabel type="time" waitSeconds={properties.timeSeconds} />
      );
    };

    const getXPDisplay = () => {
      if (!properties.xp) return <></>;

      const isXpBoosted =
        properties.xpBoostsUsed &&
        properties.xpBoostsUsed.length > 0 &&
        properties.baseXp !== undefined &&
        properties.xp.greaterThan(properties.baseXp);

      if (
        isXpBoosted &&
        properties.xpBoostsUsed &&
        properties.setShowBoosts &&
        properties.showBoosts !== undefined
      ) {
        return (
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => properties.setShowBoosts?.(!properties.showBoosts)}
          >
            <RequirementLabel type="xp" xp={properties.xp} boosted />
            <RequirementLabel
              type="xp"
              xp={new Decimal(properties.baseXp ?? 0)}
              strikethrough
            />
            <BoostsDisplay
              boosts={properties.xpBoostsUsed}
              show={properties.showBoosts}
              state={game}
              onClick={() => properties.setShowBoosts?.(!properties.showBoosts)}
            />
          </div>
        );
      }

      return <RequirementLabel type="xp" xp={properties.xp} />;
    };

    // Without any content the divider would show as an empty line
    const hasContent =
      !!properties.timeSeconds ||
      !!properties.harvests ||
      !!properties.xp ||
      !!properties.onMarketplaceClick;

    if (!hasContent) return <></>;

    return (
      <div
        className={classNames(
          "border-t border-white w-full mb-2 pt-2 flex justify-between gap-x-3 gap-y-2 flex-wrap",
          { "sm:flex-col sm:items-center sm:flex-nowrap": !wideLayout },
        )}
      >
        {/* Time requirement display */}
        {getTimeDisplay()}

        {/* Harvests display */}
        {!!properties.harvests && (
          <RequirementLabel
            type="harvests"
            minHarvest={properties.harvests.minHarvest}
            maxHarvest={properties.harvests.maxHarvest}
          />
        )}

        {/* XP display */}
        {getXPDisplay()}

        {/* Marketplace link */}
        {properties.onMarketplaceClick && (
          <span
            className="underline text-xxs pb-1 pt-0.5 cursor-pointer hover:text-blue-500"
            onClick={properties.onMarketplaceClick}
          >
            {t("marketplace")}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col justify-center px-1 py-0">
        {getItemDetail()}
        {getProperties()}
      </div>
      {actionView}
    </div>
  );
};
