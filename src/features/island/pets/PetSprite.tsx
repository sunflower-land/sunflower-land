import React from "react";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import { PetName } from "features/game/types/pets";
import { getPetImage, PET_PIXEL_STYLES } from "./lib/petShared";
import { PIXEL_SCALE } from "features/game/lib/constants";

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
}) => {
  const petImage = getPetImage(
    isNeglected || isNapping || isTypeFed ? "asleep" : "happy",
    id,
  );
  const isPetNFT = typeof id === "number";

  return (
    <div
      className="absolute"
      style={{
        ...(!isPetNFT
          ? PET_PIXEL_STYLES[id]
          : {
              width: `${PIXEL_SCALE * 32}px`,
              height: `${PIXEL_SCALE * 32}px`,
            }),
      }}
    >
      <img
        src={petImage}
        className={classNames("absolute w-full", {
          "cursor-pointer hover:img-highlight": clickable,
        })}
        alt={typeof id === "number" ? `Pet #${id}` : id}
        onClick={onClick}
      />

      {isNeglected || isTypeFed ? (
        <img
          src={SUNNYSIDE.icons.expression_stress}
          alt="stress"
          className={classNames("absolute w-[18px]", {
            "top-[-0.5rem] left-[-0.5rem]": !isPetNFT,
            "top-0 right-0": isPetNFT,
          })}
        />
      ) : isNapping && !isTypeFed ? (
        <img
          src={SUNNYSIDE.icons.sleeping}
          alt="sleeping"
          className={classNames("absolute w-6", {
            "top-[-0.5rem] left-[-0.5rem]": !isPetNFT,
            "-top-1 left-0": isPetNFT,
          })}
        />
      ) : null}
    </div>
  );
};
