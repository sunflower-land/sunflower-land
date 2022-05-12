import React, { useRef, useEffect, useContext } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import { useParams } from "react-router-dom";

import background from "assets/land/background.png";

import * as Auth from "features/auth/lib/Provider";
import { VisitingProvider } from "./VisitingProvider";
import mapMovement from "./lib/mapMovement";

import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { ExpansionInfo } from "./expansion/ExpansionInfo";
import { ReadOnlyGame } from "features/visiting/ReadOnlyGame";

export const Visiting: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  // catching and passing scroll container to keyboard listeners
  const container = useRef(null);
  const { id } = useParams();
  const [scrollIntoView] = useScrollIntoView();

  useEffect(() => {
    scrollIntoView(Section.Crops, "auto");
  }, [scrollIntoView]);

  useEffect(() => {
    mapMovement.addListeners(container.current);

    return () => {
      mapMovement.removeListeners();
    };
  }, [container]);

  useEffect(() => {
    authService.send("VISIT");
  }, [authService]);

  // Load data
  return (
    <VisitingProvider key={id}>
      <ScrollContainer
        className="bg-green-background overflow-scroll relative w-full h-full"
        innerRef={container}
      >
        <div className="relative h-gameboard w-gameboard">
          <img src={background} className="absolute inset-0 w-full h-full" />
          <ExpansionInfo />
          <ReadOnlyGame />
        </div>
      </ScrollContainer>
    </VisitingProvider>
  );
};
