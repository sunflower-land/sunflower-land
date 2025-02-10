import React, { useContext, useState } from "react";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import { CookableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { KitchenModal } from "./KitchenModal";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { setImageWidth } from "lib/images";
import { KITCHEN_VARIANTS } from "features/island/lib/alternateArt";
import shadow from "assets/npcs/shadow.png";
import { useSound } from "lib/utils/hooks/useSound";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useCookingState } from "features/island/buildings/lib/useCookingState";
import { useSelector } from "@xstate/react";
import { IslandType, TemperateSeasonName } from "features/game/types/game";
import { ReadyRecipes } from "../ReadyRecipes";

type Props = {
  buildingId: string;
  isBuilt: boolean;
  island: IslandType;
  season: TemperateSeasonName;
};

const _kitchen = (id: string) => (state: MachineState) =>
  state.context.state.buildings["Kitchen"]?.find((b) => b.id === id);

export const Kitchen: React.FC<Props> = ({
  buildingId,
  isBuilt,
  season,
  island,
}) => {
  const { gameService } = useContext(Context);
  const [showModal, setShowModal] = useState(false);

  const kitchen = useSelector(gameService, _kitchen(buildingId));
  const { cooking, queuedRecipes, readyRecipes } = useCookingState(
    kitchen ?? {},
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
      building: "Kitchen",
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
        name="Kitchen"
        onClick={handleClick}
        ready={readyRecipes.length > 0}
      >
        <img
          src={KITCHEN_VARIANTS[island][season]}
          className={classNames("absolute pointer-events-none bottom-0", {
            "opacity-100": !cooking,
            "opacity-80": cooking,
          })}
          style={{
            width: `${PIXEL_SCALE * 63}px`,
            height: `${PIXEL_SCALE * 50}px`,
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
        {cooking ? (
          <img
            src={SUNNYSIDE.npcs.chef_doing}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 16}px`,
              bottom: `${PIXEL_SCALE * 7}px`,
              right: `${PIXEL_SCALE * 14}px`,
            }}
          />
        ) : (
          <img
            src={SUNNYSIDE.npcs.chef}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 15}px`,
              bottom: `${PIXEL_SCALE * 8}px`,
              right: `${PIXEL_SCALE * 14}px`,
            }}
          />
        )}
        <ReadyRecipes readyRecipes={readyRecipes} leftOffset={90} />
      </BuildingImageWrapper>

      <KitchenModal
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
