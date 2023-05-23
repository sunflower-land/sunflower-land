import React, { useEffect } from "react";
import { Game, AUTO } from "phaser";
import { Modal } from "react-bootstrap";
import { useSelector } from "@xstate/react";
import { useInterpret } from "@xstate/react";
import NinePatchPlugin from "phaser3-rex-plugins/plugins/ninepatch-plugin.js";

import { Panel } from "components/ui/Panel";

import { ChatUI } from "features/pumpkinPlaza/components/ChatUI";
import { OFFLINE_FARM } from "features/game/lib/landData";

import { PhaserScene } from "./scenes/PlazaScene";
import { AuctionScene } from "./scenes/AuctionHouseScene";

import { InteractableModals } from "./ui/InteractableModals";
import { NPCModals } from "./ui/NPCModals";
import { MachineInterpreter, MachineState, roomMachine } from "./roomMachine";

const _roomState = (state: MachineState) => state.value;

export const Phaser: React.FC = () => {
  const roomService = useInterpret(roomMachine, {
    context: {},
  }) as unknown as MachineInterpreter;

  const roomState = useSelector(roomService, _roomState);

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: AUTO,
      fps: {
        target: 60,
        forceSetTimeOut: true,
        smoothStep: true,
      },
      backgroundColor: "#099fe0",
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
      scene: [AuctionScene, PhaserScene],
      loader: {
        crossOrigin: "anonymous",
      },
    };

    const game = new Game({
      ...config,
      parent: "game-content",
    });

    // Manually inject onto scenes so we have access to it
    (game as any).roomService = roomService;
  }, []);

  return (
    <div>
      <div id="game-content" />
      <img id="imageTest" />
      <ChatUI
        game={OFFLINE_FARM}
        onMessage={(m) =>
          roomService.send("SEND_CHAT_MESSAGE", { text: m.text ?? "?" })
        }
      />
      <NPCModals />
      <InteractableModals />
      <Modal show={roomState === "initialising"} centered>
        <Panel>Loading</Panel>
      </Modal>
    </div>
  );
};
