import Decimal from "decimal.js-light";
import { INVENTORY_LIMIT } from "features/game/lib/constants";
import { getBumpkinLevel } from "features/game/lib/level";
import {
  GameState,
  InventoryItemName,
  TemperateSeasonName,
} from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { type JSX } from "react";
import { Label } from "../Label";
import { RequirementLabel } from "../RequirementsLabel";
import { SquareIcon } from "../SquareIcon";
import { formatDateRange } from "lib/utils/time";
import { SUNNYSIDE } from "assets/sunnyside";
import emptyPot from "assets/greenhouse/greenhouse_pot.webp";
import flowerBed from "assets/flowers/empty_flowerbed.webp";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ITEM_ICONS } from "features/island/hud/components/inventory/Chest";
import { Seed, SeedName, SEEDS } from "features/game/types/seeds";
import {
  CropName,
  getCropCategory,
  ProduceName,
} from "features/game/types/crops";
import { getCurrentBiome } from "features/island/biomes/biomes";

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
};
type InventoryDetailsProps = BaseProps & {
  item: SeedName;
};
type ItemDetailsProps = InventoryDetailsProps & {
  seasons?: TemperateSeasonName[];
  cropMachineSeeds?: SeedName[];
};

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
  coins?: number;
  showCoinsIfFree?: boolean;
  harvests?: HarvestsRequirementProps;
  timeSeconds?: number;
  level?: number;
  restriction?: {
    icon: string;
    text: string;
    isLocked?: boolean;
  };
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
  requirements?: RequirementsProps;
  limit?: number;
  actionView?: JSX.Element;
  label?: JSX.Element;
  validSeeds: SeedName[];
}

function getDetails(
  game: GameState,
  details: ItemDetailsProps,
): {
  limit: Decimal;
  count: Decimal;
  image: string;
  name: string;
  description: string;
} {
  const inventoryCount = game.inventory[details.item] ?? new Decimal(0);
  const limit = INVENTORY_LIMIT(game)[details.item];

  return {
    count: inventoryCount,
    description: ITEM_DETAILS[details.item].description,
    image:
      ITEM_ICONS(game.season.season, getCurrentBiome(game.island))[
        details.item
      ] ?? ITEM_DETAILS[details.item].image,
    name: details.item,
    limit: limit as Decimal,
  };
}

const PLANTING_SPOT_ICONS: Partial<Record<Seed["plantingSpot"], string>> = {
  "Crop Plot": SUNNYSIDE.resource.plot,
  "Flower Bed": flowerBed,
  "Fruit Patch": SUNNYSIDE.resource.fruitPatch,
  Greenhouse: emptyPot,
};

/**
 * The view for displaying item name, details, crafting requirements and action.
 * @props The component props.
 */
export const SeedRequirements: React.FC<Props> = ({
  gameState,
  stock,
  isLimitedItem = false,
  limit,
  details,
  requirements,
  actionView,
  label,
  validSeeds,
}) => {
  const { t } = useAppTranslation();
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

  const inSeasonSeeds = validSeeds.includes(details.item);
  const isCropMachineSeed = details.cropMachineSeeds?.includes(details.item);

  const getItemDetail = () => {
    const { image: icon, name } = getDetails(gameState, details);
    const title = details.quantity
      ? `${details.quantity} x ${details.item}`
      : name;

    return (
      <>
        <div className="flex flex-col space-x-2 justify-start items-center md:space-x-0 mb-1">
          <div>
            <p className="text-center">{title}</p>
            <p className="text-xs text-center">
              {t(getCropCategory(SEEDS[details.item]?.yield as ProduceName))}
            </p>
          </div>
          {icon && !!details.item && (
            <div className="mt-2 flex items-center">
              <SquareIcon icon={icon} width={14} />
              <SquareIcon icon={SUNNYSIDE.icons.chevron_right} width={8} />
              <SquareIcon
                icon={
                  isCropMachineSeed
                    ? SUNNYSIDE.building.cropMachine
                    : (PLANTING_SPOT_ICONS[SEEDS[details.item].plantingSpot] ??
                      SUNNYSIDE.icons.expression_confused)
                }
                width={14}
              />
              <SquareIcon icon={SUNNYSIDE.icons.chevron_right} width={8} />
              <SquareIcon
                icon={
                  ITEM_DETAILS[SEEDS[details.item]?.yield as CropName]?.image ??
                  SUNNYSIDE.icons.expression_confused
                }
                width={14}
              />
            </div>
          )}
          {!inSeasonSeeds && (
            <p className="text-xxs mt-1">{t("cropGuide.cantPlantSeeds")}</p>
          )}
          {isCropMachineSeed && (
            <p className="text-xxs mt-1">{t("cropGuide.onlyInCropMachine")}</p>
          )}
        </div>
      </>
    );
  };

  const getRequirements = () => {
    if (!requirements) return <></>;

    return (
      <div className="w-full mb-2 flex justify-center gap-x-3 gap-y-0 flex-wrap sm:flex-col sm:items-center sm:flex-nowrap my-1">
        {/* Time requirement display */}
        {!!requirements.timeSeconds && (
          <RequirementLabel
            type="time"
            waitSeconds={requirements.timeSeconds}
          />
        )}

        {/* Level requirement */}
        {!!requirements.level && (
          <RequirementLabel
            type="level"
            currentLevel={getBumpkinLevel(gameState.bumpkin?.experience ?? 0)}
            requirement={requirements.level}
          />
        )}

        {!gameState.inventory[SEEDS[details.item].plantingSpot] && (
          <div className="flex justify-center">
            <Label className="mb-1" type="danger">
              {t("seeds.plantingSpot.needed", {
                plantingSpot: SEEDS[details.item].plantingSpot,
              })}
            </Label>
          </div>
        )}

        {/* Harvests display */}
        {!!requirements.harvests && (
          <RequirementLabel
            type="harvests"
            minHarvest={requirements.harvests.minHarvest}
            maxHarvest={requirements.harvests.maxHarvest}
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

        {label}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col h-full px-1 py-0">
        {getStock()}
        {details.from && (
          <Label
            icon={SUNNYSIDE.icons.stopwatch}
            type="warning"
            className="my-1 mx-auto whitespace-nowrap"
          >
            {formatDateRange(details.from, details.to as Date)}
          </Label>
        )}
        {getItemDetail()}
        {limit && (
          <p className="my-1 text-xs text-left sm:text-center">{`${t(
            "max",
          )} ${limit} ${t("statements.perplayer")}`}</p>
        )}
        {getRequirements()}
      </div>
      {actionView}
    </div>
  );
};
