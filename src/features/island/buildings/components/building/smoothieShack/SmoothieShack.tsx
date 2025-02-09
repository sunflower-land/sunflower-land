import React, { useContext, useState } from "react";
import classNames from "classnames";

import { SUNNYSIDE } from "assets/sunnyside";
import { CookableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { setImageWidth } from "lib/images";
import { SmoothieShackModal } from "./SmoothieShackModal";
import {
  SMOOTHIE_SHACK_DESK_VARIANTS,
  SMOOTHIE_SHACK_VARIANTS,
} from "features/island/lib/alternateArt";
import { useSound } from "lib/utils/hooks/useSound";
import { IslandType, TemperateSeasonName } from "features/game/types/game";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { useCookingState } from "features/island/buildings/lib/useCookingState";
import { ReadyRecipes } from "../ReadyRecipes";

type Props = {
  buildingId: string;
  isBuilt: boolean;
  island: IslandType;
  season: TemperateSeasonName;
};

const _smoothieShack = (id: string) => (state: MachineState) =>
  state.context.state.buildings["Smoothie Shack"]?.find((b) => b.id === id);

export const SmoothieShack: React.FC<Props> = ({
  buildingId,
  isBuilt,
  season,
  island,
}) => {
  const { gameService } = useContext(Context);
  const [showModal, setShowModal] = useState(false);

  const smoothieShack = useSelector(gameService, _smoothieShack(buildingId));
  const { cooking, queuedRecipes, readyRecipes } = useCookingState(
    smoothieShack ?? {},
  );

  const { play: bakeryAudio } = useSound("bakery");

  const handleCook = (item: CookableName) => {
    gameService?.send({
      type: "recipe.cooked",
      item,
      buildingId,
    });
  };

  const handleCollect = () => {
    gameService?.send({
      type: "recipes.collected",
      building: "Smoothie Shack",
      buildingId,
    });
  };

  const handleClick = () => {
    if (!isBuilt) return;

    if (!cooking && readyRecipes.length > 0) {
      handleCollect();
    } else {
      bakeryAudio();
      setShowModal(true);
    }
  };

  return (
    <>
      <BuildingImageWrapper
        name="Smoothie Shack"
        onClick={handleClick}
        ready={readyRecipes.length > 0}
      >
        <img
          src={SMOOTHIE_SHACK_VARIANTS[island]}
          className={classNames("absolute bottom-0 pointer-events-none", {
            "opacity-100": !cooking,
            "opacity-80": cooking,
          })}
          style={{
            width: `${PIXEL_SCALE * 48}px`,
            height: `${PIXEL_SCALE * 35}px`,
          }}
        />

        {cooking ? (
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
            "opacity-100": !cooking,
            "opacity-80": cooking,
          })}
          style={{
            width: `${PIXEL_SCALE * 24}px`,
            height: `${PIXEL_SCALE * 32}px`,
            right: `${PIXEL_SCALE * 12}px`,
            top: `${season === "summer" ? PIXEL_SCALE * 2 : PIXEL_SCALE * 0}px`,
          }}
        />

        {cooking && (
          <img
            src={ITEM_DETAILS[cooking.name].image}
            className="absolute pointer-events-none z-30"
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
        <ReadyRecipes readyRecipes={readyRecipes} leftOffset={10} />
      </BuildingImageWrapper>

      <SmoothieShackModal
        queue={queuedRecipes ?? []}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCook={handleCook}
        cooking={cooking}
        itemInProgress={cooking?.name}
        buildingId={buildingId}
        readyRecipes={readyRecipes}
      />
    </>
  );
};
