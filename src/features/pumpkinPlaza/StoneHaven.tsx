import React, { useContext, useLayoutEffect } from "react";
import { useActor } from "@xstate/react";

import background from "assets/land/stone_haven.webp";

import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { IslandTravel } from "features/game/expansion/components/travel/IslandTravel";
import { Hud } from "features/island/hud/Hud";

import { upcomingParty } from "./lib/streaming";
import { hasFeatureAccess } from "lib/flags";

import { ALLOWED_STONE_HAVEN_AREA } from "./lib/restrictedArea";
import { Room } from "./Room";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";

export const STONE_HAVEN_ROOM_ID = "stoneHaven";

export const StoneHaven: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [scrollIntoView] = useScrollIntoView();

  const autosaving = gameState.matches("autosaving");

  useLayoutEffect(() => {
    // Start with island centered
    scrollIntoView(Section.BeachParty, "auto");
  }, []);

  const party = upcomingParty();
  const isBetaTester = hasFeatureAccess(
    gameState.context.state,
    "PUMPKIN_PLAZA"
  );
  const isPartyActive =
    isBetaTester || (Date.now() > party.startAt && Date.now() < party.endAt);

  return (
    <>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: `${315 * PIXEL_SCALE}px`,
          height: `${423 * PIXEL_SCALE}px`,
        }}
      >
        <img src={background} className="absolute inset-0 w-full h-full" />
      </div>
      <Hud isFarming={false} />
      <Room
        canAccess={isPartyActive}
        allowedArea={ALLOWED_STONE_HAVEN_AREA}
        roomId={STONE_HAVEN_ROOM_ID}
        spawnPoint={{
          x: 1750,
          y: 1680,
        }}
      />
      <div
        id={Section.BeachParty}
        className="absolute"
        style={{
          left: 1750,
          top: 1680,
        }}
      />
      <IslandTravel
        gameState={gameState.context.state}
        bumpkin={gameState.context.state.bumpkin}
        x={1.5}
        y={-12.5}
        onTravelDialogOpened={() => gameService.send("SAVE")}
        travelAllowed={!autosaving}
      />
    </>
  );
};
