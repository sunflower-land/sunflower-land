import React, { useContext, useEffect, useState } from "react";

import classNames from "classnames";
import { FirePitModal } from "./FirePitModal";
import { CookableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { CraftingMachineChildProps } from "../WithCraftingMachine";
import { BuildingProps } from "../Building";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { setImageWidth } from "lib/images";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { bakeryAudio, loadAudio } from "lib/utils/sfx";
import { gameAnalytics } from "lib/gameAnalytics";

import { SUNNYSIDE } from "assets/sunnyside";
import { FIRE_PIT_VARIANTS } from "features/island/lib/alternateArt";
import shadow from "assets/npcs/shadow.png";
import { MachineState } from "features/game/lib/gameMachine";
import Decimal from "decimal.js-light";

type Props = BuildingProps & Partial<CraftingMachineChildProps>;

const _mashedPotatoCooked = (state: MachineState) =>
  state.context.state.bumpkin?.activity?.["Mashed Potato Cooked"];
const _experience = (state: MachineState) =>
  state.context.state.bumpkin?.experience;
const _potatoCount = (state: MachineState) =>
  state.context.state.inventory.Potato ?? new Decimal(0);

export const FirePit: React.FC<Props> = ({
  buildingId,
  crafting,
  idle,
  ready,
  name,
  craftingService,
  isBuilt,
  island,
  onRemove,
}) => {
  const { gameService } = useContext(Context);
  const [showModal, setShowModal] = useState(false);

  const mashedPotatoCooked = useSelector(gameService, _mashedPotatoCooked);
  const experience = useSelector(gameService, _experience);
  const potatoCount = useSelector(gameService, _potatoCount);

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

    if (item === "Mashed Potato" && !mashedPotatoCooked) {
      gameAnalytics.trackMilestone({
        event: "Tutorial:Cooked:Completed",
      });
    }
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

  const showHelper = potatoCount.gte(8) && experience === 0 && !crafting;

  return (
    <>
      <BuildingImageWrapper name="Fire Pit" onClick={handleClick} ready={ready}>
        <img
          src={FIRE_PIT_VARIANTS[island]}
          className={classNames("absolute bottom-0 pointer-events-none", {
            "opacity-100": !crafting,
            "opacity-80": crafting,
          })}
          style={{
            width: `${PIXEL_SCALE * 47}px`,
            height: `${PIXEL_SCALE * 33}px`,
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

              const left = Math.floor(24 - img.naturalWidth / 2);
              img.style.left = `${PIXEL_SCALE * left}px`;
              setImageWidth(img);
            }}
            style={{
              opacity: 0,
              bottom: `${PIXEL_SCALE * 6}px`,
            }}
          />
        )}
        <img
          src={shadow}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            top: `${PIXEL_SCALE * 14}px`,
            left: `${PIXEL_SCALE * 11}px`,
          }}
        />
        {showHelper && (
          <img
            className="absolute cursor-pointer group-hover:img-highlight z-30 animate-pulsate"
            src={SUNNYSIDE.icons.click_icon}
            style={{
              width: `${PIXEL_SCALE * 18}px`,
              right: `${PIXEL_SCALE * -8}px`,
              top: `${PIXEL_SCALE * 20}px`,
            }}
          />
        )}

        {crafting ? (
          <img
            src={SUNNYSIDE.npcs.firePit_npcDoing}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 16}px`,
              top: `${PIXEL_SCALE * 2}px`,
              left: `${PIXEL_SCALE * 13}px`,
            }}
          />
        ) : (
          <img
            src={SUNNYSIDE.npcs.firePit_npc}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 14}px`,
              top: `${PIXEL_SCALE * 2}px`,
              left: `${PIXEL_SCALE * 11}px`,
            }}
          />
        )}
      </BuildingImageWrapper>

      <FirePitModal
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
