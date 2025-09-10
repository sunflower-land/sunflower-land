import React from "react";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import { PetName } from "features/game/types/pets";
import { PET_PIXEL_STYLES, PET_STATE_IMAGES } from "./petShared";

interface PetSpriteProps {
  name: PetName;
  isNeglected: boolean;
  isNapping: boolean;
  onClick?: () => void;
  clickable?: boolean;
  children?: React.ReactNode;
}

export const PetSprite: React.FC<PetSpriteProps> = ({
  name,
  isNeglected,
  isNapping,
  onClick,
  clickable = false,
  children,
}) => {
  const petImage =
    PET_STATE_IMAGES[name][isNeglected || isNapping ? "asleep" : "happy"];

  return (
    <div className="absolute" style={{ ...PET_PIXEL_STYLES[name] }}>
      <img
        src={petImage}
        className={classNames("absolute w-full", {
          "cursor-pointer hover:img-highlight": clickable,
        })}
        alt={name}
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
