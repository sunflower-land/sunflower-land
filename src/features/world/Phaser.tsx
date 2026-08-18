/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useRef, useState } from "react";
import { Game, AUTO } from "phaser";
import { useSelector } from "@xstate/react";
import NinePatch2Plugin from "phaser3-rex-plugins/plugins/ninepatch2-plugin.js";
import VirtualJoystickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin.js";
import { PhaserNavMeshPlugin } from "phaser-navmesh";

import * as AuthProvider from "features/auth/lib/Provider";

import { PlazaScene } from "./scenes/PlazaScene";

import { InteractableModals } from "./ui/InteractableModals";
import { NPCModals } from "./ui/NPCModals";
import {
  type MachineInterpreter,
  type MachineState,
  mmoBus,
  type SceneId,
} from "./mmoMachine";
import { Context } from "features/game/GameProvider";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { Preloader } from "./scenes/Preloader";
import type { EquipBumpkinAction } from "features/game/events/landExpansion/equip";
import { Label } from "components/ui/Label";
import { CommunityModals } from "./ui/CommunityModalManager";
import { CommunityToasts } from "./ui/CommunityToastManager";
import { useLocation, useNavigate } from "react-router";
import { prepareAPI } from "features/community/lib/CommunitySDK";

import type { UpdateUsernameEvent } from "features/game/lib/gameMachine";
import { BeachScene } from "./scenes/BeachScene";
import type { Inventory } from "features/game/types/game";
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
import type { EventObject } from "xstate";
import { ToastContext } from "features/game/toast/ToastProvider";
import type { AuthMachineState } from "features/auth/lib/authMachine";
import { InfernosScene } from "./scenes/InferniaScene";
import { PlayerSelectionList } from "./ui/PlayerSelectionList";
import { StreamScene } from "./scenes/StreamScene";
import { LoveIslandScene } from "./scenes/LoveIslandScene";
import { hasFeatureAccess } from "lib/flags";
import { WorldHud } from "features/island/hud/WorldHud";
import { PlayerModal } from "features/social/PlayerModal";
import type { MachineState as GameMachineState } from "features/game/lib/gameMachine";
import { RewardModal } from "features/social/RewardModal";
import { WaveModal } from "features/social/WaveModal";
import { Discovery } from "features/social/Discovery";
import { SPAWNS, type SpawnFromId } from "./lib/spawn";
import { PlayerInteractionMenu } from "./ui/player/PlayerInteractionMenu";

const _roomState = (state: MachineState) => state.value;
const _scene = (state: MachineState) => state.context.sceneId;

const _rawToken = (state: AuthMachineState) =>
  state.context.user.rawToken ?? "";

export type Message = {
  farmId: number;
  username: string;
  sessionId: string;
  text: string;
  sceneId: SceneId;
  sentAt: number;
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

  const [loaded, setLoaded] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

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
    // Consumed once by the first BaseScene to compute its spawn — see
    // BaseScene.create(). Lets a navigation like
    // navigate("/world/beach", { state: { previousSceneId: "digging" } })
    // pick the right SPAWNS entry on the very first scene load, not just
    // on subsequent route changes.
    const bootPreviousSceneId = (
      location.state as { previousSceneId?: SpawnFromId } | null
    )?.previousSceneId;
    if (bootPreviousSceneId) {
      game.current.registry.set("initialPreviousSceneId", bootPreviousSceneId);
    }
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

  const previousSceneOverride = (
    location.state as { previousSceneId?: SpawnFromId } | null
  )?.previousSceneId;

  // When route changes, switch scene
  useEffect(() => {
    if (!loaded || !route) return;

    const activeScene = game.current?.scene
      .getScenes(false)
      // Corn maze pauses when game is over so we need to filter for active and paused scenes.
      .filter((s) => s.scene.isActive() || s.scene.isPaused())[0];

    // The auto-derived previous scene is always a real SceneId — used both
    // as the SPAWNS lookup key (when no override is supplied) and as the
    // value sent to the mmo machine on SWITCH_SCENE.
    const autoDerivedPreviousSceneId =
      (game.current?.scene.getScenes(true)[0]?.scene.key as SceneId) ?? scene;
    // The spawn-lookup key may be a non-scene sentinel like "digging" or
    // "default" supplied via location.state.
    const spawnFromKey = previousSceneOverride ?? autoDerivedPreviousSceneId;
    const spawn = SPAWNS()[route][spawnFromKey] ?? SPAWNS()[route].default;

    if (activeScene && activeScene.scene.key !== route) {
      // Stash the override so the destination scene's BaseScene.create() can
      // resolve the same SPAWNS entry we just resolved here. Without this,
      // create() would only see mmoService.context.previousSceneId (the
      // auto-derived SceneId) and pick the wrong spawn for sentinels like
      // "digging" or "default".
      if (previousSceneOverride) {
        game.current?.registry.set(
          "initialPreviousSceneId",
          previousSceneOverride,
        );
      }

      activeScene.scene.start(route);
      mmoService.send("SWITCH_SCENE", {
        sceneId: route,
        previousSceneId: autoDerivedPreviousSceneId,
        playerCoordinates: {
          x: spawn.x,
          y: spawn.y,
        },
      });
    } else if (activeScene && previousSceneOverride) {
      // Same-scene teleport: caller asked for a specific spawn while already
      // in this scene. Move the local player; the existing position-sync loop
      // broadcasts the new position to the server.
      const baseScene = activeScene as unknown as {
        currentPlayer?: { setPosition: (x: number, y: number) => void };
      };
      baseScene.currentPlayer?.setPosition(spawn.x, spawn.y);
    }
  }, [route, location.key, previousSceneOverride]);

  useEffect(() => {
    // NOTE: this used to also subscribe to `state.messages.onChange` and
    // `state.players.onChange`, rebuilding React arrays of every message and
    // every player on EVERY patch (20x/sec) and re-rendering the HUD each time.
    // Both existed only to feed the moderation tools, which have been removed.
    mmoBus.listen((message) => {
      mmoService.getSnapshot().context.server?.send(0, message);
    });
  }, [mmoService.getSnapshot().context.server]);

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

  const ref = useRef<HTMLDivElement>(null);

  return (
    <div>
      <WorldHud
        scene={scene}
        server={mmoService.getSnapshot().context.server?.name}
      />
      <div id="game-content" ref={ref} />

      {/* Hud Components should all be inside here. - ie. components positioned absolutely to the window */}
      <HudContainer>
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
            onClick={() => mmoService.send("RETRY")}
          >
            {t("mmo.connectionFailed")}
          </Label>
        )}
      </HudContainer>

      {/* Modals */}
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
