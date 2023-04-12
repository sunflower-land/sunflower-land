import React, { useRef, useEffect, useContext } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import * as Auth from "features/auth/lib/Provider";

import ocean from "assets/decorations/ocean.webp";

import mapMovement from "../lib/mapMovement";
import { useParams } from "react-router-dom";
import { useSelector } from "@xstate/react";
import { GameProvider } from "../GameProvider";
import { Game } from "./Game";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "../lib/constants";
import { ModalProvider } from "../components/modal/ModalProvider";

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

  // Load data
  return (
    <GameProvider key={id}>
      <ModalProvider>
        <ScrollContainer
          className="bg-blue-300 overflow-scroll relative w-full h-full page-scroll-container"
          innerRef={container}
          ignoreElements={"*[data-prevent-drag-scroll]"}
        >
          <div
            className="relative"
            style={{
              // TODO - keep same as World width
              width: `${84 * GRID_WIDTH_PX}px`,
              height: `${56 * GRID_WIDTH_PX}px`,
            }}
            // TODO dynamic game board size based on tile dimensions
          >
            <div
              className="absolute inset-0 bg-repeat w-full h-full"
              style={{
                backgroundImage: `url(${ocean})`,
                backgroundSize: `${64 * PIXEL_SCALE}px`,
                imageRendering: "pixelated",
              }}
            />
            <Game />
          </div>
        </ScrollContainer>
      </ModalProvider>
    </GameProvider>
  );
};
