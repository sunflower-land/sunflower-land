import React, { useRef, useEffect } from "react";
import ScrollContainer from "react-indiana-drag-scroll";

import mapMovement from "../lib/mapMovement";
import { useParams } from "react-router-dom";
import { GameProvider } from "../GameProvider";
import { Game } from "./Game";
import { ModalProvider } from "../components/modal/ModalProvider";
import { GameBoard } from "components/GameBoard";

export const LandExpansion: React.FC = () => {
  // catching and passing scroll container to keyboard listeners
  const container = useRef(null);
  const { id } = useParams();

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
          className="bg-blue-300 overflow-scroll relative w-full h-full page-scroll-container overscroll-none"
          innerRef={container}
          ignoreElements={"*[data-prevent-drag-scroll]"}
        >
          <GameBoard>
            <Game />
          </GameBoard>
        </ScrollContainer>
      </ModalProvider>
    </GameProvider>
  );
};
