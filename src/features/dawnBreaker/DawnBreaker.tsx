import React, { useContext, useLayoutEffect, useState } from "react";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { useScrollIntoView, Section } from "lib/utils/hooks/useScrollIntoView";
import { Hud } from "features/island/hud/Hud";
import { IslandTravel } from "features/game/expansion/components/travel/IslandTravel";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import {
  Bumpkin,
  DawnBreaker as DawnBreakerType,
} from "features/game/types/game";
import {
  Coordinates,
  MapPlacement,
} from "features/game/expansion/components/MapPlacement";
import { ITEM_DETAILS } from "features/game/types/images";
import { lanternPositions } from "./lib/positions";
import { WeeklyLanternCount } from "./components/WeeklyLanternCount";
import { PlayerBumpkin } from "./components/PlayerBumpkin";

import background from "assets/land/dawn_breaker.webp";

const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _dawnBreaker = (state: MachineState) =>
  state.context.state.dawnBreaker ?? ({} as DawnBreakerType);
const _inventory = (state: MachineState) => state.context.state.inventory;
const _autosaving = (state: MachineState) => state.matches("autosaving");

const CHALLENGE_WEEKS = 8;

export const DawnBreaker: React.FC = () => {
  const { gameService } = useContext(Context);
  const [scrollIntoView] = useScrollIntoView();

  const bumpkin = useSelector(gameService, _bumpkin);
  const dawnBreaker = useSelector(gameService, _dawnBreaker);
  const inventory = useSelector(gameService, _inventory);
  const autosaving = useSelector(gameService, _autosaving);

  const [weeklyStatsLoaded, setWeeklyStatsLoaded] = useState(false);

  const { availableLantern, lanternsCraftedByWeek, currentWeek } = dawnBreaker;

  useLayoutEffect(() => {
    // Start with island centered
    scrollIntoView(Section.DawnBreakerBackGround, "auto");
  }, []);

  const craftedLanternCount = lanternsCraftedByWeek[currentWeek] ?? 0;
  const weeklyChallengeAvailable = currentWeek <= CHALLENGE_WEEKS;
  const showMintedLanterns = availableLantern && weeklyChallengeAvailable;

  return (
    <>
      <div
        className="blur-to-focus absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: `${40 * GRID_WIDTH_PX}px`,
          height: `${40 * GRID_WIDTH_PX}px`,
        }}
      >
        <img
          src={background}
          className="absolute inset-0 w-full h-full"
          id={Section.DawnBreakerBackGround}
        />
        <IslandTravel
          bumpkin={bumpkin}
          inventory={inventory}
          x={-5}
          y={-16}
          onTravelDialogOpened={() => gameService.send("SAVE")}
          travelAllowed={!autosaving}
        />
        <PlayerBumpkin
          currentWeek={currentWeek}
          bumpkin={bumpkin as Bumpkin}
          availableLantern={availableLantern}
          inventory={inventory}
        />
        {showMintedLanterns &&
          [...Array(craftedLanternCount).keys()].slice(0, 5).map((_, index) => {
            const { name } = availableLantern;
            const positions = lanternPositions[currentWeek] as Coordinates[];

            return (
              <MapPlacement
                key={index}
                x={positions[index].x}
                y={positions[index].y}
                width={1}
              >
                <div
                  className="w-full flex justify-center paper-floating"
                  style={
                    {
                      "--animation-order": index,
                    } as React.CSSProperties
                  }
                >
                  <img
                    src={ITEM_DETAILS[name].image}
                    alt={name}
                    style={{
                      width: `${11 * PIXEL_SCALE}px`,
                    }}
                  />
                </div>
              </MapPlacement>
            );
          })}
      </div>

      <Hud
        isFarming={false}
        moveButtonsUp={weeklyChallengeAvailable && weeklyStatsLoaded}
      />
      {availableLantern && weeklyChallengeAvailable && (
        <WeeklyLanternCount
          lanternName={availableLantern.name}
          endAt={new Date(availableLantern.endAt).getTime()}
          previousMintCount={0}
          weeklyMintGoal={20}
          onLoaded={() => setWeeklyStatsLoaded(true)}
        />
      )}
    </>
  );
};
