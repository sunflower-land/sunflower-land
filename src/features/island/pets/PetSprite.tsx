import React from "react";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import { PetName } from "features/game/types/pets";
import { getPetImage, PET_PIXEL_STYLES } from "./lib/petShared";

interface PetSpriteProps {
  id: PetName | number;
  isNeglected: boolean;
  isNapping: boolean;
  isTypeFed?: boolean;
  onClick?: () => void;
  clickable?: boolean;
  children?: React.ReactNode;
}

export const PetSprite: React.FC<PetSpriteProps> = ({
  id,
  isNeglected,
  isNapping,
  isTypeFed,
  onClick,
  clickable = false,
  children,
}) => {
  const petImage = getPetImage(
    isNeglected || isNapping || isTypeFed ? "asleep" : "happy",
    id,
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

      {isNeglected || isTypeFed ? (
        <img
          src={SUNNYSIDE.icons.expression_stress}
          alt="stress"
          className="absolute w-[18px] top-[-0.5rem] left-[-0.5rem]"
        />
      ) : isNapping && !isTypeFed ? (
        <img
          src={SUNNYSIDE.icons.sleeping}
          alt="sleeping"
          className="absolute w-6 top-[-0.5rem] left-[-0.5rem]"
        />
      ) : null}

      {children}
    </div>
  );
};
