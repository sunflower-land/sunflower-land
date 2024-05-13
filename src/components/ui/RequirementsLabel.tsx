import Decimal from "decimal.js-light";
import { InventoryItemName } from "features/game/types/game";
import React from "react";
import { Label } from "./Label";
import { SquareIcon } from "./SquareIcon";
import { ITEM_DETAILS } from "features/game/types/images";
import levelup from "assets/icons/level_up.png";
import token from "assets/icons/sfl.webp";
import coins from "assets/icons/coins.webp";
import { secondsToString } from "lib/utils/time";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import { setPrecision } from "lib/utils/formatNumber";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

/**
 * The props for SFL requirement label. Use this when the item costs SFL.
 * @param type The type is SFL.
 * @param balance The SFL balance of the player.
 * @param requirement The SFL requirement.
 */
interface SFLProps {
  type: "sfl";
  balance: Decimal;
  requirement: Decimal;
  showLabel?: boolean;
}

/**
 * The props for sell for SFL requirement label. Use this when selling the item gives players SFL.
 * @param type The type is sell for SFL.
 * @param requirement The SFL requirement.
 */
interface SellSFLProps {
  type: "sellForSfl";
  requirement: Decimal;
}

/**
 * The props for Coins requirement label. Use this when the item costs Coins.
 * @param type The type is Coins.
 * @param balance The Coins balance of the player.
 * @param requirement The Coins requirement.
 */
interface CoinsProps {
  type: "coins";
  balance: number;
  requirement: number;
  showLabel?: boolean;
}

/**
 * The props for sell for Coins requirement label. Use this when selling the item gives players Coins.
 * @param type The type is sell for Coins.
 * @param requirement The Coins requirement.
 */
interface SellCoinsProps {
  type: "sellForCoins";
  requirement: number;
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
  showLabel?: boolean;
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
 * The props for harvests requirement label.
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
  | CoinsProps
  | SellCoinsProps
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
 * The requirement label that consists of an icon and a requirement description.
 * This component is used when displaying individual crafting requirements in a crafting recipe.
 * @props The component props.
 */
export const RequirementLabel: React.FC<Props> = (props) => {
  const { t } = useAppTranslation();

  const getIcon = () => {
    switch (props.type) {
      case "coins":
      case "sellForCoins":
        return coins;
      case "sfl":
      case "sellForSfl":
        return token;
      case "item":
        return ITEM_DETAILS[props.item].image;
      case "time":
        return SUNNYSIDE.icons.stopwatch;
      case "xp":
      case "level":
        return levelup;
      case "harvests":
        return SUNNYSIDE.icons.seedling;
    }
  };

  const getText = () => {
    switch (props.type) {
      case "coins":
      case "sellForCoins":
        return `${setPrecision(new Decimal(props.requirement))}`;
      case "sfl":
        return `${props.requirement.toNumber()}`;
      case "sellForSfl": {
        return `${props.requirement.toNumber()}`;
      }
      case "item": {
        const roundedDownInventory = setPrecision(props.balance, 1);
        const roundedDownRequirement = setPrecision(props.requirement, 1);
        return `${roundedDownInventory}/${roundedDownRequirement}`;
      }
      case "time": {
        return secondsToString(props.waitSeconds, {
          length: "medium",
          removeTrailingZeros: true,
        });
      }
      case "xp": {
        const roundedDownXp = setPrecision(props.xp, 1);
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
      case "coins":
        return props.balance >= props.requirement;
      case "sfl":
        return props.balance.greaterThanOrEqualTo(props.requirement);
      case "item":
        return props.balance.greaterThanOrEqualTo(props.requirement);
      case "level":
        return props.currentLevel >= props.requirement;
      case "sellForSfl":
      case "sellForCoins":
      case "time":
      case "xp":
      case "harvests":
        return true;
    }
  };
  const requirementMet = isRequirementMet();

  return (
    <div className={props.className ?? "flex justify-between"}>
      <div className="flex items-center">
        <SquareIcon icon={getIcon()} width={7} />
        {props.type === "sfl" && props.showLabel && (
          <span className="text-xs ml-1">{"SFL"}</span>
        )}
        {props.type === "item" && props.showLabel && (
          <span className="text-xs ml-1">{props.item}</span>
        )}
        {props.type === "coins" && props.showLabel && (
          <span className="text-xs ml-1">{t("coins")}</span>
        )}
      </div>

      <Label
        className={classNames("whitespace-nowrap", { "ml-1": !requirementMet })}
        type={requirementMet ? "transparent" : "danger"}
      >
        {getText()}
      </Label>
    </div>
  );
};
