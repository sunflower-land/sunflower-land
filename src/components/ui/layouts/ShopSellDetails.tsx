import { Inventory, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import React from "react";
import { RequirementLabel } from "../RequirementsLabel";
import { SquareIcon } from "../SquareIcon";
import Decimal from "decimal.js-light";
import { SUNNYSIDE } from "assets/sunnyside";
import { formatDateRange } from "lib/utils/time";
import { Label } from "../Label";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { isCollectible } from "features/game/events/landExpansion/garbageSold";

/**
 * The props for the details for items.
 * @param item The item.
 */
interface ItemDetailsProps {
  item: InventoryItemName | BumpkinItem;
  from?: Date;
  to?: Date;
}

/**
 * The props for selling the item.
 * @param coins The coins gained for selling the item.
 */
interface PropertiesProps {
  coins?: number;
  sfl?: Decimal;
  gems?: number;
  items?: Inventory;
}

/**
 * The props for the component.
 * @param details The item details.
 * @param requirements The item properties.
 * @param actionView The view for displaying the crafting action.
 */
interface Props {
  details: ItemDetailsProps;
  properties?: PropertiesProps;
  actionView?: JSX.Element;
}

/**
 * The view for displaying item name, details, properties and action.
 * @props The component props.
 */

export const ShopSellDetails: React.FC<Props> = ({
  details,
  properties,
  actionView,
}: Props) => {
  return (
    <div className="flex flex-col h-full justify-center">
      <div className="flex flex-col h-full px-1 py-0">
        {details.from && (
          <Label
            icon={SUNNYSIDE.icons.stopwatch}
            type="warning"
            className="my-1 mx-auto whitespace-nowrap"
          >
            {formatDateRange(details.from, details.to as Date)}
          </Label>
        )}
        <ItemDetails {...details} />
        <ItemProperties {...properties} />
      </div>
      {actionView}
    </div>
  );
};

const ItemDetails: React.FC<ItemDetailsProps> = (details) => {
  const { item } = details;
  const image = isCollectible(item)
    ? ITEM_DETAILS[item].image
    : new URL(`/src/assets/wearables/${ITEM_IDS[item]}.webp`, import.meta.url)
        .href;
  const description = isCollectible(item)
    ? ITEM_DETAILS[item].description
    : BUMPKIN_ITEM_BUFF_LABELS[item]?.map((b) => b.shortDescription).join(", ");

  return (
    <>
      <div className="flex space-x-2 justify-start items-center sm:flex-col-reverse md:space-x-0">
        {image && (
          <div className="sm:mt-2">
            <SquareIcon icon={image} width={14} />
          </div>
        )}
        <span className="sm:text-center">{item}</span>
      </div>
      {description && (
        <span className="text-xs mb-2 sm:mt-1 whitespace-pre-line sm:text-center">
          {description}
        </span>
      )}
    </>
  );
};

const ItemProperties: React.FC<PropertiesProps> = (properties) => {
  if (!properties) return <></>;

  return (
    <div className="border-t border-white w-full mb-2 pt-2 flex justify-between gap-x-3 gap-y-2 flex-wrap sm:flex-col sm:items-center sm:flex-nowrap">
      {/* Price display */}
      {properties.coins !== undefined && (
        <RequirementLabel type="sellForCoins" requirement={properties.coins} />
      )}
      {properties.gems !== undefined && (
        <RequirementLabel type="sellForGems" requirement={properties.gems} />
      )}
      {!!properties.sfl && (
        <RequirementLabel type="sellForSfl" requirement={properties.sfl} />
      )}
      {properties.items && (
        <>
          {Object.entries(properties.items).map(([name, amount]) => (
            <RequirementLabel
              key={name}
              type="sellForItem"
              requirement={amount.toNumber()}
              item={name as InventoryItemName}
            />
          ))}
        </>
      )}
    </div>
  );
};
