import React from "react";

import bannerSpring from "assets/decorations/banners/winds-of-change_spring.webp";
import bannerSummer from "assets/decorations/banners/winds-of-change_summer.webp";
import bannerAutumn from "assets/decorations/banners/winds-of-change_autumn.webp";
import bannerWinter from "assets/decorations/banners/winds-of-change_winter.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { useGame } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { TemperateSeasonName } from "features/game/types/game";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

const _currentSeason = (state: MachineState) =>
  state.context.state.season.season;

const Banners: Record<TemperateSeasonName, string> = {
  spring: bannerSpring,
  summer: bannerSummer,
  autumn: bannerAutumn,
  winter: bannerWinter,
};

export const WindsOfChangeBanner: React.FC = () => {
  const { gameService } = useGame();
  const currentSeason = useSelector(gameService, _currentSeason);

  return (
    <SFTDetailPopover name="Winds Of Change Banner">
      <div
        className="absolute pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          top: `${PIXEL_SCALE * -1}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
      >
        <img
          src={Banners[currentSeason]}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
          }}
          alt="Winds of Change Banner"
        />
      </div>
    </SFTDetailPopover>
  );
};
