import React, { useContext, useEffect, useRef, useState } from "react";
import { Game, AUTO } from "phaser";
import NinePatchPlugin from "phaser3-rex-plugins/plugins/ninepatch-plugin.js";
import VirtualJoystickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin.js";

import { Preloader } from "features/world/scenes/Preloader";
import { PortalContext } from "./lib/PortalProvider";
import { useActor } from "@xstate/react";
import { PokerHouseScene } from "./PokerHouseScene";
import { InteractableModals } from "features/world/ui/InteractableModals";
import { ChatUI, Message } from "features/pumpkinPlaza/components/ChatUI";

export const PokerHousePhaser: React.FC = () => {
  const { portalService } = useContext(PortalContext);
  const [portalState] = useActor(portalService);

  const [loaded, setLoaded] = useState(false);

  const game = useRef<Game>();

  const scene = "poker_house";

  const scenes = [Preloader, PokerHouseScene];

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Update Messages on change
    portalState.context.mmoServer?.state.messages.onChange(() => {
      const currentScene =
        game.current?.scene.getScenes(true)[0]?.scene.key ?? scene;

      const sceneMessages =
        portalState.context.mmoServer?.state.messages.filter(
          (m) => m.sceneId === currentScene
        ) as Message[];

      setMessages(
        sceneMessages.map((m) => ({
          farmId: m.farmId ?? 0,
          username: m.username,
          text: m.text,
          sessionId: m.sessionId,
          sceneId: m.sceneId,
          sentAt: m.sentAt,
        })) ?? []
      );
      updateMessages();
    });

    const updateMessages = () => {
      // Load active scene in Phaser, otherwise fallback to route
      const currentScene =
        game.current?.scene.getScenes(true)[0]?.scene.key ?? scene;

      const sceneMessages =
        portalState.context.mmoServer?.state.messages.filter(
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
          username: m.username,
          text: m.text,
          sessionId: m.sessionId,
          sceneId: m.sceneId,
          sentAt: m.sentAt,
        })) ?? []
      );
    };
  }, [portalState.context.mmoServer]);

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

    game.current.registry.set("initialScene", scene);
    game.current.registry.set("gameState", portalState.context.state);
    game.current.registry.set("id", portalState.context.id);
    game.current.registry.set("mmoServer", portalState.context.mmoServer);

    setLoaded(true);

    return () => {
      game.current?.destroy(true);
    };
  }, []);

  const ref = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div id="game-content" ref={ref} />
      <InteractableModals scene="plaza" id={portalState.context.id} />

      <ChatUI
        farmId={portalState.context.id}
        gameState={portalState.context.state}
        scene={scene}
        onMessage={(m) => {
          portalState.context.mmoServer?.send(0, {
            text: m.text ?? "?",
          });
        }}
        onCommand={(name, args) => {
          console.log("command", name, args);
        }}
        messages={messages ?? []}
        isMuted={false}
        onReact={(reaction) => {
          portalState.context.mmoServer?.send(0, {
            reaction,
          });
        }}
        onBudPlace={(tokenId) => {
          portalState.context.mmoServer?.send(0, {
            budId: tokenId,
          });
        }}
      />
    </div>
  );
};
