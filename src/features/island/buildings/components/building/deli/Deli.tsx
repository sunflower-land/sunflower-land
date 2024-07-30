import React, { useEffect, useState } from "react";
import classNames from "classnames";

import { SUNNYSIDE } from "assets/sunnyside";

import { CookableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { CraftingMachineChildProps } from "../WithCraftingMachine";
import { BuildingProps } from "../Building";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { DeliModal } from "./DeliModal";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { setImageWidth } from "lib/images";
import { bakeryAudio, loadAudio } from "lib/utils/sfx";
import { DELI_VARIANTS } from "features/island/lib/alternateArt";
import shadow from "assets/npcs/shadow.png";

type Props = BuildingProps & Partial<CraftingMachineChildProps>;

export const Deli: React.FC<Props> = ({
  buildingId,
  crafting,
  idle,
  ready,
  name,
  craftingService,
  isBuilt,
  onRemove,
  island,
}) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadAudio([bakeryAudio]);
  }, []);

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
        bakeryAudio.play();
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
      <BuildingImageWrapper name="Deli" onClick={handleClick} ready={ready}>
        <img
          src={DELI_VARIANTS[island]}
          className={classNames("absolute bottom-0 pointer-events-none", {
            "opacity-100": !crafting,
            "opacity-80": crafting,
          })}
          style={{
            width: `${PIXEL_SCALE * 64}px`,
            height: `${PIXEL_SCALE * 54}px`,
          }}
        />
        <img
          src={shadow}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            right: `${PIXEL_SCALE * 2.5}px`,
            bottom: `${PIXEL_SCALE * 15}px`,
          }}
        />
        {crafting ? (
          <img
            src={SUNNYSIDE.npcs.artisianDoing}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 17}px`,
              right: `${PIXEL_SCALE * 1}px`,
              bottom: `${PIXEL_SCALE * 17}px`,
              transform: "scaleX(-1)",
            }}
          />
        ) : (
          <img
            src={SUNNYSIDE.npcs.artisian}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 15}px`,
              right: `${PIXEL_SCALE * 1}px`,
              bottom: `${PIXEL_SCALE * 17}px`,
              transform: "scaleX(-1)",
            }}
          />
        )}

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

              const right = Math.floor(8 - img.naturalWidth / 2);
              img.style.right = `${PIXEL_SCALE * right}px`;
              setImageWidth(img);
            }}
            style={{
              opacity: 0,
              bottom: `${PIXEL_SCALE * 8}px`,
            }}
          />
        )}
      </BuildingImageWrapper>

      <DeliModal
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
