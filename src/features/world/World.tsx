import { Context, GameProvider } from "features/game/GameProvider";
import { ModalProvider } from "features/game/components/modal/ModalProvider";
import React, { useContext } from "react";
import { PhaserComponent } from "./Phaser";
import { useActor, useInterpret, useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { WorldHud } from "features/island/hud/WorldHud";
import { useParams } from "react-router-dom";
import { SceneId } from "./mmoMachine";
import ocean from "assets/decorations/ocean.webp";

import {
  MachineInterpreter as MMOMachineInterpreter,
  mmoMachine,
  MachineState as MMOMachineState,
} from "./mmoMachine";
import * as AuthProvider from "features/auth/lib/Provider";
import { Ocean } from "./ui/Ocean";
import { PickServer } from "./ui/PickServer";
import { GameWrapper } from "features/game/expansion/Game";
import { PIXEL_SCALE, TEST_FARM } from "features/game/lib/constants";
import { hasFeatureAccess } from "lib/flags";
import { IslandNotFound } from "features/game/expansion/components/IslandNotFound";
import { WorldIntroduction } from "./ui/WorldIntroduction";
import { Snow } from "./ui/Snow";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

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

// MMO Machine
const _isConnecting = (state: MMOMachineState) => state.matches("connecting");
const _isConnected = (state: MMOMachineState) => state.matches("connected");
const _isJoining = (state: MMOMachineState) => state.matches("joining");
const _isJoined = (state: MMOMachineState) => state.matches("joined");
const _isKicked = (state: MMOMachineState) => state.matches("kicked");
const _isMMOInitialising = (state: MMOMachineState) =>
  state.matches("initialising");
const _isIntroducing = (state: MMOMachineState) =>
  state.matches("introduction");

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
      farmId: gameState.context.farmId,
      bumpkin: gameState.context.state.bumpkin,
      sceneId: name as SceneId,
      experience: gameState.context.state.bumpkin?.experience ?? 0,
      isCommunity,
      moderation: gameState.context.moderation,
      username: gameState.context.state.username,
    },
  }) as unknown as MMOMachineInterpreter;

  const isInitialising = useSelector(mmoService, _isMMOInitialising);
  const isConnecting = useSelector(mmoService, _isConnecting);
  const isConnected = useSelector(mmoService, _isConnected);
  const isJoining = useSelector(mmoService, _isJoining);
  const isJoined = useSelector(mmoService, _isJoined);
  const isKicked = useSelector(mmoService, _isKicked);
  const isIntroducting = useSelector(mmoService, _isIntroducing);

  // If state is x, y or z then return Travel Screen
  const isTraveling =
    isInitialising || isConnecting || isConnected || isKicked || isJoining;

  if (isTraveling) {
    return <TravelScreen mmoService={mmoService} />;
  }

  if (!mmoService.state) {
    return null;
  }

  // Otherwsie if connected, return Plaza Screen
  return (
    <>
      <PhaserComponent
        mmoService={mmoService}
        isCommunity={isCommunity}
        inventory={gameState.context.state.inventory}
        route={name as SceneId}
      />
      <Modal show={isIntroducting} centered>
        <WorldIntroduction
          onClose={() => {
            mmoService.send("CONTINUE");
            // BUG - need to call twice?
            mmoService.send("CONTINUE");
          }}
        />
      </Modal>
    </>
  );
};

interface TravelProps {
  mmoService: MMOMachineInterpreter;
}
export const TravelScreen: React.FC<TravelProps> = ({ mmoService }) => {
  const { t } = useAppTranslation();

  const isConnecting = useSelector(mmoService, _isConnecting);
  const isConnected = useSelector(mmoService, _isConnected);
  const isJoining = useSelector(mmoService, _isJoining);
  const isKicked = useSelector(mmoService, _isKicked);

  // Return kicked
  if (isKicked) {
    return (
      <Ocean>
        <Modal show centered>
          <Panel>
            {/* Kicked reasons */}
            <p className="">{t("chat.Kicked")}</p>
          </Panel>
        </Modal>
      </Ocean>
    );
  }

  if (isConnected) {
    return (
      <Ocean>
        <Modal show centered>
          <PickServer mmoService={mmoService} />
        </Modal>
      </Ocean>
    );
  }

  return (
    <Ocean>
      <Modal show centered backdrop={false}>
        <Panel>
          <p className="loading">{t("loading")}</p>
        </Panel>
      </Modal>
    </Ocean>
  );
};

export const Explore: React.FC<Props> = ({ isCommunity = false }) => {
  const { gameService, showAnimations } = useContext(Context);
  const isLoading = useSelector(gameService, _isLoading);
  const name = useParams().name as SceneId;

  const hasAccess =
    name !== "beach" ||
    hasFeatureAccess(gameService?.state?.context?.state ?? TEST_FARM, "BEACH");

  return (
    <div
      className="bg-blue-600 w-full bg-repeat h-full flex relative items-center justify-center"
      style={{
        backgroundImage: `url(${ocean})`,
        backgroundSize: `${64 * PIXEL_SCALE}px`,
        imageRendering: "pixelated",
      }}
    >
      {showAnimations &&
        Date.now() > new Date("2023-12-10").getTime() &&
        Date.now() < new Date("2023-12-27").getTime() && <Snow />}
      {hasAccess ? (
        <GameWrapper>
          {!isLoading && <MMO isCommunity={isCommunity} />}
          <WorldHud />
        </GameWrapper>
      ) : (
        <IslandNotFound />
      )}
    </div>
  );
};
