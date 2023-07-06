import { Context, GameProvider } from "features/game/GameProvider";
import { ModalProvider } from "features/game/components/modal/ModalProvider";
import React, { useContext } from "react";
import { PhaserComponent } from "./Phaser";
import { useActor, useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Success } from "features/game/components/Success";
import { SomethingWentWrong } from "features/auth/components/SomethingWentWrong";
import { Refreshing } from "features/auth/components/Refreshing";
import { WorldHud } from "features/island/hud/WorldHud";
import { AuctionCountdown } from "features/retreat/components/auctioneer/AuctionCountdown";
import { useParams } from "react-router-dom";
import { RoomId } from "./roomMachine";
import { ToastProvider } from "features/game/toast/ToastProvider";
import { ToastPanel } from "features/game/toast/ToastPanel";

const _gameState = (state: MachineState) => state.value;

interface Props {
  isCommunity?: boolean;
}
export const World: React.FC<Props> = ({ isCommunity = false }) => {
  return (
    <GameProvider>
      <ModalProvider>
        <Explore isCommunity={isCommunity} />
      </ModalProvider>
    </GameProvider>
  );
};

const _isLoading = (state: MachineState) => state.matches("loading");
const _isMinting = (state: MachineState) => state.matches("minting");
const _isSynced = (state: MachineState) => state.matches("synced");
const _isErrored = (state: MachineState) => state.matches("error");
const _refreshing = (state: MachineState) => state.matches("refreshing");
const _hasAccess = (state: MachineState) =>
  !!state.context.state.inventory["Beta Pass"];

export const Explore: React.FC<Props> = ({ isCommunity = false }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const isLoading = useSelector(gameService, _isLoading);
  const isMinting = useSelector(gameService, _isMinting);
  const synced = useSelector(gameService, _isSynced);
  const errored = useSelector(gameService, _isErrored);
  const refreshing = useSelector(gameService, _refreshing);
  const hasPass = useSelector(gameService, _hasAccess);
  const { name } = useParams();

  return (
    <>
      <ToastProvider>
        <ToastPanel />
        {!isLoading && (
          <PhaserComponent scene={name as RoomId} isCommunity={isCommunity} />
        )}

        <WorldHud />
        <AuctionCountdown />

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
            <Success />
          </Panel>
        </Modal>

        <Modal show={errored} centered>
          <Panel>
            <SomethingWentWrong />
          </Panel>
        </Modal>

        <Modal show={refreshing} centered>
          <Panel>
            <Refreshing />
          </Panel>
        </Modal>
      </ToastProvider>
      <Modal show={refreshing} centered>
        <Panel>
          <Refreshing />
        </Panel>
      </Modal>
    </>
  );
};
