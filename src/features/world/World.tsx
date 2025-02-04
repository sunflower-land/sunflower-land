import { Context, GameProvider } from "features/game/GameProvider";
import { ModalProvider } from "features/game/components/modal/ModalProvider";
import React, { createContext, useContext, useEffect } from "react";
import { PhaserComponent } from "./Phaser";
import { useActor, useInterpret, useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { Outlet, useLocation, useNavigate, useParams } from "react-router";
import { SceneId } from "./mmoMachine";
import { SUNNYSIDE } from "assets/sunnyside";
import PubSub from "pubsub-js";

import {
  MachineInterpreter as MMOMachineInterpreter,
  mmoMachine,
  MachineState as MMOMachineState,
} from "./mmoMachine";
import * as AuthProvider from "features/auth/lib/Provider";
import { Ocean } from "./ui/Ocean";
import { PickServer } from "./ui/PickServer";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { WorldIntroduction } from "./ui/WorldIntroduction";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { GameWrapper } from "features/game/expansion/Game";
import { WorldHud } from "features/island/hud/WorldHud";
import { Loading } from "features/auth/components";
import { GameState } from "features/game/types/game";
import { Forbidden } from "features/auth/components/Forbidden";
import { getBumpkinLevel } from "features/game/lib/level";

interface Props {
  isCommunity?: boolean;
}

export const WorldContext = createContext<{
  isCommunity: boolean;
}>({
  isCommunity: false,
});

export const World: React.FC<Props> = ({ isCommunity = false }) => {
  return (
    <GameProvider>
      <ModalProvider>
        <WorldContext.Provider value={{ isCommunity }}>
          <Explore />
          <div
            aria-label="World"
            className="fixed inset-safe-area pointer-events-none inset-safe-area"
            style={{
              zIndex: 11,
            }}
          >
            <div
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              className="pointer-events-auto"
            >
              <Outlet />
            </div>
          </div>
        </WorldContext.Provider>
      </ModalProvider>
    </GameProvider>
  );
};

const _isLoading = (state: MachineState) => state.matches("loading");

// MMO Machine
const _isConnecting = (state: MMOMachineState) => state.matches("connecting");
const _isConnected = (state: MMOMachineState) => state.matches("connected");
const _isJoining = (state: MMOMachineState) => state.matches("joining");
const _isKicked = (state: MMOMachineState) => state.matches("kicked");
const _isMMOInitialising = (state: MMOMachineState) =>
  state.matches("initialising");
const _isIntroducing = (state: MMOMachineState) =>
  state.matches("introduction");
const _isChoosingUsername = (state: MMOMachineState) =>
  state.matches("chooseUsername");

type MMOProps = { isCommunity: boolean };

const SCENE_ACCESS: Partial<Record<SceneId, (game: GameState) => boolean>> = {
  goblin_house: (game) => game.faction?.name === "goblins",
  sunflorian_house: (game) => game.faction?.name === "sunflorians",
  bumpkin_house: (game) => game.faction?.name === "bumpkins",
  nightshade_house: (game) => game.faction?.name === "nightshades",
  infernos: (game) => {
    const level = getBumpkinLevel(game.bumpkin?.experience ?? 0);
    return level >= 30;
  },
  plaza: (game) => {
    const level = getBumpkinLevel(game.bumpkin?.experience ?? 0);
    return level >= 2;
  },
  kingdom: (game) => {
    const level = getBumpkinLevel(game.bumpkin?.experience ?? 0);
    return level >= 7;
  },
  beach: (game) => {
    const level = getBumpkinLevel(game.bumpkin?.experience ?? 0);
    return level >= 4;
  },
  woodlands: (game) => {
    const level = getBumpkinLevel(game.bumpkin?.experience ?? 0);
    return level >= 6;
  },
  retreat: (game) => {
    const level = getBumpkinLevel(game.bumpkin?.experience ?? 0);
    return level >= 5;
  },
};

export const MMO: React.FC<MMOProps> = ({ isCommunity }) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { name } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const mmoService = useInterpret(mmoMachine, {
    context: {
      jwt: authState.context.user.rawToken,
      farmId: gameState.context.farmId,
      bumpkin: gameState.context.state.bumpkin,
      faction: gameState.context.state.faction?.name,
      sceneId: (name ?? "plaza") as SceneId,
      experience: gameState.context.state.bumpkin?.experience ?? 0,
      isCommunity,
      moderation: gameState.context.moderation,
      username: gameState.context.state.username,
    },
  }) as unknown as MMOMachineInterpreter;
  const [mmoState] = useActor(mmoService);

  useEffect(() => {
    if (
      mmoState.context.sceneId &&
      !location.pathname.includes("marketplace")
    ) {
      navigate(`/world/${mmoState.context.sceneId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mmoState.context.sceneId]);

  // We need to listen to events outside of MMO scope (Settings Panel)
  useEffect(() => {
    // Subscribe to the event
    const eventSubscription = PubSub.subscribe(
      "CHANGE_SERVER",
      (message: string, data?: any) => {
        mmoService.send("CHANGE_SERVER", { serverId: data.serverId });
      },
    );

    return () => {
      PubSub.unsubscribe(eventSubscription);
    };
  }, []);

  const isInitialising = useSelector(mmoService, _isMMOInitialising);
  const isConnecting = useSelector(mmoService, _isConnecting);
  const isJoining = useSelector(mmoService, _isJoining);
  const isKicked = useSelector(mmoService, _isKicked);
  const isConnected = useSelector(mmoService, _isConnected);
  const isIntroducing = useSelector(mmoService, _isIntroducing);
  const isChoosingUsername = useSelector(mmoService, _isChoosingUsername);
  const isTraveling =
    isInitialising || isConnecting || isConnected || isKicked || isJoining;

  if (isTraveling) {
    return <TravelScreen mmoService={mmoService} />;
  }

  if (
    SCENE_ACCESS[name as SceneId] &&
    !SCENE_ACCESS[name as SceneId]?.(gameState.context.state)
  ) {
    return (
      <Panel>
        <Forbidden
          onClose={() => {
            navigate(`/`);
          }}
        />
      </Panel>
    );
  }

  if (!mmoService.state) {
    return <></>;
  }

  // Otherwise if connected, return Plaza Screen
  return (
    <>
      <PhaserComponent
        mmoService={mmoService}
        isCommunity={isCommunity}
        inventory={gameState.context.state.inventory}
        route={name as SceneId}
      />

      <Modal show={isIntroducing}>
        <WorldIntroduction
          onClose={(username: string) => {
            mmoService.send("CONTINUE", { username });
            // BUG - need to call twice?
            mmoService.send("CONTINUE", { username });
          }}
        />
      </Modal>

      {/* <Modal show={isChoosingUsername}></Modal> */}
      <WorldHud />
    </>
  );
};

interface TravelProps {
  mmoService: MMOMachineInterpreter;
}
export const TravelScreen: React.FC<TravelProps> = ({ mmoService }) => {
  const { t } = useAppTranslation();

  const isConnected = useSelector(mmoService, _isConnected);
  const isKicked = useSelector(mmoService, _isKicked);

  // Return kicked
  if (isKicked) {
    return (
      <Ocean>
        <Modal show>
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
        <Modal show>
          <PickServer mmoService={mmoService} />
        </Modal>
      </Ocean>
    );
  }

  return (
    <Ocean>
      <Modal show backdrop={false}>
        <Panel>
          <Loading />
        </Panel>
      </Modal>
    </Ocean>
  );
};

export const Explore: React.FC = () => {
  const { gameService } = useContext(Context);
  const { isCommunity } = useContext(WorldContext);
  const isLoading = useSelector(gameService, _isLoading);

  return (
    <div
      className="bg-blue-600 w-full bg-repeat h-full flex relative items-center justify-center"
      style={{
        backgroundImage: `url(${SUNNYSIDE.decorations.ocean})`,
        backgroundSize: `${64 * PIXEL_SCALE}px`,
        imageRendering: "pixelated",
      }}
    >
      <GameWrapper>
        {!isLoading && <MMO isCommunity={isCommunity} />}
      </GameWrapper>
    </div>
  );
};
