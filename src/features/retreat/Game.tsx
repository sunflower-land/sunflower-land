import React, { useContext, useLayoutEffect, useRef, useState } from "react";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import ScrollContainer from "react-indiana-drag-scroll";
import ocean from "assets/decorations/ocean.webp";
import background from "assets/land/retreat.webp";
import { ToastProvider } from "features/game/toast/ToastQueueProvider";
import { RetreatBank } from "./components/bank/RetreatBank";
import { RetreatStorageHouse } from "./components/storageHouse/RetreatStorageHouse";
import { RetreatHotAirBalloon } from "./components/hotAirBalloon/RetreatHotAirBalloon";
import { RetreatTailor } from "./components/tailor/RetreatTailor";
import { RetreatBlacksmith } from "./components/blacksmith/RetreatBlacksmith";
import { Auctioneer } from "./components/auctioneer/Auctioneer";
import { Resale } from "./components/resale/Resale";
import { RetreatWishingWell } from "./components/wishingWell/RetreatWishingWell";
import { IslandTravelWrapper } from "./components/islandTravel/IslandTravelWrapper";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { Context } from "features/game/GoblinProvider";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Loading } from "features/auth/components";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { ErrorCode } from "lib/errors";

export const Game = () => {
  const container = useRef(null);
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);
  const [scrollIntoView] = useScrollIntoView();
  // Record initial page load
  const [loaded, setLoaded] = useState(false);

  const isLoading = goblinState.matches("loading");
  const isError = goblinState.matches("error");

  useLayoutEffect(() => {
    if (loaded) return;

    if (!isLoading) {
      scrollIntoView(Section.RetreatBackground, "auto");
      setLoaded(true);
    }
  }, [isLoading, loaded]);

  if (isLoading) {
    return (
      <div>
        <div
          className="absolute inset-0 bg-repeat w-full h-full"
          style={{
            backgroundImage: `url(${ocean})`,
            backgroundSize: `${64 * PIXEL_SCALE}px`,
            imageRendering: "pixelated",
          }}
        />
        <div className="h-screen w-full fixed top-0" style={{ zIndex: 1050 }}>
          <Modal show centered backdrop={false}>
            <Panel>
              <Loading />
            </Panel>
          </Modal>
        </div>
      </div>
    );
  }
  return (
    <ToastProvider>
      <ScrollContainer
        className="bg-blue-300 overflow-scroll relative w-full h-full"
        innerRef={container}
      >
        <div className="relative h-retreatGameboard w-retreatGameboard">
          <div
            className="absolute inset-0 bg-repeat w-full h-full"
            style={{
              backgroundImage: `url(${ocean})`,
              backgroundSize: `${64 * PIXEL_SCALE}px`,
              imageRendering: "pixelated",
            }}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: `${40 * GRID_WIDTH_PX}px`,
              height: `${40 * GRID_WIDTH_PX}px`,
            }}
          >
            <img
              src={background}
              className="absolute inset-0 w-full h-full"
              id={Section.RetreatBackground}
            />
            <RetreatBank />
            <RetreatStorageHouse />
            <RetreatHotAirBalloon />
            <RetreatTailor />
            <RetreatBlacksmith />
            <Auctioneer />
            <Resale />
            <RetreatWishingWell />
            <IslandTravelWrapper />

            <Modal show={isError} centered>
              <Panel className="text-shadow">
                <ErrorMessage
                  errorCode={goblinState.context.errorCode as ErrorCode}
                />
              </Panel>
            </Modal>
          </div>
        </div>
      </ScrollContainer>
    </ToastProvider>
  );
};
