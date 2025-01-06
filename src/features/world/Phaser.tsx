import React, { useContext, useEffect, useRef, useState } from "react";
import { Game, AUTO } from "phaser";
import { useActor, useSelector } from "@xstate/react";
import NinePatchPlugin from "phaser3-rex-plugins/plugins/ninepatch-plugin.js";
import VirtualJoystickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin.js";
import { PhaserNavMeshPlugin } from "phaser-navmesh";

import * as AuthProvider from "features/auth/lib/Provider";
import { ChatUI, Message } from "features/pumpkinPlaza/components/ChatUI";
import { ModerationTools } from "./ui/moderationTools/ModerationTools";

import { Kicked } from "./ui/moderationTools/components/Kicked";
import {
  Muted,
  calculateMuteTime,
} from "./ui/moderationTools/components/Muted";

import { PlazaScene } from "./scenes/PlazaScene";

import { InteractableModals } from "./ui/InteractableModals";
import { NPCModals } from "./ui/NPCModals";
import {
  MachineInterpreter,
  MachineState,
  mmoBus,
  SceneId,
} from "./mmoMachine";
import { Context } from "features/game/GameProvider";
import { Modal } from "components/ui/Modal";
import { InnerPanel, Panel } from "components/ui/Panel";
import { WoodlandsScene } from "./scenes/WoodlandsScene";
import { SUNNYSIDE } from "assets/sunnyside";
import { Preloader } from "./scenes/Preloader";
import { EquipBumpkinAction } from "features/game/events/landExpansion/equip";
import { Label } from "components/ui/Label";
import { CommunityModals } from "./ui/CommunityModalManager";
import { CommunityToasts } from "./ui/CommunityToastManager";
import { useNavigate } from "react-router";
import { PlayerModals } from "./ui/PlayerModals";
import { prepareAPI } from "features/community/lib/CommunitySDK";
import { TradeCompleted } from "./ui/TradeCompleted";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";

import SoundOffIcon from "assets/icons/sound_off.png";
import { handleCommand } from "./lib/chatCommands";
import { Moderation, UpdateUsernameEvent } from "features/game/lib/gameMachine";
import { BeachScene } from "./scenes/BeachScene";
import { Inventory } from "features/game/types/game";
import { FishingModal } from "./ui/FishingModal";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { HudContainer } from "components/ui/HudContainer";
import { RetreatScene } from "./scenes/RetreatScene";
import { KingdomScene } from "./scenes/Kingdom";
import { GoblinHouseScene } from "./scenes/GoblinHouseScene";
import { SunflorianHouseScene } from "./scenes/SunflorianHouseScene";
import { Loading } from "features/auth/components";
import { NightshadeHouseScene } from "./scenes/NightshadeHouseScene";
import { BumpkinHouseScene } from "./scenes/BumpkinHouseScene";
import { ExampleAnimationScene } from "./scenes/examples/AnimationScene";
import { ExampleRPGScene } from "./scenes/examples/RPGScene";
import { EventObject } from "xstate";
import { ToastContext } from "features/game/toast/ToastProvider";
import { AuthMachineState } from "features/auth/lib/authMachine";
import worldIcon from "assets/icons/world.png";

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

  const { authService } = useContext(AuthProvider.Context);
  const { gameService, selectedItem, shortcutItem } = useContext(Context);

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const { toastsList } = useContext(ToastContext);

  const [messages, setMessages] = useState<Message[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isModerator, setIsModerator] = useState(false);

  const [isMuted, setIsMuted] = useState<ModerationEvent | undefined>();

  const [MuteEvent, setMuteEvent] = useState<ModerationEvent | undefined>();
  const [KickEvent, setKickEvent] = useState<ModerationEvent | undefined>();

  const [loaded, setLoaded] = useState(false);

  const navigate = useNavigate();

  const game = useRef<Game>();

  const mmoState = useSelector(mmoService, _roomState);
  const scene = useSelector(mmoService, _scene);

  const rawToken = useSelector(authService, _rawToken);

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

  useEffect(() => {
    // Set up community APIs
    (window as any).CommunityAPI = prepareAPI({
      farmId: gameService.state.context.farmId as number,
      jwt: rawToken,
      gameService,
    });

    // Set up moderator by looking if bumpkin has Halo hat equipped and Beta Pass in inventory
    const { wardrobe } = state;
    const isModerator = !!inventory["Beta Pass"] && !!wardrobe.Halo;

    isModerator ? setIsModerator(true) : setIsModerator(false); // I know i know this is a bit useless but useful for debugging rofl

    // Check if user is muted and if so, apply mute details to isMuted state
    // Removed for now, will be added back later in a next PR
  }, []);

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: AUTO,
      fps: {
        target: 30,
        smoothStep: true,
      },
      backgroundColor: "#000000",
      parent: "phaser-example",
      autoRound: true,
      pixelArt: true,
      plugins: {
        global: [
          {
            key: "rexNinePatchPlugin",
            plugin: NinePatchPlugin,
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
    };

    game.current = new Game({
      ...config,
      parent: "game-content",
    });

    game.current.registry.set("mmoService", mmoService); // LEGACY
    game.current.registry.set("gameState", gameService.state.context.state);
    game.current.registry.set("authService", authService);
    game.current.registry.set("gameService", gameService);
    game.current.registry.set("id", gameService.state.context.farmId);
    game.current.registry.set("initialScene", scene);
    game.current.registry.set("navigate", navigate);
    game.current.registry.set("selectedItem", selectedItem);
    game.current.registry.set("shortcutItem", shortcutItem);

    const listener = (e: EventObject) => {
      if (e.type === "bumpkin.equipped") {
        mmoService.state.context.server?.send(0, {
          clothing: (e as EquipBumpkinAction).equipment,
        });
      }
      if (e.type === "UPDATE_USERNAME") {
        mmoService.state.context.server?.send(0, {
          username: (e as UpdateUsernameEvent).username,
        });
      }
    };

    gameService.onEvent(listener);

    setLoaded(true);

    return () => {
      game.current?.destroy(true);
      gameService.off(listener);
    };
  }, []);

  // When server changes, update game registry
  useEffect(() => {
    game.current?.registry.set("mmoServer", mmoService.state.context.server);
  }, [mmoService.state.context.server]);

  // When selected item changes in context, update game registry
  useEffect(() => {
    game.current?.registry.set("selectedItem", selectedItem);
  }, [selectedItem]);

  // When route changes, switch scene
  useEffect(() => {
    if (!loaded || !route) return;

    const activeScene = game.current?.scene
      .getScenes(false)
      // Corn maze pauses when game is over so we need to filter for active and paused scenes.
      .filter((s) => s.scene.isActive() || s.scene.isPaused())[0];

    if (activeScene && activeScene.scene.key !== route) {
      activeScene.scene.start(route);
      mmoService.send("SWITCH_SCENE", { sceneId: route });
      mmoService.send("UPDATE_PREVIOUS_SCENE", {
        previousSceneId:
          game.current?.scene.getScenes(true)[0]?.scene.key ?? scene,
      });
    }
  }, [route]);

  useEffect(() => {
    // Listen to moderation events
    mmoService.state.context.server?.onMessage(
      "moderation_event",
      (event: ModerationEvent) => {
        const clientFarmId = gameService.state.context.farmId as number;
        if (!clientFarmId || clientFarmId !== event.farmId) return;

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
      },
    );

    // Update Messages on change
    mmoService.state.context.server?.state.messages.onChange(() => {
      const currentScene =
        game.current?.scene.getScenes(true)[0]?.scene.key ?? scene;

      const sceneMessages =
        mmoService.state.context.server?.state.messages.filter(
          (m) => m.sceneId === currentScene,
        ) as Message[];

      setMessages(
        sceneMessages.map((m) => ({
          farmId: m.farmId ?? 0,
          username: m.username,
          text: m.text,
          sessionId: m.sessionId,
          sceneId: m.sceneId,
          sentAt: m.sentAt,
        })) ?? [],
      );
      updateMessages();
    });

    // Update Players on change
    mmoService.state.context.server?.state.players.onChange(() => {
      const playersMap = mmoService.state.context.server?.state.players;

      if (playersMap) {
        setPlayers((currentPlayers) => {
          const updatedPlayers: Player[] = [];

          playersMap.forEach((player, playerId) => {
            const existingPlayer = currentPlayers.find(
              (p) => p.playerId === playerId,
            );

            // do we really need to update the player when they move?
            if (existingPlayer) {
              // Update existing player's data
              updatedPlayers.push({
                ...existingPlayer,
                x: player.x,
                y: player.y,
                clothing: player.clothing,
                moderation: player.moderation,
                sceneId: player.sceneId,
              });
            } else {
              // Add new player
              updatedPlayers.push({
                playerId,
                farmId: player.farmId,
                username: player.username,
                x: player.x,
                y: player.y,
                clothing: player.clothing,
                moderation: player.moderation,
                experience: player.experience,
                sceneId: player.sceneId,
              });
            }
          });

          // Remove players who left the server
          return updatedPlayers.filter((updatedPlayer) =>
            playersMap.has(updatedPlayer.playerId),
          );
        });
      }
    });

    mmoBus.listen((message) => {
      mmoService.state.context.server?.send(0, message);
    });
  }, [mmoService.state.context.server]);

  useEffect(() => {
    if (isMuted?.mutedUntil) {
      const interval = setInterval(() => {
        if (new Date().getTime() > isMuted.mutedUntil!) {
          setIsMuted(undefined);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isMuted]);

  useEffect(() => {
    const item = toastsList.filter((toast) => !toast.hidden)[0];

    if (item && item.difference.gt(0)) {
      mmoService.state.context.server?.send(0, {
        reaction: { reaction: item.item, quantity: item.difference.toNumber() },
      });
    }
  }, [toastsList]);

  // Listen to state change from trading -> playing
  const updateMessages = () => {
    // Load active scene in Phaser, otherwise fallback to route
    const currentScene =
      game.current?.scene.getScenes(true)[0]?.scene.key ?? scene;

    const sceneMessages =
      mmoService.state.context.server?.state.messages.filter(
        (m) => m.sceneId === currentScene,
      ) as Message[];

    const filteredMessages = sceneMessages.filter(
      (m) =>
        !JSON.parse(
          localStorage.getItem("plaza-settings.mutedFarmIds") ?? "[]",
        ).includes(m.farmId),
    );

    setMessages(
      filteredMessages.map((m) => ({
        farmId: m.farmId ?? 0,
        username: m.username,
        text: m.text,
        sessionId: m.sessionId,
        sceneId: m.sceneId,
        sentAt: m.sentAt,
      })) ?? [],
    );
  };

  const ref = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div id="game-content" ref={ref} />

      {/* Hud Components should all be inside here. - ie. components positioned absolutely to the window */}
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
            mmoService.state.context.server?.send(0, {
              text: m.text ?? "?",
            });
          }}
          onCommand={(name, args) => {
            handleCommand(name, args).then(updateMessages);
          }}
          messages={messages ?? []}
          isMuted={isMuted ? true : false}
          onReact={(reaction) => {
            mmoService.state.context.server?.send(0, {
              reaction: { reaction },
            });
          }}
          onBudPlace={(tokenId) => {
            mmoService.state.context.server?.send(0, {
              budId: tokenId,
            });
          }}
        />
        {isModerator && !isCommunity && (
          <ModerationTools
            scene={game.current?.scene.getScene(scene)}
            messages={messages ?? []}
            players={players ?? []}
            gameService={gameService}
          />
        )}

        <CommunityToasts />

        {mmoState === "connecting" && (
          <Label
            type="chill"
            icon={worldIcon}
            className="fixed z-10 top-2 left-1/2 -translate-x-1/2 flex items-center"
          >
            {t("mmo.connecting")}
          </Label>
        )}
        {mmoState === "error" && (
          <Label
            type="danger"
            icon={SUNNYSIDE.icons.cancel}
            className="fixed z-10 top-2 left-1/2 -translate-x-1/2 flex items-center cursor-pointer"
            onClick={() => mmoService.send("RETRY")}
          >
            {t("mmo.connectionFailed")}
          </Label>
        )}
      </HudContainer>

      {/* Modals */}

      {MuteEvent && (
        <Muted event={MuteEvent} onClose={() => setMuteEvent(undefined)} />
      )}

      {KickEvent && (
        <Kicked
          event={KickEvent}
          onClose={() => {
            setKickEvent(undefined);
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
      <CommunityModals />
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
    </div>
  );
};
