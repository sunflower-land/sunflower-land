import React from "react";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  isPetNFTRevealed,
  PetName,
  PetNFTType,
} from "features/game/types/pets";
import { getPetImage, isPetNFT, PET_PIXEL_STYLES } from "./lib/petShared";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useNow } from "lib/utils/hooks/useNow";

type SharedProps = {
  isNeglected: boolean;
  isNapping: boolean;
  isTypeFed?: boolean;
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
  onClick,
  clickable = false,
}) => {
  let now = useNow();
  const petIsNFT = isPetNFT(id);
  now = useNow({ live: petIsNFT && !isPetNFTRevealed(id, now) });
  const petImage = getPetImage({
    state: isNeglected || isNapping || isTypeFed ? "asleep" : "idle",
    id,
    now,
  });

  const nftIconPositions =
    petIsNFT && !!petType ? NFT_ICON_POSITIONS[petType] : undefined;

  return (
    <div
      className="absolute"
      style={{
        ...(!petIsNFT
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
            "top-[-0.5rem] left-[-0.5rem]": !petIsNFT,
            [nftIconPositions?.neglected ?? ""]: petIsNFT,
          })}
        />
      ) : isNapping && !isTypeFed ? (
        <img
          src={SUNNYSIDE.icons.sleeping}
          alt="sleeping"
          className={classNames("absolute w-6", {
            "top-[-0.5rem] left-[-0.5rem]": !petIsNFT,
            [nftIconPositions?.napping ?? ""]: petIsNFT,
          })}
        />
      ) : null}
    </div>
  );
};
