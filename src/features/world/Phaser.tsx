import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";

import { MachineInterpreter, MachineState, SceneId } from "./mmoMachine";

import { useAppTranslation } from "lib/i18n/useAppTranslations";

// Phaser & Plugins
import { Game, AUTO } from "phaser";
import { useActor, useSelector } from "@xstate/react";
import NinePatch2Plugin from "phaser3-rex-plugins/plugins/ninepatch2-plugin.js";
import VirtualJoystickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin.js";
import { PhaserNavMeshPlugin } from "phaser-navmesh";

// Import Features
import * as AuthProvider from "features/auth/lib/Provider";
import { ChatUI } from "features/pumpkinPlaza/components/ChatUI";
import { Context } from "features/game/GameProvider";
import { EventObject } from "xstate";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { EquipBumpkinAction } from "features/game/events/landExpansion/equip";
import { prepareAPI } from "features/community/lib/CommunitySDK";
import { Moderation, UpdateUsernameEvent } from "features/game/lib/gameMachine";
import { Inventory } from "features/game/types/game";
import { Loading } from "features/auth/components";
import { ToastContext } from "features/game/toast/ToastProvider";
import { AuthMachineState } from "features/auth/lib/authMachine";

// Import UIs
import { ModerationTools } from "./ui/moderationTools/ModerationTools";
import { Kicked } from "./ui/moderationTools/components/Kicked";
import {
  Muted,
  calculateMuteTime,
} from "./ui/moderationTools/components/Muted";
import { InteractableModals } from "./ui/InteractableModals";
import { NPCModals } from "./ui/NPCModals";
import { Modal } from "components/ui/Modal";
import { InnerPanel, Panel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { PlayerModals } from "./ui/PlayerModals";
import { TradeCompleted } from "./ui/TradeCompleted";
import { FishingModal } from "./ui/FishingModal";
import { HudContainer } from "components/ui/HudContainer";

// Import Scenes
import { Preloader } from "./scenes/Preloader";
import { BeachScene } from "./scenes/BeachScene";
import { PlazaScene } from "./scenes/PlazaScene";
import { WoodlandsScene } from "./scenes/WoodlandsScene";
import { RetreatScene } from "./scenes/RetreatScene";
import { KingdomScene } from "./scenes/Kingdom";
import { GoblinHouseScene } from "./scenes/GoblinHouseScene";
import { SunflorianHouseScene } from "./scenes/SunflorianHouseScene";
import { NightshadeHouseScene } from "./scenes/NightshadeHouseScene";
import { BumpkinHouseScene } from "./scenes/BumpkinHouseScene";
import { ExampleAnimationScene } from "./scenes/examples/AnimationScene";
import { ExampleRPGScene } from "./scenes/examples/RPGScene";

// Import icons & assets
import { SUNNYSIDE } from "assets/sunnyside";
import SoundOffIcon from "assets/icons/sound_off.png";
import WorldIcon from "assets/icons/world.png";

const _roomState = (state: MachineState) => state.value;
const _scene = (state: MachineState) => state.context.sceneId;
const _rawToken = (state: AuthMachineState) =>
  state.context.user.rawToken ?? "";

type Player = {
  playerId: string;
  username: string;
  farmId: number;
  clothing: BumpkinParts;
  x: number;
  y: number;
  moderation?: Moderation;
  experience: number;
  sceneId: SceneId;
};

export type ModerationEvent = {
  type: "kick" | "mute";
  farmId: number;
  arg: string;
  mutedUntil?: number;
};

interface Props {
  isCommunity: boolean;
  mmoService: MachineInterpreter;
  inventory: Inventory;
  route: SceneId;
}

export const PhaserComponent: React.FC<Props> = ({
  isCommunity,
  mmoService,
  inventory,
  route,
}) => {
  const { t } = useAppTranslation();

  // Context, Services, & State
  const { authService } = useContext(AuthProvider.Context);
  const { gameService, selectedItem, shortcutItem } = useContext(Context);
  const { toastsList } = useContext(ToastContext);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const [phaserLoaded, setPhaserLoaded] = useState(false);

  const [isMuted, setIsMuted] = useState<ModerationEvent | null>(null);
  const [muteEvent, setMuteEvent] = useState<ModerationEvent | null>(null);
  const [kickEvent, setKickEvent] = useState<ModerationEvent | null>(null);
  const [isModerator, setIsModerator] = useState(false);

  const navigate = useNavigate();
  const game = useRef<Game>();
  const mmoState = useSelector(mmoService, _roomState);
  const scene = useSelector(mmoService, _scene);
  const rawToken = useSelector(authService, _rawToken);

  // Scenes
  const scenes = [
    Preloader,
    new WoodlandsScene({ gameState: gameService.state.context.state }),
    BeachScene,
    new PlazaScene({ gameState: gameService.state.context.state }),
    RetreatScene,
    KingdomScene,
    GoblinHouseScene,
    SunflorianHouseScene,
    NightshadeHouseScene,
    BumpkinHouseScene,
    ExampleAnimationScene,
    ExampleRPGScene,
  ];

  const init = useCallback(() => {
    if (game.current) {
      game.current.destroy(true);
      game.current = undefined;
    }

    // Create the game
    game.current = new Game({
      parent: "game-content",
      type: AUTO,
      fps: {
        target: 30,
        smoothStep: true,
      },
      backgroundColor: "#000000",
      autoRound: true,
      pixelArt: true,
      plugins: {
        global: [
          {
            key: "rexNinePatch2Plugin",
            plugin: NinePatch2Plugin,
            start: true,
          },
          {
            key: "rexVirtualJoystick",
            plugin: VirtualJoystickPlugin,
            start: true,
          },
        ],
        scene: [
          {
            key: "PhaserNavMeshPlugin",
            plugin: PhaserNavMeshPlugin,
            mapping: "navMeshPlugin",
            start: true,
          },
        ],
      },
      width: window.innerWidth,
      height: window.innerHeight,
      physics: {
        default: "arcade",
        arcade: {
          debug: true,
          gravity: { x: 0, y: 0 },
        },
      },
      scene: scenes,
      loader: {
        crossOrigin: "anonymous",
      },
    });

    // Inject registry
    game.current.registry.set("mmoService", mmoService); // LEGACY
    game.current.registry.set("gameState", gameService.state.context.state);
    game.current.registry.set("authService", authService);
    game.current.registry.set("gameService", gameService);
    game.current.registry.set("id", gameService.state.context.farmId);
    game.current.registry.set("initialScene", scene);
    game.current.registry.set("navigate", navigate);
    game.current.registry.set("selectedItem", selectedItem);
    game.current.registry.set("shortcutItem", shortcutItem);

    setPhaserLoaded(true);
  }, []);

  const injectCommunityAPI = useCallback(() => {
    (window as any).CommunityAPI = prepareAPI({
      farmId: gameService.state.context.farmId,
      jwt: rawToken,
      gameService,
    });
  }, [rawToken]);

  const updateModerationStatus = useCallback(() => {
    const { wardrobe, inventory } = gameService.state.context.state;
    const status = !!inventory["Beta Pass"] && !!wardrobe.Halo;

    setIsModerator(status);
  }, []);

  const handleModerationEvent = useCallback((event: ModerationEvent) => {
    const { farmId } = gameService.state.context;
    if (!farmId) return;

    switch (event.type) {
      case "kick":
        setKickEvent(event);
        break;
      case "mute":
        setIsMuted(event);
        setMuteEvent(event);
        break;
      default:
        break;
    }
  }, []);

  useEffect(() => {
    injectCommunityAPI();
    updateModerationStatus();
    init();

    const listener = (e: EventObject) => {
      switch (e.type) {
        case "bumpkin.equipped":
          mmoService.state.context.server?.send("player:clothing:update", {
            clothing: (e as EquipBumpkinAction).equipment,
          });
          break;
        case "UPDATE_USERNAME":
          mmoService.state.context.server?.send("player:username:change", {
            username: (e as UpdateUsernameEvent).username,
          });
          break;
        default:
          break;
      }
    };

    gameService.onEvent(listener);
    return () => {
      game.current?.destroy(true);
      gameService.off(listener);
    };
  }, [init, injectCommunityAPI, updateModerationStatus]);

  useEffect(() => {
    game.current?.registry.set("mmoServer", mmoService.state.context.server);
  }, [mmoService.state.context.server]);

  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <div id="game-content" ref={ref} />

      {/* HUD */}
      <HudContainer>
        {isMuted && (
          <InnerPanel className="fixed top-2 left-1/2 -translate-x-1/2 flex items-center cursor-pointer">
            <img src={SoundOffIcon} className="h-8 mr-2 ml-1" />
            <div className="flex flex-col p-1">
              <span className="text-sm">{t("chat.mute")}</span>
              <span className="text-xxs">
                {t("chat.again")}{" "}
                {isMuted.mutedUntil
                  ? calculateMuteTime(isMuted.mutedUntil, "remaining")
                  : "Unknown"}
              </span>
            </div>
          </InnerPanel>
        )}

        <ChatUI
          farmId={gameService.state.context.farmId}
          gameState={gameService.state.context.state}
          scene={scene}
          onMessage={(m) => {
            mmoService.state.context.server?.send("player:message", {
              text: m.text ?? "?",
            });
          }}
          messages={[]}
          isMuted={isMuted ? true : false}
          onReact={(reaction) => {
            mmoService.state.context.server?.send("player:reaction", {
              reaction: { reaction },
            });
          }}
          onBudPlace={(tokenId) => {
            mmoService.state.context.server?.send("player:bud:place", {
              budId: tokenId,
            });
          }}
        />
        {isModerator && !isCommunity && (
          <ModerationTools
            scene={game.current?.scene.getScene(scene)}
            messages={[]}
            players={[]}
            gameService={gameService}
          />
        )}

        {mmoState === "connecting" && (
          <Label
            type="chill"
            icon={WorldIcon}
            className="fixed top-2 left-1/2 -translate-x-1/2 flex items-center"
          >
            {t("mmo.connecting")}
          </Label>
        )}
        {mmoState === "error" && (
          <Label
            type="danger"
            icon={SUNNYSIDE.icons.cancel}
            className="fixed top-2 left-1/2 -translate-x-1/2 flex items-center cursor-pointer"
            onClick={() => mmoService.send("RETRY")}
          >
            {t("mmo.connectionFailed")}
          </Label>
        )}
      </HudContainer>

      {/* Modals */}
      {muteEvent && (
        <Muted event={muteEvent} onClose={() => setMuteEvent(null)} />
      )}

      {kickEvent && (
        <Kicked
          event={kickEvent}
          onClose={() => {
            setKickEvent(null);
            navigate(`/`);
          }}
        />
      )}

      <NPCModals
        id={gameService.state.context.farmId as number}
        scene={scene}
      />
      <FishingModal />
      <PlayerModals game={gameService.state.context.state} />
      <TradeCompleted
        mmoService={mmoService}
        farmId={gameService.state.context.farmId as number}
      />
      <InteractableModals
        id={gameService.state.context.farmId as number}
        scene={scene}
        key={scene}
      />
      <Modal
        show={mmoState === "loading" || mmoState === "initialising"}
        backdrop={false}
      >
        <Panel>
          <Loading />
        </Panel>
      </Modal>

      <Modal show={mmoState === "joinRoom"} backdrop={false}>
        <Panel>
          <Loading />
        </Panel>
      </Modal>
    </>
  );
};
