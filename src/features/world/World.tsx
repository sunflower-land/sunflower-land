import { Context, GameProvider } from "features/game/GameProvider";
import { ModalProvider } from "features/game/components/modal/ModalProvider";
import React, { useContext } from "react";
import { PhaserComponent } from "./Phaser";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";

const _gameState = (state: MachineState) => state.value;

export const World: React.FC = () => {
  return (
    <GameProvider>
      <ModalProvider>
        <Explore />
      </ModalProvider>
    </GameProvider>
  );
};

const _isLoading = (state: MachineState) => state.matches("loading");

export const Explore: React.FC = () => {
  const { gameService } = useContext(Context);
  const isLoading = useSelector(gameService, _isLoading);

  return (
    <>
      {!isLoading && <PhaserComponent />}
      <Modal show={isLoading} centered>
        <Panel>
          <p className="loading">Loading</p>
        </Panel>
      </Modal>
    </>
  );
};
