import React, { useRef, useEffect, useContext } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import * as Auth from "features/auth/lib/Provider";

import background from "assets/land/water-background.png";

import { ToastProvider } from "./toast/ToastQueueProvider";
import mapMovement from "./lib/mapMovement";
import { useParams } from "react-router-dom";
import { useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { useActor } from "@xstate/react";
import { LandProvider } from "./LandProvider";
import { Land } from "./Land";

export const LandExpansion: React.FC = () => {
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
    mapMovement.addListeners(container.current);
    return () => {
      mapMovement.removeListeners();
    };
  }, [container]);

  // Load data
  return (
    <LandProvider key={id}>
      <ToastProvider>
        <ScrollContainer
          className="bg-blue-300 overflow-scroll relative w-full h-full"
          innerRef={container}
        >
          <div
            className="relative h-goblinGameboard w-goblinGameboard"
            // TODO dynamic game board size based on tile dimensions
          >
            <img src={background} className="absolute inset-0 w-full h-full" />
            <Land />
          </div>
        </ScrollContainer>
      </ToastProvider>
    </LandProvider>
  );
};
