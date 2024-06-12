import Decimal from "decimal.js-light";
import { ConsumableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import React from "react";
import { RequirementLabel } from "../RequirementsLabel";
import { SquareIcon } from "../SquareIcon";

/**
 * The props for the details for items.
 * @param item The item.
 */
interface ItemDetailsProps {
  item: ConsumableName;
}

/**
 * The props for the feed bumpkin details.
 * @param xp The XP gained for consuming the item.
 */
interface PropertiesProps {
  xp?: Decimal;
}

/**
 * The props for the component.
 * @param details The item details.
 * @param requirements The item properties.
 * @param actionView The view for displaying the feed action.
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
export const FeedBumpkinDetails: React.FC<Props> = ({
  details,
  properties,
  actionView,
}: Props) => {
  const getItemDetail = () => {
    const item = ITEM_DETAILS[details.item];
    const icon = item.image;
    const title = details.item;
    const description = item.description;

    return (
      <>
        <div className="flex space-x-2 justify-start items-center sm:flex-col-reverse md:space-x-0">
          {icon && (
            <div className="sm:mt-2">
              <SquareIcon icon={icon} width={14} />
            </div>
          )}
          <span className="sm:text-center">{title}</span>
        </div>
        <span className="text-xs mb-2 sm:mt-1 whitespace-pre-line sm:text-center">
          {description}
        </span>
      </>
    );
  };

  const getProperties = () => {
    if (!properties) return <></>;

    return (
      <div className="border-t border-white w-full mb-2 pt-2 flex justify-between gap-x-3 gap-y-2 flex-wrap sm:flex-col sm:items-center sm:flex-nowrap">
        {/* XP display */}
        {!!properties.xp && <RequirementLabel type="xp" xp={properties.xp} />}
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-col justify-center px-1 py-0">
        {getItemDetail()}
        {getProperties()}
      </div>
      {actionView}
    </div>
  );
};
