import React, { type JSX } from "react";
import { SquareIcon } from "../SquareIcon";
import { getPetImage } from "features/island/pets/lib/petShared";
import { PetNFTName } from "features/game/types/pets";

/**
 * The props for the component.
 * @param petId Pet ID
 * @param petData Pet data
 * @param actionView The view for displaying the item action.
 */
interface Props {
  petId: number;
  actionView?: JSX.Element;
  petName: PetNFTName;
}

/**
 * The view for displaying item name, details, properties and action.
 * @props The component props.
 */
export const PetNFTDetails: React.FC<Props> = ({
  actionView,
  petId,
  petName,
}) => {
  const icon = getPetImage("asleep", petId);

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col justify-center px-1 py-0">
        <div className="flex mb-1 items-center sm:flex-col-reverse md:space-x-0 gap-1">
          {icon && <SquareIcon icon={icon} width={20} />}
          <span className="sm:text-center">{petName}</span>
        </div>
      </div>
      {actionView}
    </div>
  );
};
