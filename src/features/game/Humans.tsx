import React, { useRef, useEffect, useContext } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import * as Auth from "features/auth/lib/Provider";

import background from "assets/land/background.png";

import { Game } from "./Game";
import { GameProvider } from "./GameProvider";
import { ToastProvider } from "./toast/ToastQueueProvider";
import mapMovement from "./lib/mapMovement";
import { ExpansionInfo } from "./expansion/ExpansionInfo";
import { useParams } from "react-router-dom";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { useActor } from "@xstate/react";

export const Humans: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [authState, send] = useActor(authService);
  // catching and passing scroll container to keyboard listeners
  const container = useRef(null);
  const { id } = useParams();
  const [scrollIntoView] = useScrollIntoView();

  useEffect(() => {
    // Our authMachine currently sits outside of our navigation. So if a the machine was in a visiting
    // state and the player loaded this route which can happen using the browser back button then fire
    // the RETURN event to move the authMachine out of the invalid state.
    if (
      authState.matches({ connected: "visitingContributor" }) ||
      authState.matches("visiting")
    ) {
      send("RETURN");
    }
  }, []);

  useEffect(() => {
    // Start with crops centered
    scrollIntoView(Section.Crops, "auto");
  }, [scrollIntoView]);

  useEffect(() => {
    mapMovement.addListeners(container.current);
    return () => {
      mapMovement.removeListeners();
    };
  }, [container]);

  // Load data
  return (
    <GameProvider key={id}>
      <ToastProvider>
        <ScrollContainer
          className="bg-green-background overflow-scroll relative w-full h-full"
          innerRef={container}
        >
          <div
            className="relative h-gameboard w-gameboard"
            // TODO dynamic game board size based on tile dimensions
          >
            <img src={background} className="absolute inset-0 w-full h-full" />
            <ExpansionInfo />
            <Game />
          </div>
        </ScrollContainer>
      </ToastProvider>
    </GameProvider>
  );
};
