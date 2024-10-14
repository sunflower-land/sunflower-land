import React, { useEffect, useRef } from "react";
import ScrollContainer from "react-indiana-drag-scroll";

import { useParams } from "react-router-dom";
import { GameProvider } from "../GameProvider";
import { Game } from "./Game";
import { ModalProvider } from "../components/modal/ModalProvider";
import { GameBoard } from "components/GameBoard";
import { SUNNYSIDE } from "assets/sunnyside";
import { HudContainer } from "components/ui/HudContainer";
import { DEMO_LANDS } from "../lib/demo";

export const LandExpansion: React.FC = () => {
  // catching and passing scroll container to keyboard listeners
  const container = useRef(null);
  const { id } = useParams();

  // Load data
  return (
    <GameProvider key={id}>
      <ModalProvider>
        <ScrollContainer
          className="!overflow-scroll relative w-full h-full page-scroll-container overscroll-none"
          innerRef={container}
          ignoreElements={"*[data-prevent-drag-scroll]"}
        >
          <GameBoard>
            <HudContainer>
              <div className="flex items-center justify-center absolute inset-0 w-full h-full pointer-events-none z-50">
                <img
                  id="logo"
                  src={SUNNYSIDE.brand.logo}
                  className="w-1/3 z-10"
                />
                <div className="absolute inset-0 bg-black opacity-40" />
              </div>
            </HudContainer>

            <Game />
          </GameBoard>
        </ScrollContainer>
      </ModalProvider>
    </GameProvider>
  );
};
