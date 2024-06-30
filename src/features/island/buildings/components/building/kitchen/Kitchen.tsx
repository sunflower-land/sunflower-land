import React, { useEffect, useState } from "react";

import classNames from "classnames";

import npc from "assets/npcs/chef.gif";
import doing from "assets/npcs/chef_doing.gif";
import shadow from "assets/npcs/shadow.png";

import { CookableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { CraftingMachineChildProps } from "../WithCraftingMachine";
import { BuildingProps } from "../Building";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { KitchenModal } from "./KitchenModal";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { setImageWidth } from "lib/images";
import { bakeryAudio, loadAudio } from "lib/utils/sfx";
import { KITCHEN_VARIANTS } from "features/island/lib/alternateArt";

type Props = BuildingProps & Partial<CraftingMachineChildProps>;

export const Kitchen: React.FC<Props> = ({
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
      // Add future on click actions here
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
      <BuildingImageWrapper name="Kitchen" onClick={handleClick} ready={ready}>
        <img
          src={KITCHEN_VARIANTS[island]}
          className={classNames("absolute pointer-events-none bottom-0", {
            "opacity-100": !crafting,
            "opacity-80": crafting,
          })}
          style={{
            width: `${PIXEL_SCALE * 63}px`,
            height: `${PIXEL_SCALE * 50}px`,
          }}
        />
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

              const right = Math.floor((17 - img.naturalWidth) / 2);
              img.style.right = `${PIXEL_SCALE * right}px`;
              setImageWidth(img);
            }}
            style={{
              opacity: 0,
              bottom: `${PIXEL_SCALE * 10}px`,
            }}
          />
        )}
        <img
          src={shadow}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 6}px`,
            right: `${PIXEL_SCALE * 15}px`,
          }}
        />
        {crafting ? (
          <img
            src={doing}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 16}px`,
              bottom: `${PIXEL_SCALE * 7}px`,
              right: `${PIXEL_SCALE * 14}px`,
            }}
          />
        ) : (
          <img
            src={npc}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 15}px`,
              bottom: `${PIXEL_SCALE * 8}px`,
              right: `${PIXEL_SCALE * 14}px`,
            }}
          />
        )}
      </BuildingImageWrapper>

      <KitchenModal
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
