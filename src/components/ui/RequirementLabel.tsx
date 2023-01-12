import Decimal from "decimal.js-light";
import { InventoryItemName } from "features/game/types/game";
import React from "react";
import { Label } from "./Label";
import { SquareIcon } from "./SquareIcon";
import { ITEM_DETAILS } from "features/game/types/images";
import levelup from "assets/icons/level_up.png";
import seedling from "assets/icons/seedling.png";
import token from "assets/icons/token_2.png";
import watch from "assets/icons/stopwatch.png";
import { secondsToString } from "lib/utils/time";
import classNames from "classnames";

/**
 * The props for SFL requirement label.
 * @param type The type is SFL.
 * @param balance The SFL balance of the player.
 * @param requirement The SFL requirement.
 */
interface SFLProps {
  type: "sfl";
  balance: Decimal;
  requirement: Decimal;
}

/**
 * The props for sell for SFL requirement label.
 * @param type The type is sell for SFL.
 * @param requirement The SFL requirement.
 */
interface SellSFLProps {
  type: "sellForSfl";
  requirement: Decimal;
}

/**
 * The props for item requirement label.
 * @param type The type is item.
 * @param item The item name.
 * @param balance The item balance of the player.
 * @param requirement The item quantity requirement.
 */
interface ItemProps {
  type: "item";
  item: InventoryItemName;
  balance: Decimal;
  requirement: Decimal;
}

/**
 * The props for time requirement label.
 * @param type The type is time.
 * @param balance The time requirement.
 */
interface TimeProps {
  type: "time";
  waitSeconds: number;
}

/**
 * The props for XP requirement label.
 * @param type The type is XP.
 * @param xp The XP requirement.
 */
interface XPProps {
  type: "xp";
  xp: Decimal;
}

/**
 * The props for level requirement label.
 * @param type The type is level.
 * @param currentLevel The current level.
 * @param requirement The level requirement.
 */
interface LevelProps {
  type: "level";
  currentLevel: number;
  requirement: number;
}

/**
 * The props for time requirement label.
 * @param type The type is harvests.
 * @param minHarvest The minimum number of harvests.
 * @param maxHarvest The maximum number of harvests.
 */
interface HarvestsProps {
  type: "harvests";
  minHarvest: number;
  maxHarvest: number;
}

/**
 * The default props.
 * @param className The class name for the label.
 */
interface defaultProps {
  className?: string;
}

type Props = (
  | SFLProps
  | SellSFLProps
  | ItemProps
  | TimeProps
  | XPProps
  | LevelProps
  | HarvestsProps
) &
  defaultProps;

/**
 * The reqirement label that consists of an icon and a requirement description.
 * This component is used when displaying individual crafting requirements in a crafting recipe.
 * @props The component props.
 */
export const RequirementLabel: React.FC<Props> = (props) => {
  const getIcon = () => {
    switch (props.type) {
      case "sfl":
      case "sellForSfl":
        return token;
      case "item":
        return ITEM_DETAILS[props.item].image;
      case "time":
        return watch;
      case "xp":
      case "level":
        return levelup;
      case "harvests":
        return seedling;
    }
  };
  const getText = () => {
    switch (props.type) {
      case "sfl": {
        return props.requirement.equals(0)
          ? "Free"
          : `${props.requirement.toNumber()}`;
      }
      case "sellForSfl": {
        return `${props.requirement.toNumber()}`;
      }
      case "item": {
        const roundedDownInventory = props.balance.toDecimalPlaces(
          1,
          Decimal.ROUND_FLOOR
        );
        const roundedDownRequirement = props.requirement.toDecimalPlaces(
          1,
          Decimal.ROUND_FLOOR
        );
        return `${roundedDownInventory}/${roundedDownRequirement}`;
      }
      case "time": {
        return secondsToString(props.waitSeconds, {
          length: "medium",
          removeTrailingZeros: true,
        });
      }
      case "xp": {
        const roundedDownXp = props.xp.toDecimalPlaces(1, Decimal.ROUND_FLOOR);
        return `${roundedDownXp} XP`;
      }
      case "level": {
        return `Level ${props.requirement}`;
      }
      case "harvests": {
        return `${props.minHarvest}-${props.maxHarvest} harvests`;
      }
    }
  };
  const isRequirementMet = () => {
    switch (props.type) {
      case "sfl":
      case "item":
        return props.balance.greaterThanOrEqualTo(props.requirement);
      case "level":
        return props.currentLevel >= props.requirement;
      case "sellForSfl":
      case "time":
      case "xp":
      case "harvests":
        return true;
    }
  };
  const requirementMet = isRequirementMet();

  return (
    <div className={classNames("flex justify-between", props.className)}>
      <SquareIcon icon={getIcon()} width={7} />
      <Label
        className={classNames("whitespace-nowrap", { "ml-1": !requirementMet })}
        type={requirementMet ? "transparent" : "danger"}
      >
        {getText()}
      </Label>
    </div>
  );
};
