import React from "react";
import { RequirementLabel } from "../RequirementsLabel";
import { SquareIcon } from "../SquareIcon";
import { GameState } from "features/game/types/game";

/**
 * The props for the details for items.
 * @param icon The item icon.
 * @param title The item title.
 * @param description The item description.
 */
interface ItemDetailsProps {
  icon: string;
  title: string;
  description: string;
}

/**
 * The props for the requirements.
 * @param coins The Coins requirements.
 */
interface RequirementsProps {
  coins?: number;
}

/**
 * The props for the component.
 * @param details The item details.
 * @param requirements The item requirements.
 * @param actionView The view for displaying the feed action.
 */
interface Props {
  gameState: GameState;
  details: ItemDetailsProps;
  requirements?: RequirementsProps;
  actionView?: JSX.Element;
}

/**
 * The view for displaying item name, details, properties and action.
 * @props The component props.
 */
export const GenericItemDetails: React.FC<Props> = ({
  gameState,
  details,
  requirements,
  actionView,
}: Props) => {
  const getItemDetail = () => {
    const icon = details.icon;
    const title = details.title;
    const description = details.description;

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

  const getRequirements = () => {
    if (!requirements) return <></>;

    return (
      <div className="border-t border-white w-full mb-2 pt-2 flex justify-between gap-x-3 gap-y-2 flex-wrap sm:flex-col sm:items-center sm:flex-nowrap">
        {/* Coins requirement */}
        {requirements.coins !== undefined && requirements.coins > 0 && (
          <RequirementLabel
            type="coins"
            balance={gameState.coins}
            requirement={requirements.coins}
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-col justify-center px-1 py-0">
        {getItemDetail()}
        {getRequirements()}
      </div>
      {actionView}
    </div>
  );
};
