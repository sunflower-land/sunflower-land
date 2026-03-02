/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef, useState } from "react";
import { Game, AUTO } from "phaser";
import { useSelector } from "@xstate/react";
import NinePatch2Plugin from "phaser3-rex-plugins/plugins/ninepatch2-plugin.js";
import VirtualJoystickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin.js";
import { PhaserNavMeshPlugin } from "phaser-navmesh";

import * as AuthProvider from "features/auth/lib/Provider";

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
import { SUNNYSIDE } from "assets/sunnyside";
import { Preloader } from "./scenes/Preloader";
import { EquipBumpkinAction } from "features/game/events/landExpansion/equip";
import { Label } from "components/ui/Label";
import { CommunityModals } from "./ui/CommunityModalManager";
import { CommunityToasts } from "./ui/CommunityToastManager";
import { useNavigate } from "react-router";
import { prepareAPI } from "features/community/lib/CommunitySDK";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";

import SoundOffIcon from "assets/icons/sound_off.png";
import { Moderation, UpdateUsernameEvent } from "features/game/lib/gameMachine";
import { BeachScene } from "./scenes/BeachScene";
import { Inventory } from "features/game/types/game";
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
import { InfernosScene } from "./scenes/InferniaScene";
import { PlayerSelectionList } from "./ui/PlayerSelectionList";
import { StreamScene } from "./scenes/StreamScene";
import { LoveIslandScene } from "./scenes/LoveIslandScene";
import { hasFeatureAccess } from "lib/flags";
import { WorldHud } from "features/island/hud/WorldHud";
import { PlayerModal } from "features/social/PlayerModal";
import { MachineState as GameMachineState } from "features/game/lib/gameMachine";
import { RewardModal } from "features/social/RewardModal";
import { WaveModal } from "features/social/WaveModal";
import { Discovery } from "features/social/Discovery";
import { SPAWNS } from "./lib/spawn";
import { PlayerInteractionMenu } from "./ui/player/PlayerInteractionMenu";

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

export type Message = {
  farmId: number;
  username: string;
  sessionId: string;
  text: string;
  sceneId: SceneId;
  sentAt: number;
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

const _loggedInFarmId = (state: GameMachineState) =>
  state.context.visitorId ? state.context.visitorId : state.context.farmId;
const _state = (state: GameMachineState) => state.context.state;

export const PhaserComponent: React.FC<Props> = ({ mmoService, route }) => {
  const { t } = useAppTranslation();

  const { authService } = useContext(AuthProvider.Context);
  const { gameService, selectedItem, shortcutItem } = useContext(Context);
  const { toastsList } = useContext(ToastContext);

  const loggedInFarmId = useSelector(gameService, _loggedInFarmId);
  const state = useSelector(gameService, _state);

  const [messages, setMessages] = useState<Message[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isMuted, setIsMuted] = useState<ModerationEvent | undefined>();
  const [MuteEvent, setMuteEvent] = useState<ModerationEvent | undefined>();
  const [KickEvent, setKickEvent] = useState<ModerationEvent | undefined>();
  const [loaded, setLoaded] = useState(false);

  const navigate = useNavigate();

  const game = useRef<Game>(undefined);

  const mmoState = useSelector(mmoService, _roomState);
  const scene = useSelector(mmoService, _scene);
  const rawToken = useSelector(authService, _rawToken);

  const scenes = [
    Preloader,
    BeachScene,
    PlazaScene,
    RetreatScene,
    KingdomScene,
    GoblinHouseScene,
    SunflorianHouseScene,
    NightshadeHouseScene,
    BumpkinHouseScene,
    ExampleAnimationScene,
    ExampleRPGScene,
    InfernosScene,
    StreamScene,
    LoveIslandScene,
  ];

  useEffect(() => {
    // Set up community APIs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).CommunityAPI = prepareAPI({
      farmId: loggedInFarmId,
      jwt: rawToken,
      gameService,
    });
  }, []);

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: AUTO,
      fps: { target: 30, smoothStep: true },
      backgroundColor: "#000000",
      parent: "phaser-example",
      autoRound: true,
      pixelArt: true,
      plugins: {
        global: [
          { key: "rexNinePatch2Plugin", plugin: NinePatch2Plugin, start: true },
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
        arcade: { debug: true, gravity: { x: 0, y: 0 } },
      },
      scene: scenes,
      loader: { crossOrigin: "anonymous" },
    };

    game.current = new Game({ ...config, parent: "game-content" });

    game.current.registry.set("mmoService", mmoService); // LEGACY
    game.current.registry.set("gameState", state);
    game.current.registry.set("authService", authService);
    game.current.registry.set("gameService", gameService);
    game.current.registry.set("id", loggedInFarmId);
    game.current.registry.set("initialScene", scene);
    game.current.registry.set("navigate", navigate);
    game.current.registry.set("selectedItem", selectedItem);
    game.current.registry.set("shortcutItem", shortcutItem);

    const listener = (e: EventObject) => {
      if (e.type === "bumpkin.equipped") {
        mmoService.getSnapshot().context.server?.send(0, {
          clothing: (e as EquipBumpkinAction).equipment,
        });
      }
      if (e.type === "UPDATE_USERNAME") {
        mmoService.getSnapshot().context.server?.send(0, {
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

  // Keep game state in sync with React state (e.g. after completing a delivery)
  useEffect(() => {
    if (!game.current) return;
    game.current.registry.set("gameState", state);
    game.current.events.emit("gameStateUpdated");
  }, [state]);

  // When server changes, update game registry
  useEffect(() => {
    game.current?.registry.set(
      "mmoServer",
      mmoService.getSnapshot().context.server,
    );
  }, [mmoService.getSnapshot().context.server]);

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

    const previousSceneId =
      (game.current?.scene.getScenes(true)[0]?.scene.key as SceneId) ?? scene;
    const spawn = SPAWNS()[route][previousSceneId] ?? SPAWNS()[route].default;

    if (activeScene && activeScene.scene.key !== route) {
      activeScene.scene.start(route);
      mmoService.send("SWITCH_SCENE", {
        sceneId: route,
        previousSceneId,
        playerCoordinates: {
          x: spawn.x,
          y: spawn.y,
        },
      });
    }
  }, [route]);

  useEffect(() => {
    // Listen to moderation events
    mmoService
      .getSnapshot()
      .context.server?.onMessage(
        "moderation_event",
        (event: ModerationEvent) => {
          const clientFarmId = loggedInFarmId;
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
    mmoService.getSnapshot().context.server?.state.messages.onChange(() => {
      const currentScene =
        game.current?.scene.getScenes(true)[0]?.scene.key ?? scene;

      const sceneMessages = mmoService
        .getSnapshot()
        .context.server?.state.messages.filter(
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
    mmoService.getSnapshot().context.server?.state.players.onChange(() => {
      const playersMap = mmoService.getSnapshot().context.server?.state.players;

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
      mmoService.getSnapshot().context.server?.send(0, message);
    });
  }, [mmoService.getSnapshot().context.server]);

  useEffect(() => {
    if (isMuted?.mutedUntil) {
      const { mutedUntil } = isMuted;
      const interval = setInterval(() => {
        if (new Date().getTime() > mutedUntil) {
          setIsMuted(undefined);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isMuted]);

  useEffect(() => {
    const item = toastsList.filter((toast) => !toast.hidden)[0];

    if (item && item.difference.gt(0)) {
      mmoService.getSnapshot().context.server?.send(0, {
        reaction: {
          reaction: item.item,
          quantity: item.difference.toNumber(),
        },
      });
    }
  }, [toastsList]);

  // Listen to state change from trading -> playing
  const updateMessages = () => {
    // Load active scene in Phaser, otherwise fallback to route
    const currentScene =
      game.current?.scene.getScenes(true)[0]?.scene.key ?? scene;

    const sceneMessages = mmoService
      .getSnapshot()
      .context.server?.state.messages.filter(
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
      <WorldHud
        scene={scene}
        server={mmoService.getSnapshot().context.server?.name}
        messages={messages}
        players={players}
      />
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

        <CommunityToasts />
        <PlayerInteractionMenu />

        {mmoState === "connecting" && (
          <Label
            type="chill"
            icon={SUNNYSIDE.icons.worldIcon}
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
            onClick={() => mmoService.send({ type: "RETRY" })}
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

      <NPCModals id={loggedInFarmId} />
      <PlayerSelectionList />
      <PlayerModal
        loggedInFarmId={loggedInFarmId}
        token={rawToken}
        hasAirdropAccess={hasFeatureAccess(state, "AIRDROP_PLAYER")}
      />
      <Discovery />
      <RewardModal />
      <WaveModal />
      <CommunityModals />
      <InteractableModals id={loggedInFarmId} scene={scene} key={scene} />
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
