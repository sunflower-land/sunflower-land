import React, { useContext, useState } from "react";
import classNames from "classnames";

import deli from "assets/buildings/deli.png";
import artisian from "assets/npcs/artisian.gif";
import artisianDoing from "assets/npcs/artisian_doing.gif";
import shadow from "assets/npcs/shadow.png";

import { ConsumableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { CraftingMachineChildProps } from "../WithCraftingMachine";
import { BuildingProps } from "../Building";
import { InventoryItemName } from "features/game/types/game";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { DeliModal } from "./DeliModal";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { setImageWidth } from "lib/images";

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
}) => {
  const [showModal, setShowModal] = useState(false);
  const { setToast } = useContext(ToastContext);

  if (!craftingService) {
    return null;
  }

  const handleCook = (item: ConsumableName) => {
    craftingService.send({
      type: "CRAFT",
      event: "recipe.cooked",
      item,
      buildingId,
    });
  };

  const handleCollect = () => {
    if (!name) return;

    craftingService.send({
      type: "COLLECT",
      item: name,
      event: "recipe.collected",
    });

    setToast({
      icon: ITEM_DETAILS[name as InventoryItemName].image,
      content: "+1",
    });
  };

  const handleClick = () => {
    if (onRemove) {
      onRemove();
      return;
    }

    if (isBuilt) {
      if (idle || crafting) {
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
      <BuildingImageWrapper onClick={handleClick} ready={ready}>
        <img
          src={deli}
          className={classNames("absolute bottom-0", {
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
            src={artisianDoing}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 20}px`,
              right: `${PIXEL_SCALE * 1}px`,
              bottom: `${PIXEL_SCALE * 17}px`,
              transform: "scaleX(-1)",
            }}
          />
        ) : (
          <img
            src={artisian}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 16}px`,
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
        craftingService={craftingService}
      />
    </>
  );
};
