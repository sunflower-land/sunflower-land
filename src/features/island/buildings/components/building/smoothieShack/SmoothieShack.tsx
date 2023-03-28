import React, { useContext, useState } from "react";
import classNames from "classnames";

import smoothieShack from "assets/buildings/smoothie_shack_background.webp";
import smoothieShackDesk from "assets/buildings/smoothie_shack_desk.webp";
import smoothieChef from "assets/npcs/smoothie.gif";
import smoothieChefMaking from "assets/npcs/smoothie_making.gif";

import { CookableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { CraftingMachineChildProps } from "../WithCraftingMachine";
import { BuildingProps } from "../Building";
import { InventoryItemName } from "features/game/types/game";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { setImageWidth } from "lib/images";
import { SmoothieShackModal } from "./SmoothieShackModal";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { MachineInterpreter } from "features/game/expansion/placeable/editingMachine";

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
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [showModal, setShowModal] = useState(false);
  const { setToast } = useContext(ToastContext);

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

    setToast({
      icon: ITEM_DETAILS[name as InventoryItemName].image,
      content: "+1",
    });
  };

  const handleClick = () => {
    if (gameState.matches("editing")) {
      const editing = gameService.state.children.editing as MachineInterpreter;

      if (editing.state.matches("idle")) {
        editing.send("SELECT_TO_MOVE", {
          id: buildingId,
          placeable: "Smoothie Shack",
          placeableType: "BUILDING",
        });
        return;
      }
      return;
    }

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
          src={smoothieShack}
          className={classNames("absolute bottom-0", {
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
            src={smoothieChefMaking}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 16}px`,
              right: `${PIXEL_SCALE * 16}px`,
              bottom: `${PIXEL_SCALE * 11}px`,
            }}
          />
        ) : (
          <img
            src={smoothieChef}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 15}px`,
              right: `${PIXEL_SCALE * 17}px`,
              bottom: `${PIXEL_SCALE * 11}px`,
            }}
          />
        )}

        <img
          src={smoothieShackDesk}
          className={classNames("absolute", {
            "opacity-100": !crafting,
            "opacity-80": crafting,
          })}
          style={{
            width: `${PIXEL_SCALE * 24}px`,
            height: `${PIXEL_SCALE * 32}px`,
            right: `${PIXEL_SCALE * 12}px`,
            top: `${PIXEL_SCALE * 2}px`,
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
              bottom: `${PIXEL_SCALE * 4}px`,
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
      />
    </>
  );
};
