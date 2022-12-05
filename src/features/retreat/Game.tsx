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
import {
  RETREAT_LEVEL_REQUIREMENT,
  StateValues,
} from "features/game/lib/goblinMachine";
import { Withdrawing } from "features/game/components/Withdrawing";
import { Withdrawn } from "features/game/components/Withdrawn";
import { getBumpkinLevel } from "features/game/lib/level";

const SHOW_MODAL: Partial<Record<StateValues, boolean>> = {
  loading: true,
  minting: false,
  minted: false,
  withdrawing: true,
  withdrawn: true,
  playing: false,
  error: true,
};

export const Game = () => {
  const container = useRef(null);
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);
  const [scrollIntoView] = useScrollIntoView();
  const [retreatLoaded, setRetreatLoaded] = useState(false);

  useLayoutEffect(() => {
    if (retreatLoaded) {
      scrollIntoView(Section.RetreatBackground, "auto");
    }
  }, [retreatLoaded]);

  const { bumpkin } = goblinState.context.state;

  const hasRequiredLevel =
    bumpkin && getBumpkinLevel(bumpkin.experience) >= RETREAT_LEVEL_REQUIREMENT;

  return (
    <>
      <Modal
        show={SHOW_MODAL[goblinState.value as StateValues]}
        centered
        backdrop={retreatLoaded}
      >
        <Panel className="text-shadow">
          {goblinState.matches("error") && (
            <ErrorMessage
              errorCode={goblinState.context.errorCode as ErrorCode}
            />
          )}
          {goblinState.matches("withdrawing") && <Withdrawing />}
          {goblinState.matches("loading") && <Loading />}
          {goblinState.matches("withdrawn") && <Withdrawn />}
        </Panel>
      </Modal>
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
            {hasRequiredLevel && (
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
                  onLoad={() => setRetreatLoaded(true)}
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
              </div>
            )}
          </div>
        </ScrollContainer>
      </ToastProvider>
    </>
  );
};
