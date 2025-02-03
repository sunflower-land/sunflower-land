import React, { useState } from "react";
import classNames from "classnames";

import { SUNNYSIDE } from "assets/sunnyside";
import shadow from "assets/npcs/shadow.png";

import { CookableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { CraftingMachineChildProps } from "../WithCraftingMachine";
import { BuildingProps } from "../Building";
import { BakeryModal } from "./BakeryModal";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { setImageWidth } from "lib/images";
import { BAKERY_VARIANTS } from "features/island/lib/alternateArt";
import { useSound } from "lib/utils/hooks/useSound";

type Props = BuildingProps & Partial<CraftingMachineChildProps>;

export const Bakery: React.FC<Props> = ({
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
      // Add future on click actions here
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
      <BuildingImageWrapper name="Bakery" onClick={handleClick} ready={ready}>
        <img
          src={BAKERY_VARIANTS[season]}
          className={classNames("absolute bottom-0 pointer-events-none", {
            "opacity-100": !crafting,
            "opacity-80": crafting,
          })}
          style={{
            left: `${PIXEL_SCALE * 1}px`,
            width: `${PIXEL_SCALE * 62}px`,
            height: `${PIXEL_SCALE * 51}px`,
          }}
        />
        <img
          src={shadow}
          className="absolute bottom-0 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            left: `${PIXEL_SCALE * 30}px`,
          }}
        />
        {crafting ? (
          <img
            src={SUNNYSIDE.npcs.goblin_chef_doing}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 25}px`,
              left: `${PIXEL_SCALE * 27}px`,
              bottom: `${PIXEL_SCALE * 1}px`,
              transform: "scaleX(-1)",
            }}
          />
        ) : (
          <img
            src={SUNNYSIDE.npcs.goblin_chef}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 22}px`,
              left: `${PIXEL_SCALE * 29}px`,
              bottom: `${PIXEL_SCALE * 3}px`,
              transform: "scaleX(-1)",
            }}
          />
        )}
        {crafting && (
          <img
            src={SUNNYSIDE.building.smoke}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 20}px`,
              left: `${PIXEL_SCALE * 9}px`,
              bottom: `${PIXEL_SCALE * 44}px`,
            }}
          />
        )}

        {(crafting || ready) && name && (
          <img
            src={ITEM_DETAILS[name].image}
            className={classNames("absolute z-30 pointer-events-none", {
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

              const left = Math.floor(21 - img.naturalWidth / 2);
              img.style.left = `${PIXEL_SCALE * left}px`;
              setImageWidth(img);
            }}
            style={{
              opacity: 0,
              bottom: `${PIXEL_SCALE * 5}px`,
            }}
          />
        )}
      </BuildingImageWrapper>

      <BakeryModal
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
