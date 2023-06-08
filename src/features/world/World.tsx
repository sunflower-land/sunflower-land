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
const _isMinting = (state: MachineState) => state.matches("minting");
const _isSynced = (state: MachineState) => state.matches("synced");
const _isErrored = (state: MachineState) => state.matches("error");

export const Explore: React.FC = () => {
  const { gameService } = useContext(Context);
  const isLoading = useSelector(gameService, _isLoading);
  const isMinting = useSelector(gameService, _isMinting);
  const synced = useSelector(gameService, _isSynced);
  const errored = useSelector(gameService, _isErrored);

  return (
    <>
      {!isLoading && <PhaserComponent />}
      <Modal show={isLoading} centered>
        <Panel>
          <p className="loading">Loading</p>
        </Panel>
      </Modal>

      <Modal show={isMinting} centered>
        <Panel>
          <p className="loading">Minting</p>
        </Panel>
      </Modal>

      <Modal show={synced} centered>
        <Panel>
          <p>Synced</p>
        </Panel>
      </Modal>

      <Modal show={errored} centered>
        <Panel>
          <p>Errored</p>
        </Panel>
      </Modal>
    </>
  );
};
