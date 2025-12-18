import React, { useContext, useEffect, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingProps } from "../Building";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { LetterBox } from "features/farming/mail/LetterBox";
import { SUNNYSIDE } from "assets/sunnyside";
import { Bumpkin } from "features/game/types/game";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { useNavigate } from "react-router";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { HomeBumpkins } from "./HomeBumpkins";
import { MANOR_VARIANTS } from "features/island/lib/alternateArt";
import { useVisiting } from "lib/utils/visitUtils";

export const House: React.FC<BuildingProps> = ({ isBuilt, season }) => {
  const { gameService, showAnimations } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { isVisiting } = useVisiting();

  const [showHeart, setShowHeart] = useState(false);

  const navigate = useNavigate();

  const handleClick = () => {
    if (isBuilt) {
      if (isVisiting) {
        navigate(`/visit/${gameState.context.farmId}/home`);
      } else {
        navigate("/home");
      }
      return;
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    gameService.onEvent((event) => {
      if (event.type === "recipes.collected") {
        setShowHeart(true);
        timeout = setTimeout(() => setShowHeart(false), 3000);
      }
    });

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  const bumpkin = gameState.context.state.bumpkin as Bumpkin;

  return (
    <div className="absolute h-full w-full">
      <BuildingImageWrapper name="Town Center" onClick={handleClick}>
        <img
          src={MANOR_VARIANTS["Spring Biome"][season]}
          className="absolute pointer-events-none"
          id={Section.Home}
          style={{
            width: `${PIXEL_SCALE * 62}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
        />
      </BuildingImageWrapper>

      <div
        className="absolute w-full"
        style={{
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
          height: `${PIXEL_SCALE * 32}px`,
        }}
      >
        {bumpkin && <HomeBumpkins game={gameState.context.state} />}
      </div>

      <div
        className="absolute"
        style={{
          bottom: `${PIXEL_SCALE * 20}px`,
          right: `${PIXEL_SCALE * 14}px`,
        }}
      >
        <LetterBox />
      </div>

      <img
        src={SUNNYSIDE.icons.heart}
        className={
          "absolute transition-opacity pointer-events-none" +
          (showAnimations ? " animate-float" : "")
        }
        style={{
          width: `${PIXEL_SCALE * 10}px`,
          top: `${PIXEL_SCALE * 10}px`,
          left: `${PIXEL_SCALE * 8}px`,
          opacity: showHeart ? 1 : 0,
        }}
      />
    </div>
  );
};
