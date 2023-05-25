import { GameProvider } from "features/game/GameProvider";
import { ModalProvider } from "features/game/components/modal/ModalProvider";
import React from "react";
import { PhaserComponent } from "./Phaser";

export const World: React.FC = () => {
  return (
    <GameProvider>
      <ModalProvider>
        <PhaserComponent />
      </ModalProvider>
    </GameProvider>
  );
};
