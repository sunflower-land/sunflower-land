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
import { Week, characters } from "./lib/characters";
import { WeeklyLanternCount } from "./components/WeeklyLanternCount";
import { PlayerBumpkin } from "./components/PlayerBumpkin";

import background from "assets/land/dawn_breaker_8.webp";
import nextBackground from "assets/land/dawn_breaker_9.png";
import { Characters } from "./components/Characters";
import { Modal } from "react-bootstrap";
import {
  hasVisitedDawnbreakerIsland,
  setDawnbreakerIslandVisited,
} from "./lib/dawnbreaker";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import hootImg from "assets/npcs/hoot.png";
import classNames from "classnames";
import { HootRiddle } from "./components/Hoot";
import { useParams } from "react-router-dom";
import { LeaderboardButton } from "./components/LeaderboardButton";
import { Leaderboards } from "./components/Leaderboards";
import { fetchLeaderboardData } from "./actions/leaderboards";
import { LeaderboardsType } from "./actions/cache";
import { DawnCountdown } from "./components/DawnCountdown";

const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _dawnBreaker = (state: MachineState) =>
  state.context.state.dawnBreaker ?? ({} as DawnBreakerType);
const _inventory = (state: MachineState) => state.context.state.inventory;
const _autosaving = (state: MachineState) => state.matches("autosaving");

const CHALLENGE_WEEKS = 8;

export const DawnBreaker: React.FC = () => {
  const { gameService } = useContext(Context);
  const [scrollIntoView] = useScrollIntoView();
  const { id } = useParams();

  // "0" will be assigned to guest farms
  const farmId = parseInt(id ?? "0", 10);

  const bumpkin = useSelector(gameService, _bumpkin);
  const dawnBreaker = useSelector(gameService, _dawnBreaker);
  const inventory = useSelector(gameService, _inventory);
  const autosaving = useSelector(gameService, _autosaving);

  const [showIntroModal, setShowIntroModal] = useState(false);
  // Each week contains two steps to the story/map. Once 5 lanterns have been crafted by the player
  // they will be shown the second part of the story/map.
  const [showNextStep, setShowNextStep] = useState(false);
  const [showMapTransition, setShowMapTransition] = useState(true);

  const [loadingLeaderboards, setLoadingLeaderboards] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboards, setLeaderboards] = useState<LeaderboardsType>();

  const { availableLantern, lanternsCraftedByWeek, currentWeek } = dawnBreaker;
  const craftedLanternCount = lanternsCraftedByWeek[currentWeek] ?? 0;
  const weeklyChallengeAvailable = currentWeek <= CHALLENGE_WEEKS;
  const showCraftedLanterns = availableLantern && weeklyChallengeAvailable;
  const showWeeklyLanternCount =
    availableLantern && weeklyChallengeAvailable && !loadingLeaderboards;
  const moveHudButtonsUp = weeklyChallengeAvailable && !loadingLeaderboards;

  useLayoutEffect(() => {
    // Start with island centered
    scrollIntoView(Section.DawnBreakerBackGround, "auto");

    if (craftedLanternCount >= 5) {
      setShowMapTransition(false);
      setShowNextStep(true);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (!hasVisitedDawnbreakerIsland()) {
        setShowIntroModal(true);
      }
    }, 2500);
  }, []);

  useEffect(() => {
    if (craftedLanternCount >= 5 && !showNextStep) {
      setShowNextStep(true);
    }
  }, [craftedLanternCount]);

  useEffect(() => {
    const getLeaderboards = async () => {
      try {
        const leaderboards = await fetchLeaderboardData(Number(farmId));

        if (leaderboards) {
          setLeaderboards(leaderboards);
        }
      } catch (error) {
        console.error(error);
      }

      setLoadingLeaderboards(false);
    };

    getLeaderboards();
  }, []);

  const handleIntroModalClose = () => {
    setShowIntroModal(false);
    setDawnbreakerIslandVisited();
  };

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
          src={nextBackground}
          alt="dawnbreaker-island"
          className={classNames("absolute inset-0 w-full h-full", {
            "transition-opacity duration-1000": showMapTransition,
            "opacity-100": showNextStep,
            "opacity-0": !showNextStep,
          })}
          id={Section.DawnBreakerBackGround}
        />
        <img
          src={background}
          alt="dawnbreaker-island"
          className={classNames("absolute inset-0 w-full h-full", {
            "transition-opacity duration-1000": showMapTransition,
            "opacity-100": !showNextStep,
            "opacity-0": showNextStep,
          })}
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
        <Characters
          currentWeek={(showNextStep ? currentWeek + 1 : currentWeek) as Week}
        />
        <HootRiddle />
        {showCraftedLanterns &&
          [...Array(craftedLanternCount).keys()].slice(0, 5).map((_, index) => {
            const { name } = availableLantern;
            const { lanterns: lanternPositions } = characters[currentWeek];

            return (
              <MapPlacement
                key={index}
                x={lanternPositions[index].x}
                y={lanternPositions[index].y}
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
                      width: `${11.1 * PIXEL_SCALE}px`,
                    }}
                  />
                </div>
              </MapPlacement>
            );
          })}
      </div>
      <Hud isFarming={false} moveButtonsUp={moveHudButtonsUp} />
      <LeaderboardButton
        onClick={() => setShowLeaderboard(true)}
        loaded={!loadingLeaderboards}
      />
      {showWeeklyLanternCount && (
        <WeeklyLanternCount
          lanternName={availableLantern.name}
          endAt={new Date(availableLantern.endAt).getTime()}
          totalCrafted={leaderboards?.lanterns?.total ?? 0}
          loaded={!loadingLeaderboards}
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
      <Modal show={showLeaderboard} centered>
        {!loadingLeaderboards && (
          <Leaderboards
            farmId={farmId}
            leaderboards={leaderboards}
            onClose={() => setShowLeaderboard(false)}
          />
        )}
      </Modal>

      <DawnCountdown />
    </>
  );
};
