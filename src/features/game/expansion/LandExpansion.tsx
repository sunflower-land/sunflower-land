import React, { useRef } from "react";
import ScrollContainer from "react-indiana-drag-scroll";

import { useParams } from "react-router";
import { Game } from "./Game";
import { ModalProvider } from "../components/modal/ModalProvider";
import { GameBoard } from "components/GameBoard";

export const LandExpansion: React.FC = () => {
  // catching and passing scroll container to keyboard listeners
  const container = useRef(null);
  const { id } = useParams();

  // Load data
  return (
    <ModalProvider>
      <ScrollContainer
        className="!overflow-scroll relative w-full h-full page-scroll-container overscroll-none"
        innerRef={container}
        ignoreElements={"*[data-prevent-drag-scroll]"}
      >
        <GameBoard>
          <Game />
        </GameBoard>
      </ScrollContainer>
    </ModalProvider>
  );
};
