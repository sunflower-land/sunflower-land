import React, { useContext, useState } from "react";
import classNames from "classnames";

import { SUNNYSIDE } from "assets/sunnyside";
import shadow from "assets/npcs/shadow.png";

import { CookableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { BakeryModal } from "./BakeryModal";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { setImageWidth } from "lib/images";
import { BAKERY_VARIANTS } from "features/island/lib/alternateArt";
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
  onRemove?: () => void;
};

const _bakery = (id: string) => (state: MachineState) =>
  state.context.state.buildings["Bakery"]?.find((b) => b.id === id);

export const Bakery: React.FC<Props> = ({
  buildingId,
  isBuilt,
  season,
  onRemove,
}) => {
  const { gameService } = useContext(Context);

  const bakery = useSelector(gameService, _bakery(buildingId));
  const [showModal, setShowModal] = useState(false);
  const { cooking, queuedRecipes, readyRecipes } = useCookingState(
    bakery ?? {},
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
      building: "Bakery",
      buildingId,
    });
  };

  const handleClick = () => {
    if (onRemove) {
      onRemove();
      return;
    }

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
        name="Bakery"
        onClick={handleClick}
        ready={readyRecipes?.length > 0}
      >
        <img
          src={BAKERY_VARIANTS[season]}
          className={classNames("absolute bottom-0 pointer-events-none", {
            "opacity-100": !cooking,
            "opacity-80": cooking,
          })}
          style={{
            left: `${PIXEL_SCALE * 1}px`,
            width: `${PIXEL_SCALE * 62}px`,
            height: `${PIXEL_SCALE * (season === "spring" ? 59 : 51)}}px`,
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
        {cooking ? (
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
        {cooking && (
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
        <ReadyRecipes readyRecipes={readyRecipes} leftOffset={10} />
      </BuildingImageWrapper>

      <BakeryModal
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
