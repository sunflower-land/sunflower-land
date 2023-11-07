import React, { useContext, useEffect, useRef, useState } from "react";
import { Game, AUTO } from "phaser";
import { useActor, useSelector } from "@xstate/react";
import NinePatchPlugin from "phaser3-rex-plugins/plugins/ninepatch-plugin.js";
import VirtualJoystickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin.js";

import * as AuthProvider from "features/auth/lib/Provider";
import { ChatUI, Message } from "features/pumpkinPlaza/components/ChatUI";
import { ModerationTools } from "./ui/moderationTools/ModerationTools";

import { Kicked } from "./ui/moderationTools/components/Kicked";
import {
  Muted,
  calculateMuteTime,
} from "./ui/moderationTools/components/Muted";

import { PlazaScene } from "./scenes/PlazaScene";
import { AuctionScene } from "./scenes/AuctionHouseScene";

import { InteractableModals } from "./ui/InteractableModals";
import { NPCModals } from "./ui/NPCModals";
import { MachineInterpreter, MachineState, mmoBus } from "./mmoMachine";
import { Context } from "features/game/GameProvider";
import { Modal } from "react-bootstrap";
import { InnerPanel, Panel } from "components/ui/Panel";
import { ClothesShopScene } from "./scenes/ClothesShopScene";
import { DecorationShopScene } from "./scenes/DecorationShop";
import { WindmillFloorScene } from "./scenes/WindmillFloorScene";
import { IgorHomeScene } from "./scenes/IgorHomeScene";
import { BertScene } from "./scenes/BertRoomScene";
import { TimmyHomeScene } from "./scenes/TimmyHomeScene";
import { BettyHomeScene } from "./scenes/BettyHomeScene";
import { WoodlandsScene } from "./scenes/WoodlandsScene";
import { SUNNYSIDE } from "assets/sunnyside";
import { Preloader } from "./scenes/Preloader";
import { EquipBumpkinAction } from "features/game/events/landExpansion/equip";
import { Label } from "components/ui/Label";
import { WorldIntroduction } from "./ui/WorldIntroduction";
import { CommunityScene } from "./scenes/CommunityScene";
import { CommunityModals } from "./ui/CommunityModalManager";
import { CommunityToasts } from "./ui/CommunityToastManager";
import { SceneId } from "./mmoMachine";
import { useNavigate } from "react-router-dom";
import { PlayerModals } from "./ui/PlayerModals";
import { prepareAPI } from "features/community/lib/CommunitySDK";
import { TradeCompleted } from "./ui/TradeCompleted";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";

import SoundOffIcon from "assets/icons/sound_off.png";
import { handleCommand } from "./lib/chatCommands";
import { Moderation } from "features/game/lib/gameMachine";
import { BeachScene } from "./scenes/BeachScene";
import { HalloweenScene } from "./scenes/HalloweenScene";
import { hasFeatureAccess } from "lib/flags";
import { Inventory } from "features/game/types/game";

const _roomState = (state: MachineState) => state.value;

type Player = {
  playerId: string;
  farmId: number;
  clothing: BumpkinParts;
  x: number;
  y: number;
  moderation?: Moderation;
};

export type ModerationEvent = {
  type: "kick" | "mute";
  farmId: number;
  reason: string;
  mutedUntil?: number;
};

interface Props {
  scene: SceneId;
  isCommunity: boolean;
  mmoService: MachineInterpreter;
  inventory: Inventory;
}

export const PhaserComponent: React.FC<Props> = ({
  scene,
  isCommunity,
  mmoService,
  inventory,
}) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const [messages, setMessages] = useState<Message[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isModerator, setIsModerator] = useState(false);
  const { gameService } = useContext(Context);

  const [isMuted, setIsMuted] = useState<ModerationEvent | undefined>();

  const [MuteEvent, setMuteEvent] = useState<ModerationEvent | undefined>();
  const [KickEvent, setKickEvent] = useState<ModerationEvent | undefined>();

  const [loaded, setLoaded] = useState(false);

  const navigate = useNavigate();

  const game = useRef<Game>();

  const mmoState = useSelector(mmoService, _roomState);

  const scenes = isCommunity
    ? [CommunityScene]
    : [
        Preloader,
        AuctionScene,
        WoodlandsScene,
        BettyHomeScene,
        TimmyHomeScene,
        BertScene,
        IgorHomeScene,
        WindmillFloorScene,
        ClothesShopScene,
        DecorationShopScene,
        BeachScene,
        ...(hasFeatureAccess(gameService.state.context.state, "HALLOWEEN")
          ? [HalloweenScene]
          : [PlazaScene]),
      ];

  useEffect(() => {
    // Set up community APIs
    (window as any).CommunityAPI = prepareAPI({
      farmId: authState.context.user.farmId as number,
      jwt: authState.context.user.rawToken as string,
      gameService: gameService,
    });

    // Set up moderator by looking if bumpkin has Halo hat equipped
    const bumpkin = gameService.state.context.state.bumpkin;
    bumpkin?.equipped?.hat === "Halo"
      ? setIsModerator(true)
      : setIsModerator(false);

    // Check if user is muted and if so, apply mute details to isMuted state
    const userModLogs = gameService.state.context.moderation;

    if (userModLogs.muted.length > 0) {
      const latestMute = userModLogs.muted.sort(
        (a, b) => a.mutedUntil - b.mutedUntil
      )[0];

      if (latestMute.mutedUntil > new Date().getTime()) {
        setIsMuted({
          type: "mute",
          farmId: authState.context.user.farmId as number,
          reason: latestMute.reason,
          mutedUntil: latestMute.mutedUntil,
        });
      }
    }
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
      },
      width: window.innerWidth,
      height: window.innerHeight,

      physics: {
        default: "arcade",
        arcade: {
          debug: true,
          gravity: { y: 0 },
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

    game.current.registry.set("mmoService", mmoService);
    game.current.registry.set("gameService", gameService);
    game.current.registry.set("initialScene", scene);
    gameService.onEvent((e) => {
      if (e.type === "bumpkin.equipped") {
        mmoService.state.context.server?.send(0, {
          clothing: (e as EquipBumpkinAction).equipment,
        });
      }
    });

    setLoaded(true);

    return () => {
      game.current?.destroy(true);
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const activeScene = game.current?.scene
      .getScenes(false)
      // Corn maze pauses when game is over so we need to filter for active and paused scenes.
      .filter((s) => s.scene.isActive() || s.scene.isPaused())[0];

    if (activeScene) {
      activeScene.scene.start(scene);
      mmoService.state.context.server?.send(0, { sceneId: scene });
    }
  }, [scene]);

  useEffect(() => {
    // Listen to moderation events
    mmoService.state.context.server?.onMessage(
      "moderation_event",
      (event: ModerationEvent) => {
        const clientFarmId = authState.context.user.farmId as number;
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
      }
    );

    // Update Messages on change
    mmoService.state.context.server?.state.messages.onChange(() => {
      const currentScene =
        game.current?.scene.getScenes(true)[0]?.scene.key ?? scene;

      const sceneMessages =
        mmoService.state.context.server?.state.messages.filter(
          (m) => m.sceneId === currentScene
        ) as Message[];

      setMessages(
        sceneMessages.map((m) => ({
          farmId: m.farmId ?? 0,
          text: m.text,
          sessionId: m.sessionId,
          sceneId: m.sceneId,
          sentAt: m.sentAt,
        })) ?? []
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
              (p) => p.playerId === playerId
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
              });
            } else {
              // Add new player
              updatedPlayers.push({
                playerId,
                farmId: player.farmId,
                x: player.x,
                y: player.y,
                clothing: player.clothing,
                moderation: player.moderation,
              });
            }
          });

          // Remove players who left the server
          return updatedPlayers.filter((updatedPlayer) =>
            playersMap.has(updatedPlayer.playerId)
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

  // Listen to state change from trading -> playing
  const updateMessages = () => {
    // Load active scene in Phaser, otherwise fallback to route
    const currentScene =
      game.current?.scene.getScenes(true)[0]?.scene.key ?? scene;

    const sceneMessages =
      mmoService.state.context.server?.state.messages.filter(
        (m) => m.sceneId === currentScene
      ) as Message[];

    const filteredMessages = sceneMessages.filter(
      (m) =>
        !JSON.parse(
          localStorage.getItem("plaza-settings.mutedFarmIds") ?? "[]"
        ).includes(m.farmId)
    );

    setMessages(
      filteredMessages.map((m) => ({
        farmId: m.farmId ?? 0,
        text: m.text,
        sessionId: m.sessionId,
        sceneId: m.sceneId,
        sentAt: m.sentAt,
      })) ?? []
    );
  };

  const ref = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div id="game-content" ref={ref} />

      {MuteEvent && (
        <Muted event={MuteEvent} onClose={() => setMuteEvent(undefined)} />
      )}

      {KickEvent && (
        <Kicked
          event={KickEvent}
          onClose={() => {
            setKickEvent(undefined);
            navigate(`/land/${authState.context.user.farmId}`);
          }}
        />
      )}

      <ChatUI
        farmId={authState.context.user.farmId as number}
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
      />
      {isModerator && !isCommunity && (
        <ModerationTools
          scene={game.current?.scene.getScene(scene)}
          messages={messages ?? []}
          players={players ?? []}
        />
      )}
      <NPCModals
        scene={scene}
        onNavigate={(sceneId: SceneId) => {
          navigate(`/world/${sceneId}`);
        }}
      />
      <PlayerModals />
      <TradeCompleted
        mmoService={mmoService}
        farmId={authState.context.user.farmId as number}
      />
      <CommunityModals />
      <CommunityToasts />
      <InteractableModals id={authState.context.user.farmId as number} />
      <Modal
        show={mmoState === "loading" || mmoState === "initialising"}
        centered
      >
        <Panel>
          <p className="loading">Loading</p>
        </Panel>
      </Modal>
      <Modal show={mmoState === "introduction"} centered>
        <WorldIntroduction onClose={() => mmoService.send("CONTINUE")} />
      </Modal>
      <Modal show={mmoState === "joinRoom"} centered>
        <Panel>
          <p className="loading">Loading</p>
        </Panel>
      </Modal>
      {mmoState === "error" && (
        <InnerPanel
          className="fixed top-2 left-1/2 -translate-x-1/2 flex items-center cursor-pointer"
          onClick={() => mmoService.send("RETRY")}
        >
          <img src={SUNNYSIDE.icons.sad} className="h-4 mr-1" />
          <div className="mb-0.5">
            <Label type="danger">Connection failed</Label>
          </div>
        </InnerPanel>
      )}

      {isMuted && (
        <InnerPanel className="fixed top-2 left-1/2 -translate-x-1/2 flex items-center cursor-pointer">
          <img src={SoundOffIcon} className="h-8 mr-2 ml-1" />
          <div className="flex flex-col p-1">
            <span className="text-sm">You are muted</span>
            <span className="text-xxs">
              You will be able to chat again in{" "}
              {isMuted.mutedUntil
                ? calculateMuteTime(isMuted.mutedUntil, "remaining")
                : "Unknown"}
            </span>
          </div>
        </InnerPanel>
      )}
    </div>
  );
};
