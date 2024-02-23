import React from "react";

import { useParams } from "react-router-dom";
import { GameProvider } from "../GameProvider";
import { Game } from "./Game";
import { ModalProvider } from "../components/modal/ModalProvider";
import { GameBoard } from "components/GameBoard";
import { useScrollBoost } from "lib/utils/hooks/useScrollboost";

export const LandExpansion: React.FC = () => {
  const [viewport] = useScrollBoost({
    friction: 0.2,
    scrollMode: "native",
    shouldScroll: (_, event) => {
      const target = event?.target;
      if (target instanceof HTMLElement) {
        return !("preventDragScroll" in target.dataset);
      }
      return false;
    },
  });

  const { id } = useParams();

  // Load data
  return (
    <GameProvider key={id}>
      <ModalProvider>
        <div
          className="overflow-scroll relative w-full h-full page-scroll-container overscroll-none no-scrollbar"
          ref={viewport}
        >
          <GameBoard>
            <Game />
          </GameBoard>
        </div>
      </ModalProvider>
    </GameProvider>
  );
};
