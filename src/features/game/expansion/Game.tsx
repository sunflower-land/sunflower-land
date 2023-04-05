import React, { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { useSelector } from "@xstate/react";

import { useInterval } from "lib/utils/hooks/useInterval";
import * as AuthProvider from "features/auth/lib/Provider";

import { Loading } from "features/auth/components";
import { ErrorCode } from "lib/errors";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { screenTracker } from "lib/utils/screen";
import { Refreshing } from "features/auth/components/Refreshing";
import { AddingSFL } from "features/auth/components/AddingSFL";
import { Context } from "../GameProvider";
import { INITIAL_SESSION } from "../lib/gameMachine";
import { ToastManager } from "../toast/ToastManager";
import { Panel } from "components/ui/Panel";
import { Success } from "../components/Success";
import { Syncing } from "../components/Syncing";

import { Notifications } from "../components/Notifications";
import { Hoarding } from "../components/Hoarding";
import { NoBumpkin } from "features/island/bumpkin/NoBumpkin";
import { Swarming } from "../components/Swarming";
import { Cooldown } from "../components/Cooldown";
// import { Rules } from "../components/Rules";
import { Land } from "./Land";
import { Helios } from "features/helios/Helios";
import { VisitingHud } from "features/island/hud/VisitingHud";
import { VisitLandExpansionForm } from "./components/VisitLandExpansionForm";

import land from "assets/land/islands/island.webp";
import { TreasureIsland } from "features/treasureIsland/TreasureIsland";
import { getBumpkinLevel } from "../lib/level";
import { SnowKingdom } from "features/snowKingdom/SnowKingdom";
import { IslandNotFound } from "./components/IslandNotFound";
import { Studios } from "features/studios/Studios";
import { Rules } from "../components/Rules";
import { PumpkinPlaza } from "features/pumpkinPlaza/PumpkinPlaza";
import { BeachParty } from "features/pumpkinPlaza/BeachParty";
import { HeadQuarters } from "features/pumpkinPlaza/HeadQuarters";
import { StoneHaven } from "features/pumpkinPlaza/StoneHaven";
import { BunnyTrove } from "features/bunnyTrove/BunnyTrove";
import { hasFeatureAccess } from "lib/flags";

export const AUTO_SAVE_INTERVAL = 1000 * 30; // autosave every 30 seconds

export const Game: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);
  const actions = useSelector(gameService, (state) => state.context.actions);
  const sessionId = useSelector(
    gameService,
    (state) => state.context.sessionId
  );
  const errorCode = useSelector(
    gameService,
    (state) => state.context.errorCode
  );
  const bumpkinExperience = useSelector(
    gameService,
    (state) => state.context.state.bumpkin?.experience ?? 0
  );
  // Used in hasFeatureAccess() to guard feature flagged content
  const inventory = useSelector(
    gameService,
    (state) => state.context.state.inventory
  );

  const state = useSelector(gameService, (state) => ({
    isLoading: state.matches("loading"),
    isLoadLandToVisit: state.matches("loadLandToVisit"),
    isLandToVisitNotFound: state.matches("landToVisitNotFound"),
    isVisiting: state.matches("visiting"),
    isRefreshing: state.matches("refreshing"),
    isBuyingSFL: state.matches("buyingSFL"),
    isDeposited: state.matches("deposited"),
    isError: state.matches("error"),
    isSynced: state.matches("synced"),
    isSyncing: state.matches("syncing"),
    isHoarding: state.matches("hoarding"),
    isSwarming: state.matches("swarming"),
    isNoBumpkinFound: state.matches("noBumpkinFound"),
    isCoolingDown: state.matches("coolingDown"),
    isGameRules: state.matches("gameRules"),
    isDepositing: state.matches("depositing"),
  }));

  useInterval(() => gameService.send("SAVE"), AUTO_SAVE_INTERVAL);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (actions.length === 0) return;

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [actions]);

  useEffect(() => {
    const save = () => {
      gameService.send("SAVE");
    };

    window.addEventListener("blur", save);

    screenTracker.start(authService);

    return () => {
      window.removeEventListener("blur", save);
      screenTracker.pause();
    };
  }, []);

  const loadingSession = state.isLoading && sessionId === INITIAL_SESSION;

  if (loadingSession || state.isLoadLandToVisit) {
    return (
      <div className="h-screen w-full fixed top-0" style={{ zIndex: 1050 }}>
        <Modal show centered backdrop={false}>
          <Panel>
            <Loading />
          </Panel>
        </Modal>
      </div>
    );
  }

  const GameContent = () => {
    if (state.isLandToVisitNotFound) {
      return (
        <>
          <div className="absolute z-20">
            <VisitingHud />
          </div>
          <div className="relative">
            <Modal centered show backdrop={false}>
              <Panel
                bumpkinParts={{
                  body: "Beige Farmer Potion",
                  hair: "Rancher Hair",
                  pants: "Farmer Overalls",
                  shirt: "Red Farmer Shirt",
                  tool: "Farmer Pitchfork",
                  background: "Farm Background",
                  shoes: "Black Farmer Boots",
                }}
              >
                <div className="flex flex-col items-center">
                  <h2 className="text-center">Island Not Found!</h2>
                  <img src={land} className="h-9 my-3" />
                </div>
                <VisitLandExpansionForm />
              </Panel>
            </Modal>
          </div>
        </>
      );
    }

    if (state.isVisiting) {
      return (
        <>
          <div className="absolute z-10 w-full h-full">
            <Routes>
              <Route path="/:id" element={<Land />} />
            </Routes>
          </div>
          <div className="absolute z-20">
            <VisitingHud />
          </div>
        </>
      );
    }

    const level = getBumpkinLevel(bumpkinExperience);

    return (
      <>
        <div className="absolute w-full h-full z-10">
          <Routes>
            <Route path="/" element={<Land />} />
            <Route path="/helios" element={<Helios key="helios" />} />

            <Route path="/plaza" element={<PumpkinPlaza key="plaza" />} />
            <Route path="/beach" element={<BeachParty key="beach-party" />} />
            <Route
              path="/headquarters"
              element={<HeadQuarters key="headquarters" />}
            />
            {level >= 10 && (
              <Route
                path="/treasure-island"
                element={<TreasureIsland key="treasure" />}
              />
            )}

            {level >= 20 && (
              <Route
                path="/stone-haven"
                element={<StoneHaven key="stone-haven" />}
              />
            )}
            {level >= 50 && (
              <Route path="/snow" element={<SnowKingdom key="snow" />} />
            )}
            <Route path="/studios" element={<Studios key="hq" />} />

            {hasFeatureAccess(inventory, "EASTER_EVENT") && (
              <Route path="/bunny-trove" element={<BunnyTrove key="bunny" />} />
            )}

            <Route path="*" element={<IslandNotFound />} />
          </Routes>
        </div>
      </>
    );
  };

  const GameModal = () => {
    let showModal = true;
    let ModalContent = <></>;

    switch (true) {
      case state.isBuyingSFL:
        ModalContent = <AddingSFL />;
        break;
      case state.isCoolingDown:
        ModalContent = <Cooldown />;
        break;
      case state.isDeposited:
        ModalContent = <Notifications />;
        break;
      case state.isDepositing:
        ModalContent = <Loading text="Depositing" />;
        break;
      case state.isError:
        ModalContent = <ErrorMessage errorCode={errorCode as ErrorCode} />;
        break;
      case state.isGameRules:
        ModalContent = <Rules />;
        break;
      case state.isHoarding:
        ModalContent = <Hoarding />;
        break;
      case state.isLoading:
        ModalContent = <Loading />;
        break;
      case state.isNoBumpkinFound:
        ModalContent = <NoBumpkin />;
        break;
      case state.isRefreshing:
        ModalContent = <Refreshing />;
        break;
      case state.isSwarming:
        ModalContent = <Swarming />;
        break;
      case state.isSynced:
        ModalContent = <Success />;
        break;
      case state.isSyncing:
        ModalContent = <Syncing />;
        break;
      default:
        showModal = false;
    }

    return showModal ? (
      <Modal show centered>
        <Panel>{ModalContent}</Panel>
      </Modal>
    ) : (
      <></>
    );
  };

  return (
    <>
      <ToastManager isHoarding={state.isHoarding} />
      {GameModal()}
      {GameContent()}
    </>
  );
};
