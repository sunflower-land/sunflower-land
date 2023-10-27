import React, { useContext, useLayoutEffect } from "react";
import { useActor } from "@xstate/react";

import background from "assets/land/beach_party.png";

import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { IslandTravel } from "features/game/expansion/components/travel/IslandTravel";
import { Hud } from "features/island/hud/Hud";

import { upcomingParty } from "./lib/streaming";

import { ALLOWED_BEACH_AREA } from "./lib/restrictedArea";
import { Room } from "./Room";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";

export const BEACH_ROOM_ID = "beach";

export const BeachParty: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [scrollIntoView] = useScrollIntoView();

  const autosaving = gameState.matches("autosaving");

  useLayoutEffect(() => {
    // Start with island centered
    scrollIntoView(Section.BeachParty, "auto");
  }, []);

  const party = upcomingParty();
  const isBetaTester = false;
  const isPartyActive =
    isBetaTester || (Date.now() > party.startAt && Date.now() < party.endAt);

  return (
    <>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: `${270 * PIXEL_SCALE}px`,
          height: `${216 * PIXEL_SCALE}px`,
        }}
      >
        <img src={background} className="absolute inset-0 w-full h-full" />
      </div>
      <Hud isFarming={false} />
      <Room
        canAccess={isPartyActive}
        allowedArea={ALLOWED_BEACH_AREA}
        roomId={BEACH_ROOM_ID}
        spawnPoint={{
          x: 1750,
          y: 1400,
        }}
      />
      <div
        id={Section.BeachParty}
        className="absolute"
        style={{
          left: 1750,
          top: 1400,
        }}
      />
      {/*<Leprechaun x={40.5} y={21.3} />*/}

      <IslandTravel
        inventory={gameState.context.state.inventory}
        bumpkin={gameState.context.state.bumpkin}
        x={0.5}
        y={-5.5}
        onTravelDialogOpened={() => gameService.send("SAVE")}
        travelAllowed={!autosaving}
      />
    </>
  );
};
