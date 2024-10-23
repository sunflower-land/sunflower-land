import React, { useContext, useEffect, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingProps } from "../Building";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { LetterBox } from "features/farming/mail/LetterBox";
import { SUNNYSIDE } from "assets/sunnyside";
import { Bumpkin } from "features/game/types/game";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { DailyReward } from "features/game/expansion/components/dailyReward/DailyReward";
import { useNavigate } from "react-router-dom";
import { HomeBumpkins } from "../house/HomeBumpkins";

export const TownCenter: React.FC<BuildingProps> = ({ isBuilt, onRemove }) => {
  const { gameService, showAnimations } = useContext(Context);
  const [gameState] = useActor(gameService);

  const navigate = useNavigate();

  const [showHeart, setShowHeart] = useState(false);

  const handleClick = () => {
    if (onRemove) {
      onRemove();
      return;
    }

    if (isBuilt) {
      navigate("/home");
      // Add future on click actions here
      return;
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    gameService.onEvent((event) => {
      if (event.type === "recipe.collected") {
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
          src={SUNNYSIDE.building.townCenter}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 62}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
        />
      </BuildingImageWrapper>
      <div
        className="absolute"
        style={{ left: `${PIXEL_SCALE * 16}px`, top: `${PIXEL_SCALE * 14}px` }}
      >
        <DailyReward />
      </div>
      <div
        className="absolute w-full"
        style={{
          top: `${PIXEL_SCALE * 16}px`,
          left: `${PIXEL_SCALE * 4}px`,
          height: `${PIXEL_SCALE * 32}px`,
        }}
      >
        {bumpkin && <HomeBumpkins game={gameState.context.state} />}
      </div>

      <div
        className="absolute"
        style={{
          top: 0,
          left: `${PIXEL_SCALE * 4}px`,
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
