import React, { useContext, useEffect, useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingProps } from "../Building";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { LetterBox } from "features/farming/mail/LetterBox";
import { SUNNYSIDE } from "assets/sunnyside";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { useNavigate } from "react-router";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { MANOR_VARIANTS } from "features/island/lib/alternateArt";
import { useVisiting } from "lib/utils/visitUtils";
import { MachineState } from "features/game/lib/gameMachine";
import { getHelpRequired } from "features/game/types/monuments";
import { HomeBumpkins } from "../house/HomeBumpkins";

const _game = (state: MachineState) => state.context.state;
const _farmId = (state: MachineState) => state.context.farmId;
export const Manor: React.FC<BuildingProps> = ({ isBuilt, season }) => {
  const { gameService, showAnimations } = useContext(Context);
  const game = useSelector(gameService, _game);
  const farmId = useSelector(gameService, _farmId);
  const { isVisiting } = useVisiting();

  const navigate = useNavigate();

  const [showHeart, setShowHeart] = useState(false);

  const handleClick = () => {
    if (isBuilt) {
      if (isVisiting) {
        navigate(`/visit/${farmId}/home`);
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

  const helpRequired = getHelpRequired({ game });
  const homeHelpRequired = helpRequired.tasks.home.count;

  return (
    <div className="absolute h-full w-full">
      <BuildingImageWrapper name="Town Center" onClick={handleClick}>
        <img
          src={MANOR_VARIANTS["Desert Biome"][season]}
          className="absolute pointer-events-none"
          id={Section.Home}
          style={{
            width: `${PIXEL_SCALE * 78}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
        />
        {isVisiting && homeHelpRequired > 0 && (
          <div className="pointer-events-auto cursor-pointer">
            <div
              className="relative mr-2"
              style={{
                width: `${PIXEL_SCALE * 20}px`,
                top: `${PIXEL_SCALE * -8}px`,
                right: 0,
              }}
            >
              <img className="w-full" src={SUNNYSIDE.icons.disc} />
              <img
                className="absolute"
                src={SUNNYSIDE.icons.drag}
                style={{
                  width: `${PIXEL_SCALE * 14}px`,
                  right: `${PIXEL_SCALE * 3}px`,
                  top: `${PIXEL_SCALE * 2}px`,
                  zIndex: 1000,
                }}
              />
            </div>
          </div>
        )}
      </BuildingImageWrapper>

      <div
        className="relative w-full pointer-events-auto"
        style={{
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 0}px`,
          height: `${PIXEL_SCALE * 32}px`,
        }}
      >
        <HomeBumpkins game={game} />
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
