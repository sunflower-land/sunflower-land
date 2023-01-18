import classNames from "classnames";
import Decimal from "decimal.js-light";
import { GoblinState } from "features/game/lib/goblinMachine";
import { getBumpkinLevel } from "features/game/lib/level";
import { KNOWN_IDS } from "features/game/types";
import {
  BumpkinSkillName,
  BUMPKIN_SKILL_TREE,
} from "features/game/types/bumpkinSkills";
import { Ingredient } from "features/game/types/craftables";
import { GameState, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import React from "react";
import { RequirementLabel } from "./RequirementsLabel";
import { SquareIcon } from "./SquareIcon";

/**
 * The props for the component.
 * @param wideLayout Whether to always use the wide layout for large screen or not.
 * @param gameState The game state.
 * @param details The item details.
 * @param requirements The item quantity requirement.
 * @param actionView The view for displaying the crafting action.
 */
interface Props {
  wideLayout?: boolean;
  gameState: GameState | GoblinState;
  details: ItemDetailsProps | AchievementDetailsProps | NonItemDetailsProps;
  requirements?: RequirementsProps;
  actionView?: JSX.Element;
}

/**
 * The props for the details for items.
 * @param type The type is item.
 * @param item The item.
 * @param quantity The item quantity. Leave it undefined if quantity is not displayed.
 */
interface ItemDetailsProps {
  type: "item";
  item: InventoryItemName;
  quantity?: Decimal;
}

/**
 * The props for the details for items.
 * @param type The type is achievement.
 * @param achievement The achievement.
 */
interface AchievementDetailsProps {
  type: "achievement";
  achievement: BumpkinSkillName;
}

/**
 * The props for the details for non items.
 * @param type The type is non item.
 * @param icon The icon.
 * @param title The title.
 * @param description The description.
 */
interface NonItemDetailsProps {
  type: "nonItem";
  icon?: string;
  title?: string;
  description?: string;
}

/**
 * The props for the crafting requirements.
 * @param resources The item resources requirements.
 * @param sfl The SFL requirements.
 * @param showSflIfFree Whether to show free SFL requirement if SFL cost is 0. Defaults to false.
 * @param sellForSfl The amount of SFL the item can be sold for.
 * @param level The level requirements.
 * @param xp The XP gained for consuming the item.
 * @param timeSeconds The wait time in seconds for crafting the item.
 * @param harvests The min/max harvests for the item.
 * @param showOpenSeaLink Whether to show the open sea link or not.
 */
interface RequirementsProps {
  resources?: Ingredient[];
  sfl?: Decimal;
  showSflIfFree?: boolean;
  sellForSfl?: Decimal;
  level?: number;
  xp?: Decimal;
  timeSeconds?: number;
  harvests?: HarvestsRequirementProps;
  showOpenSeaLink?: boolean;
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
 * The view for displaying item name, details, crafting requirements and action.
 * @props The component props.
 */
export const CraftingRequirementsView: React.FC<Props> = ({
  wideLayout = false,
  gameState,
  details,
  requirements,
  actionView,
}: Props) => {
  const getItemDetail = () => {
    let icon;
    let title;
    let description;
    if (details.type === "item") {
      const item = ITEM_DETAILS[details.item];
      icon = item.image;
      title = details.quantity
        ? `${details.quantity} x ${details.item}`
        : details.item;
      description = item.description;
    } else if (details.type === "achievement") {
      const achievement = BUMPKIN_SKILL_TREE[details.achievement];
      icon = achievement.image;
      title = details.achievement;
      description = achievement.boosts;
    } else {
      icon = details.icon;
      title = details.title;
      description = details.description;
    }

    return (
      <>
        <div
          className={classNames(
            "flex space-x-2 justify-start mb-1 items-center",
            { "sm:flex-col-reverse md:space-x-0": !wideLayout }
          )}
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
          className={classNames("text-xs mt-1 whitespace-pre-line", {
            "sm:text-center": !wideLayout,
          })}
        >
          {description}
        </span>
      </>
    );
  };

  const getRequirements = () => {
    if (!requirements) return <></>;

    return (
      <div
        className={classNames(
          "border-t border-white w-full my-2 pt-2 flex justify-between gap-x-3 gap-y-2 flex-wrap",
          { "sm:flex-col sm:items-center sm:flex-nowrap": !wideLayout }
        )}
      >
        {/* Item ingredients requirements */}
        {requirements.resources?.map((ingredient, index) => {
          return (
            <RequirementLabel
              key={index}
              type="item"
              item={ingredient.item}
              balance={gameState.inventory[ingredient.item] ?? new Decimal(0)}
              requirement={ingredient.amount}
            />
          );
        })}

        {/* SFL requirement */}
        {!!requirements.sfl &&
          (requirements.sfl.greaterThan(0) || requirements.showSflIfFree) && (
            <RequirementLabel
              type="sfl"
              balance={gameState.balance}
              requirement={requirements.sfl}
            />
          )}

        {/* Sell for SFL display */}
        {!!requirements.sellForSfl && (
          <RequirementLabel
            type="sellForSfl"
            requirement={requirements.sellForSfl}
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

        {/* XP display */}
        {!!requirements.xp && (
          <RequirementLabel type="xp" xp={requirements.xp} />
        )}

        {/* Time requirement display */}
        {!!requirements.timeSeconds && (
          <RequirementLabel
            type="time"
            waitSeconds={requirements.timeSeconds}
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

        {/* OpenSea link */}
        {requirements.showOpenSeaLink && details.type === "item" && (
          <a
            href={`https://opensea.io/assets/matic/0x22d5f9b75c524fec1d6619787e582644cd4d7422/${
              KNOWN_IDS[details.item]
            }`}
            className="underline text-xxs px-1.5 pb-1 pt-0.5 hover:text-blue-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenSea
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-col justify-center p-2 pb-0">
        {getItemDetail()}
        {getRequirements()}
      </div>
      {actionView}
    </div>
  );
};
