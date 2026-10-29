import React from "react";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import type { PetName, PetNFTType } from "features/game/types/pets";
import { getPetImage, PET_PIXEL_STYLES } from "./lib/petShared";
import { PIXEL_SCALE } from "features/game/lib/constants";
import foodIcon from "assets/food/chicken_drumstick.png";

type SharedProps = {
  isNeglected: boolean;
  isNapping: boolean;
  isTypeFed?: boolean;
  /** Not fed a single dish today: shows a food bubble as a reminder. */
  isHungry?: boolean;
  onClick?: () => void;
  clickable?: boolean;
};

type Props =
  | (SharedProps & {
      id: PetName;
      petType?: never;
    })
  | (SharedProps & {
      id: number;
      petType: PetNFTType;
    });

const NFT_ICON_POSITIONS: Record<
  PetNFTType,
  {
    napping: string;
    neglected: string;
  }
> = {
  Dragon: { napping: "top-2 left-2", neglected: "top-1 left-4" },
  Phoenix: { napping: "top-4 left-4", neglected: "top-1 left-4" },
  Griffin: { napping: "top-5 left-4", neglected: "top-1 left-4" },
  Ram: { napping: "top-1.5 left-1.5", neglected: "top-1.5 left-1.5" },
  Warthog: { napping: "top-5 left-4", neglected: "top-1 left-2" },
  Wolf: { napping: "top-5 left-2", neglected: "top-1.5 left-1.5" },
  Bear: { napping: "top-5 left-3", neglected: "top-1 left-2" },
};

export const PetSprite: React.FC<Props> = ({
  id,
  isNeglected,
  petType,
  isNapping,
  isTypeFed,
  isHungry,
  onClick,
  clickable = false,
}) => {
  const petImage = getPetImage(
    isNeglected || isNapping || isTypeFed ? "asleep" : "happy",
    id,
  );
  const isPetNFT = typeof id === "number";
  const nftIconPositions =
    isPetNFT && !!petType ? NFT_ICON_POSITIONS[petType] : undefined;

  return (
    <div
      className="absolute"
      style={{
        ...(!isPetNFT
          ? PET_PIXEL_STYLES[id]
          : {
              width: `${PIXEL_SCALE * 44}px`,
              height: `${PIXEL_SCALE * 44}px`,
              left: "50%",
              bottom: "-8px",
              transform: `translateX(-50%)`,
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
            [nftIconPositions?.neglected ?? ""]: isPetNFT,
          })}
        />
      ) : isNapping && !isTypeFed ? (
        <img
          src={SUNNYSIDE.icons.sleeping}
          alt="sleeping"
          className={classNames("absolute w-6", {
            "top-[-0.5rem] left-[-0.5rem]": !isPetNFT,
            [nftIconPositions?.napping ?? ""]: isPetNFT,
          })}
        />
      ) : isHungry ? (
        // Not fed today: a food bubble (same frame as the barn animals'
        // requests, same drumstick as the Bumpkin Feed tab).
        <div
          className="absolute z-10 flex justify-center items-center pointer-events-none"
          style={{
            top: `${-PIXEL_SCALE * 11}px`,
            left: "50%",
            transform: "translateX(-50%)",
            borderImage: `url(${SUNNYSIDE.ui.speechBorder})`,
            borderStyle: "solid",
            borderTopWidth: `${PIXEL_SCALE * 2}px`,
            borderRightWidth: `${PIXEL_SCALE * 2}px`,
            borderBottomWidth: `${PIXEL_SCALE * 4}px`,
            borderLeftWidth: `${PIXEL_SCALE * 5}px`,
            borderImageSlice: "2 2 4 5 fill",
            imageRendering: "pixelated",
            borderImageRepeat: "stretch",
          }}
        >
          {/* The left border slice is wider than the right, so pull the
              icon back by the difference to centre it in the bubble. */}
          <img
            src={foodIcon}
            alt="hungry"
            style={{
              width: "18px",
              minWidth: "18px",
              height: "20px",
              flexShrink: 0,
              marginLeft: `-${PIXEL_SCALE * 3}px`,
            }}
          />
        </div>
      ) : null}
    </div>
  );
};
