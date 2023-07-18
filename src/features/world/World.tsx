import { Context, GameProvider } from "features/game/GameProvider";
import { ModalProvider } from "features/game/components/modal/ModalProvider";
import React, { useContext } from "react";
import { PhaserComponent } from "./Phaser";
import { useActor, useInterpret, useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Success } from "features/game/components/Success";
import { SomethingWentWrong } from "features/auth/components/SomethingWentWrong";
import { Refreshing } from "features/auth/components/Refreshing";
import { WorldHud } from "features/island/hud/WorldHud";
import { useParams } from "react-router-dom";
import { SceneId } from "./mmoMachine";
import { ToastProvider } from "features/game/toast/ToastProvider";
import { ToastPanel } from "features/game/toast/ToastPanel";
import {
  MachineInterpreter as MMOMachineInterpreter,
  mmoMachine,
  MachineState as MMOMachineState,
} from "./mmoMachine";
import * as AuthProvider from "features/auth/lib/Provider";
import { Ocean } from "./ui/Ocean";
import { PickServer } from "./ui/PickServer";

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

// MMO Machine
const _isConnecting = (state: MMOMachineState) => state.matches("connecting");
const _isConnected = (state: MMOMachineState) => state.matches("connected");
const _isJoining = (state: MMOMachineState) => state.matches("joining");
const _isJoined = (state: MMOMachineState) => state.matches("joined");
const _isKicked = (state: MMOMachineState) => state.matches("kicked");
const _isMMOInitialising = (state: MMOMachineState) =>
  state.matches("initialising");

type MMOProps = { isCommunity: boolean };

export const MMO: React.FC<MMOProps> = ({ isCommunity }) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { name } = useParams();

  const mmoService = useInterpret(mmoMachine, {
    context: {
      jwt: authState.context.user.rawToken,
      farmId: authState.context.user.farmId,
      bumpkin: gameState.context.state.bumpkin,
    },
  }) as unknown as MMOMachineInterpreter;

  const isInitialising = useSelector(mmoService, _isMMOInitialising);
  const isConnecting = useSelector(mmoService, _isConnecting);
  const isConnected = useSelector(mmoService, _isConnected);
  const isJoining = useSelector(mmoService, _isJoining);
  const isJoined = useSelector(mmoService, _isJoined);
  const isKicked = useSelector(mmoService, _isKicked);

  // Initiatilise Machine

  // If state is x, y or z then return Travel Screen
  const isTraveling =
    isInitialising || isConnecting || isConnected || isKicked || isJoining;

  if (isTraveling) {
    return <TravelScreen mmoService={mmoService} />;
  }

  // Otherwsie if connected, return Plaza Screen
  return (
    <PhaserComponent
      mmoService={mmoService}
      scene={name as SceneId}
      isCommunity={isCommunity}
    />
  );
};

interface TravelProps {
  mmoService: MMOMachineInterpreter;
}
export const TravelScreen: React.FC<TravelProps> = ({ mmoService }) => {
  const isConnecting = useSelector(mmoService, _isConnecting);
  const isConnected = useSelector(mmoService, _isConnected);
  const isJoining = useSelector(mmoService, _isJoining);
  const isKicked = useSelector(mmoService, _isKicked);

  const content = () => {
    // Return connecting
    if (isConnecting || isJoining) {
      return <p className="loading">Loading</p>;
    }

    if (isConnected) {
      return <PickServer mmoService={mmoService} />;
    }
  };

  // Return kicked
  if (isKicked) {
    return (
      <Modal centered>
        <Panel>
          {/* Kicked reasons */}
          <p className="">Kicked</p>
        </Panel>
      </Modal>
    );
  }

  return <Ocean>{content()}</Ocean>;
};

export const Explore: React.FC<Props> = ({ isCommunity = false }) => {
  const { gameService } = useContext(Context);
  const isLoading = useSelector(gameService, _isLoading);
  const isMinting = useSelector(gameService, _isMinting);
  const synced = useSelector(gameService, _isSynced);
  const errored = useSelector(gameService, _isErrored);
  const refreshing = useSelector(gameService, _refreshing);
  const hasPass = useSelector(gameService, _hasAccess);

  // Show The "Travel" or the "Plaza Screen"

  return (
    <>
      <ToastProvider>
        <ToastPanel />
        {!isLoading && <MMO isCommunity={isCommunity} />}
        {/* <PhaserComponent
          mmoService={mmoService}
          scene={name as SceneId}
          isCommunity={isCommunity}
        /> */}

        <WorldHud />

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
