import React, { useState } from "react";
import classNames from "classnames";

import { SUNNYSIDE } from "assets/sunnyside";
import { CookableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { CraftingMachineChildProps } from "../WithCraftingMachine";
import { BuildingProps } from "../Building";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { setImageWidth } from "lib/images";
import { SmoothieShackModal } from "./SmoothieShackModal";
import {
  SMOOTHIE_SHACK_DESK_VARIANTS,
  SMOOTHIE_SHACK_VARIANTS,
} from "features/island/lib/alternateArt";
import { useSound } from "lib/utils/hooks/useSound";

type Props = BuildingProps & Partial<CraftingMachineChildProps>;

export const SmoothieShack: React.FC<Props> = ({
  buildingId,
  crafting,
  idle,
  ready,
  name,
  craftingService,
  isBuilt,
  onRemove,
  island,
  season,
}) => {
  const [showModal, setShowModal] = useState(false);

  const { play: bakeryAudio } = useSound("bakery");

  const handleCook = (item: CookableName) => {
    craftingService?.send({
      type: "CRAFT",
      event: "recipe.cooked",
      item,
      buildingId,
    });
  };

  const handleCollect = () => {
    if (!name) return;

    craftingService?.send({
      type: "COLLECT",
      item: name,
      event: "recipe.collected",
    });
  };

  const handleClick = () => {
    if (onRemove) {
      onRemove();
      return;
    }

    if (isBuilt) {
      if (idle || crafting) {
        bakeryAudio();
        setShowModal(true);
        return;
      }

      if (ready) {
        handleCollect();
        return;
      }
    }
  };

  return (
    <>
      <BuildingImageWrapper
        name="Smoothie Shack"
        onClick={handleClick}
        ready={ready}
      >
        <img
          src={SMOOTHIE_SHACK_VARIANTS[island]}
          className={classNames("absolute bottom-0 pointer-events-none", {
            "opacity-100": !crafting,
            "opacity-80": crafting,
          })}
          style={{
            width: `${PIXEL_SCALE * 48}px`,
            height: `${PIXEL_SCALE * 35}px`,
          }}
        />

        {crafting ? (
          <img
            src={SUNNYSIDE.npcs.smoothieChefMaking}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 15}px`,
              right: `${PIXEL_SCALE * 15}px`,
              bottom: `${PIXEL_SCALE * 11}px`,
            }}
          />
        ) : (
          <img
            src={SUNNYSIDE.npcs.smoothieChef}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 14}px`,
              right: `${PIXEL_SCALE * 17}px`,
              bottom: `${PIXEL_SCALE * 11}px`,
            }}
          />
        )}

        <img
          src={SMOOTHIE_SHACK_DESK_VARIANTS[season]}
          className={classNames("absolute pointer-events-none", {
            "opacity-100": !crafting,
            "opacity-80": crafting,
          })}
          style={{
            width: `${PIXEL_SCALE * 24}px`,
            height: `${PIXEL_SCALE * 32}px`,
            right: `${PIXEL_SCALE * 12}px`,
            top: `${season === "summer" ? PIXEL_SCALE * 2 : PIXEL_SCALE * 0}px`,
          }}
        />

        {(crafting || ready) && name && (
          <img
            src={ITEM_DETAILS[name].image}
            className={classNames("absolute pointer-events-none z-30", {
              "img-highlight-heavy": ready,
            })}
            onLoad={(e) => {
              const img = e.currentTarget;
              if (
                !img ||
                !img.complete ||
                !img.naturalWidth ||
                !img.naturalHeight
              ) {
                return;
              }

              const right = Math.floor(24 - img.naturalWidth / 2);
              img.style.right = `${PIXEL_SCALE * right}px`;
              setImageWidth(img);
            }}
            style={{
              opacity: 0,
              bottom: `${PIXEL_SCALE * 5}px`,
            }}
          />
        )}
      </BuildingImageWrapper>

      <SmoothieShackModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCook={handleCook}
        crafting={!!crafting}
        itemInProgress={name}
        craftingService={craftingService}
        buildingId={buildingId}
      />
    </>
  );
};
