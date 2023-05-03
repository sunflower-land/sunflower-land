import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
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
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { ITEM_DETAILS } from "features/game/types/images";
import { characters } from "./lib/characters";
import { WeeklyLanternCount } from "./components/WeeklyLanternCount";
import { PlayerBumpkin } from "./components/PlayerBumpkin";

import background from "assets/land/dawn_breaker.webp";
import { Characters } from "./components/Characters";
import { Modal } from "react-bootstrap";
import {
  hasVisitedDawnbreakerIsland,
  setDawnbreakerIslandVisited,
} from "./lib/dawnbreaker";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

import hootImg from "assets/npcs/hoot.png";

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
  const [showIntroModal, setShowIntroModal] = useState(false);

  const { availableLantern, lanternsCraftedByWeek, currentWeek } = dawnBreaker;

  useLayoutEffect(() => {
    // Start with island centered
    scrollIntoView(Section.DawnBreakerBackGround, "auto");
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (!hasVisitedDawnbreakerIsland()) {
        setShowIntroModal(true);
      }
    }, 2500);
  }, []);

  const handleIntroModalClose = () => {
    setShowIntroModal(false);
    setDawnbreakerIslandVisited();
  };

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
          lanternsCraftedByWeek={lanternsCraftedByWeek}
          availableLantern={availableLantern}
          inventory={inventory}
        />
        <Characters currentWeek={currentWeek} />
        {showMintedLanterns &&
          [...Array(craftedLanternCount).keys()].slice(0, 5).map((_, index) => {
            const { name } = availableLantern;
            const { lanterns } = characters[currentWeek];

            return (
              <MapPlacement
                key={index}
                x={lanterns[index].x}
                y={lanterns[index].y}
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
          onLoaded={() => setWeeklyStatsLoaded(true)}
        />
      )}
      <Modal show={showIntroModal} onHide={handleIntroModalClose} centered>
        <CloseButtonPanel
          title="Dawn Breaker Island is in Danger!"
          onClose={handleIntroModalClose}
        >
          <div className="p-2 pt-0 flex flex-col items-center">
            <img
              src={hootImg}
              alt="Hoot"
              className="mb-2"
              style={{ width: `${PIXEL_SCALE * 16}px` }}
            />
            <p className="mb-2">
              This remote island, once a beacon of hope and safety for the
              surrounding isles, has fallen into darkness.
            </p>
            <p className="mb-2">
              The family that lives on the island, responsible for ringing the
              bell that warns of danger, is now scared and alone. Without their
              warning bell, all hope for safety is lost in Sunflower Land.
            </p>
            <p className="mb-2">
              Can you uncover the secrets of the island and bring peace back to
              their lives?
            </p>
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
