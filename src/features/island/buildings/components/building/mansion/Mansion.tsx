import React, { useContext, useEffect, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingProps } from "../Building";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { LetterBox } from "features/farming/mail/LetterBox";
import { SUNNYSIDE } from "assets/sunnyside";
import { Bumpkin } from "features/game/types/game";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { useNavigate } from "react-router";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { HomeBumpkins } from "../house/HomeBumpkins";
import { MANOR_VARIANTS } from "features/island/lib/alternateArt";
import { MachineState } from "features/game/lib/gameMachine";
const _season = (state: MachineState) => state.context.state.season.season;

const _state = (state: MachineState) => {
  return state.context.state;
};

export const Mansion: React.FC<BuildingProps> = ({ isBuilt, island }) => {
  const { gameService, showAnimations } = useContext(Context);
  const state = useSelector(gameService, _state);

  const bumpkin = state.bumpkin as Bumpkin;

  const season = useSelector(gameService, _season);

  const [showHeart, setShowHeart] = useState(false);

  const navigate = useNavigate();

  const handleClick = () => {
    if (isBuilt) {
      navigate("/home");

      // Add future on click actions here
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

  return (
    <div className="absolute h-full w-full">
      <BuildingImageWrapper name="Town Center" onClick={handleClick}>
        <img
          src={MANOR_VARIANTS[island][season]}
          className="absolute pointer-events-none"
          id={Section.Home}
          style={{
            width: `${PIXEL_SCALE * 98}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
        />
      </BuildingImageWrapper>

      <div
        className="absolute w-fit"
        style={{
          bottom: `${PIXEL_SCALE * 28}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
      >
        {bumpkin && <HomeBumpkins game={state} />}
      </div>

      <div
        className="absolute"
        style={{
          bottom: `${PIXEL_SCALE * 20}px`,
          right: `${PIXEL_SCALE * 13}px`,
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
