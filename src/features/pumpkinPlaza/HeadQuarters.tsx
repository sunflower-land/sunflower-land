import React, { useContext, useLayoutEffect } from "react";
import { useActor } from "@xstate/react";

import background from "assets/land/hq.png";

import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { IslandTravel } from "features/game/expansion/components/travel/IslandTravel";
import { Hud } from "features/island/hud/Hud";

import { upcomingParty } from "./lib/streaming";
import { hasFeatureAccess } from "lib/flags";

import { ALLOWED_HQ_AREA } from "./lib/restrictedArea";
import { Room } from "./Room";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";

export const HQ_ROOM_ID = "headquarters";

export const HeadQuarters: React.FC = () => {
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
          width: `${240 * PIXEL_SCALE}px`,
          height: `${276 * PIXEL_SCALE}px`,
        }}
      >
        <img src={background} className="absolute inset-0 w-full h-full" />
      </div>
      <Hud isFarming={false} />
      <Room
        canAccess={isPartyActive}
        allowedArea={ALLOWED_HQ_AREA}
        roomId={HQ_ROOM_ID}
        spawnPoint={{
          x: 1830,
          y: 1480,
        }}
      />
      <div
        id={Section.BeachParty}
        className="absolute"
        style={{
          left: 1830,
          top: 1480,
        }}
      />
      <IslandTravel
        gameState={gameState.context.state}
        bumpkin={gameState.context.state.bumpkin}
        x={1.5}
        y={-7.5}
        onTravelDialogOpened={() => gameService.send("SAVE")}
        travelAllowed={!autosaving}
      />
    </>
  );
};
