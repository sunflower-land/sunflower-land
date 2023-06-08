import React, { useContext, useEffect } from "react";
import { Game, AUTO } from "phaser";
import { useActor, useSelector } from "@xstate/react";
import { useInterpret } from "@xstate/react";
import NinePatchPlugin from "phaser3-rex-plugins/plugins/ninepatch-plugin.js";
import VirtualJoystickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin.js";

import * as AuthProvider from "features/auth/lib/Provider";
import { ChatUI } from "features/pumpkinPlaza/components/ChatUI";
import { OFFLINE_FARM } from "features/game/lib/landData";

import { PlazaScene } from "./scenes/PlazaScene";
import { AuctionScene } from "./scenes/AuctionHouseScene";

import { InteractableModals } from "./ui/InteractableModals";
import { NPCModals } from "./ui/NPCModals";
import { MachineInterpreter, MachineState, roomMachine } from "./roomMachine";
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
import { Balance } from "components/Balance";

const _roomState = (state: MachineState) => state.value;
const _messages = (state: MachineState) => {
  const messages = state.context.rooms[
    state.context.roomId
  ]?.state.messages.map((m) => ({
    sessionId: m.sessionId ?? "",
    text: m.text,
  }));

  // Pass so we are comparing a primitive in re-render
  return JSON.stringify(messages ?? []);
};

export const PhaserComponent: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const roomService = useInterpret(roomMachine, {
    context: {
      jwt: authState.context.user.rawToken,
      farmId: authState.context.user.farmId,
      bumpkin: gameState.context.state.bumpkin,
    },
  }) as unknown as MachineInterpreter;

  const roomState = useSelector(roomService, _roomState);
  const messages = JSON.parse(useSelector(roomService, _messages));

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: AUTO,
      fps: {
        target: 60,
        forceSetTimeOut: true,
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
      width: window.outerWidth,
      height: window.outerHeight,

      physics: {
        default: "arcade",
        arcade: {
          debug: true,
          gravity: { y: 0 },
        },
      },
      scene: [
        PlazaScene,
        AuctionScene,
        BettyHomeScene,
        TimmyHomeScene,
        BertScene,
        IgorHomeScene,
        WindmillFloorScene,
        ClothesShopScene,
        DecorationShopScene,
        WoodlandsScene,
      ],
      loader: {
        crossOrigin: "anonymous",
      },
    };

    const game = new Game({
      ...config,
      parent: "game-content",
    });

    game.registry.set("roomService", roomService);
  }, []);

  return (
    <div>
      <Balance balance={gameState.context.state.balance} />
      <div id="game-content" />
      <img id="imageTest" />
      <ChatUI
        game={OFFLINE_FARM}
        onMessage={(m) =>
          roomService.send("SEND_CHAT_MESSAGE", { text: m.text ?? "?" })
        }
        messages={messages ?? []}
      />
      <NPCModals />
      <InteractableModals />
      <Modal show={roomState === "initialising"} centered>
        <Panel>
          <p className="loading">Loading</p>
        </Panel>
      </Modal>

      <Modal show={roomState === "joinRoom"} centered>
        <Panel>
          <p className="loading">Loading</p>
        </Panel>
      </Modal>

      {roomState === "error" && (
        <InnerPanel className="fixed bottom-2 left-2 flex items-center">
          <img src={SUNNYSIDE.icons.sad} className="h-6 mr-2" />
          <div>
            <p className="text-xs">Connection failed</p>
            <p className="text-xxs underline cursor-pointer">Retry</p>
          </div>
        </InnerPanel>
      )}
    </div>
  );
};
