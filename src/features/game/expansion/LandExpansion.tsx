import React, { useRef, useEffect, useContext } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import * as Auth from "features/auth/lib/Provider";

import ocean from "assets/decorations/ocean.webp";

import { ToastProvider } from "../toast/ToastQueueProvider";
import mapMovement from "../lib/mapMovement";
import { useParams } from "react-router-dom";
import { useSelector } from "@xstate/react";
import { GameProvider } from "../GameProvider";
import { Game } from "./Game";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "../lib/constants";
import { ModalProvider } from "../components/modal/ModalProvider";
import { usePinch } from "@use-gesture/react";
import { animated, useSpringValue } from "@react-spring/web";

export const LandExpansion: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const isVisitingContributor = useSelector(authService, (state) =>
    state.matches({ connected: "visitingContributor" })
  );

  // catching and passing scroll container to keyboard listeners
  const container = useRef(null);
  const { id } = useParams();

  useEffect(() => {
    // Our authMachine currently sits outside of our navigation. So if a the machine was in the visitingContributor
    // state and the player loaded this route which can happen using the browser back button then fire
    // the RETURN event to move the authMachine out of the invalid state.
    if (isVisitingContributor) {
      authService.send("RETURN");
    }
  }, []);

  useEffect(() => {
    mapMovement.addListeners(container.current);
    return () => {
      mapMovement.removeListeners();
    };
  }, [container]);

  const board = useRef<HTMLDivElement>(null);

  const scale = useSpringValue(1);

  usePinch(
    ({ movement: [s] }) => {
      const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );
      const vh = Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0
      );

      console.log({ vw, vh });

      const maxWidthScale = (vw / (84 * GRID_WIDTH_PX)) * 2;
      const maxHeightScale = (vh / (56 * GRID_WIDTH_PX)) * 2;

      console.log(maxWidthScale, maxHeightScale);

      let newScale = scale.get() + 1 - s;

      if (newScale < 0.5) newScale = Math.max(maxWidthScale, maxHeightScale);
      if (newScale > 1) newScale = 1;

      scale.start(newScale);
    },
    { target: board }
  );

  // Load data
  return (
    <GameProvider key={id}>
      <ModalProvider>
        <ToastProvider>
          <ScrollContainer
            className="overflow-scroll relative w-full h-full page-scroll-container"
            innerRef={container}
            ignoreElements={"*[data-prevent-drag-scroll]"}
          >
            <animated.div
              ref={board}
              className="absolute"
              style={{
                width: `${84 * GRID_WIDTH_PX}px`,
                height: `${56 * GRID_WIDTH_PX}px`,
                overflow: "hidden",
              }}
            >
              <animated.div
                className="absolute bg-repeat"
                style={{
                  transform: scale.to((s) => `scale(${s})`),
                  backgroundImage: `url(${ocean})`,
                  backgroundSize: `${64 * PIXEL_SCALE}px`,
                  imageRendering: "pixelated",
                  marginTop: `-${(56 * GRID_WIDTH_PX * 2) / 4}px`,
                  marginLeft: `-${(84 * GRID_WIDTH_PX * 2) / 4}px`,
                  width: `${84 * GRID_WIDTH_PX * 2}px`,
                  height: `${56 * GRID_WIDTH_PX * 2}px`,
                }}
              />
              <animated.div
                className="absolute"
                style={{
                  transform: scale.to((s) => `scale(${s})`),
                  // TODO - keep same as World width
                  width: `${84 * GRID_WIDTH_PX}px`,
                  height: `${56 * GRID_WIDTH_PX}px`,
                }}
                // TODO dynamic game board size based on tile dimensions
              >
                <Game />
              </animated.div>
            </animated.div>
          </ScrollContainer>
        </ToastProvider>
      </ModalProvider>
    </GameProvider>
  );
};
