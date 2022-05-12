import React, { useRef, useEffect } from "react";
import ScrollContainer from "react-indiana-drag-scroll";

import background from "assets/land/background.png";

import { VisitingProvider } from "./VisitingProvider";
import mapMovement from "./lib/mapMovement";
import { ExpansionInfo } from "./expansion/ExpansionInfo";
import { useParams } from "react-router-dom";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { ReadOnlyGame } from "features/visiting/ReadOnlyGame";

export const Visiting: React.FC = () => {
  // catching and passing scroll container to keyboard listeners
  const container = useRef(null);
  const { id } = useParams();
  const [scrollIntoView] = useScrollIntoView();

  useEffect(() => {
    // Start with crops centered
    // if (showGame) {
    scrollIntoView(Section.Crops, "auto");
    // }
  }, [scrollIntoView]);

  useEffect(() => {
    mapMovement.addListeners(container.current);

    return () => {
      mapMovement.removeListeners();
    };
  }, [container]);

  // Load data
  return (
    <VisitingProvider key={id}>
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
          <ReadOnlyGame />
        </div>
      </ScrollContainer>
    </VisitingProvider>
  );
};
