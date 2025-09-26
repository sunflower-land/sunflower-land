import React from "react";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import { Pet, PetName, PetNFT } from "features/game/types/pets";
import { getPetImage, PET_PIXEL_STYLES } from "./lib/petShared";

interface PetSpriteProps {
  id: PetName | number;
  isNeglected: boolean;
  isNapping: boolean;
  onClick?: () => void;
  clickable?: boolean;
  children?: React.ReactNode;
  petData?: Pet | PetNFT;
}

export const PetSprite: React.FC<PetSpriteProps> = ({
  id,
  isNeglected,
  isNapping,
  onClick,
  clickable = false,
  children,
  petData,
}) => {
  const petImage = getPetImage(
    isNeglected || isNapping ? "asleep" : "happy",
    petData,
  );

  return (
    <div
      className="absolute"
      style={{ ...PET_PIXEL_STYLES[typeof id === "number" ? `Ramsey` : id] }}
    >
      <img
        src={petImage}
        className={classNames("absolute w-full", {
          "cursor-pointer hover:img-highlight": clickable,
        })}
        alt={typeof id === "number" ? `Ramsey` : id}
        onClick={onClick}
      />

      {isNapping ? (
        <img
          src={SUNNYSIDE.icons.sleeping}
          alt="sleeping"
          className="absolute w-6 top-[-0.5rem] left-[-0.5rem]"
        />
      ) : isNeglected ? (
        <img
          src={SUNNYSIDE.icons.expression_stress}
          alt="stress"
          className="absolute w-[18px] top-[-0.5rem] left-[-0.5rem]"
        />
      ) : null}

      {children}
    </div>
  );
};
