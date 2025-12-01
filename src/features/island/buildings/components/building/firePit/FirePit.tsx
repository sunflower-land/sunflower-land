import React, { useContext, useState } from "react";

import classNames from "classnames";
import { FirePitModal } from "./FirePitModal";
import { CookableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { setImageWidth } from "lib/images";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { gameAnalytics } from "lib/gameAnalytics";

import { SUNNYSIDE } from "assets/sunnyside";
import { FIRE_PIT_VARIANTS } from "features/island/lib/alternateArt";
import shadow from "assets/npcs/shadow.png";
import { MachineState } from "features/game/lib/gameMachine";
import Decimal from "decimal.js-light";
import { useSound } from "lib/utils/hooks/useSound";
import { ReadyRecipes } from "../ReadyRecipes";
import { useCookingState } from "features/island/buildings/lib/useCookingState";
import { GameState, TemperateSeasonName } from "features/game/types/game";
import { getCurrentBiome } from "features/island/biomes/biomes";

type Props = {
  buildingId: string;
  isBuilt: boolean;
  island: GameState["island"];
  season: TemperateSeasonName;
};

const _mashedPotatoCooked = (state: MachineState) =>
  state.context.state.farmActivity["Mashed Potato Cooked"] ?? 0;
const _experience = (state: MachineState) =>
  state.context.state.bumpkin?.experience;
const _potatoCount = (state: MachineState) =>
  state.context.state.inventory.Potato ?? new Decimal(0);
const _season = (state: MachineState) => state.context.state.season.season;
const _firePit = (id: string) => (state: MachineState) =>
  state.context.state.buildings["Fire Pit"]?.find((b) => b.id === id);

export const FirePit: React.FC<Props> = ({ buildingId, isBuilt, island }) => {
  const { gameService } = useContext(Context);
  const [showModal, setShowModal] = useState(false);

  const mashedPotatoCooked = useSelector(gameService, _mashedPotatoCooked);
  const experience = useSelector(gameService, _experience);
  const potatoCount = useSelector(gameService, _potatoCount);
  const season = useSelector(gameService, _season);
  const firePit = useSelector(gameService, _firePit(buildingId));

  const { cooking, queuedRecipes, readyRecipes } = useCookingState(
    firePit ?? {},
  );

  const { play: bakeryAudio } = useSound("bakery");

  const handleCook = (item: CookableName) => {
    gameService?.send({
      type: "recipe.cooked",
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
    gameService?.send({
      type: "recipes.collected",
      building: "Fire Pit",
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

  const showHelper = potatoCount.gte(8) && experience === 0 && !cooking;

  return (
    <>
      <BuildingImageWrapper
        name="Fire Pit"
        onClick={handleClick}
        ready={readyRecipes?.length > 0}
      >
        <img
          src={FIRE_PIT_VARIANTS[getCurrentBiome(island)][season]}
          className={classNames("absolute bottom-0 pointer-events-none", {
            "opacity-100": !cooking,
            "opacity-80": cooking,
          })}
          style={{
            width: `${PIXEL_SCALE * 47}px`,
            height: `${PIXEL_SCALE * 33}px`,
          }}
        />
        {cooking && (
          <img
            src={ITEM_DETAILS[cooking.name].image}
            className={classNames("absolute z-30 pointer-events-none")}
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
        <ReadyRecipes readyRecipes={readyRecipes} leftOffset={10} />
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

        {cooking ? (
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
