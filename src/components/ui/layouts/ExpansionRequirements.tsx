import Decimal from "decimal.js-light";
import { getBumpkinLevel } from "features/game/lib/level";
import { getKeys } from "features/game/types/craftables";
import {
  Bumpkin,
  ExpansionRequirements as IExpansionRequirements,
  Inventory,
} from "features/game/types/game";
import React from "react";
import { RequirementLabel } from "../RequirementsLabel";

/**
 * The props for the component.
 * @param gameState The game state.
 * @param details The expansion details.
 * @param requirements The expansion requirement.
 * @param actionView The view for displaying the expansion action.
 */
interface Props {
  inventory: Inventory;
  bumpkin: Bumpkin;
  details?: DetailsProps;
  requirements?: IExpansionRequirements;
  actionView?: JSX.Element;
}

/**
 * The props for the details.
 * @param title The title.
 * @param description The description.
 */
interface DetailsProps {
  description?: string;
}

/**
 * The view for displaying expansion details, requirements and action.
 * @props The component props.
 */
export const ExpansionRequirements: React.FC<Props> = ({
  inventory,
  bumpkin,
  details,
  requirements,
  actionView,
}: Props) => {
  const getItemDetail = () => {
    if (!details?.description) return null;

    return (
      <>
        <span className="text-xs mt-1 whitespace-pre-line sm:text-center">
          {details.description}
        </span>
      </>
    );
  };

  const getRequirements = () => {
    if (!requirements) return null;

    return (
      <div className="border-t border-white w-full my-2 pt-2 flex justify-between gap-x-3 gap-y-2 flex-wrap sm:flex-col sm:items-center sm:flex-nowrap">
        <Requirements
          requirements={requirements}
          inventory={inventory}
          bumpkin={bumpkin}
        />
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

export const Requirements = ({
  requirements,
  inventory,
  bumpkin,
}: {
  inventory: Inventory;
  requirements?: IExpansionRequirements;
  bumpkin: Bumpkin;
}) => {
  if (!requirements) return <></>;

  return (
    <>
      {/* Item ingredients requirements */}
      {getKeys(requirements.resources)?.map((name, index) => {
        return (
          <RequirementLabel
            key={index}
            type="item"
            item={name}
            balance={inventory[name] ?? new Decimal(0)}
            requirement={new Decimal(requirements.resources[name] ?? 0)}
          />
        );
      })}

      {/* Level requirement */}
      {!!requirements.bumpkinLevel && (
        <RequirementLabel
          type="level"
          currentLevel={getBumpkinLevel(bumpkin?.experience ?? 0)}
          requirement={requirements.bumpkinLevel}
        />
      )}

      {/* Time requirement display */}
      {!!requirements.seconds && (
        <RequirementLabel type="time" waitSeconds={requirements.seconds} />
      )}
    </>
  );
};
