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
import {
  MachineInterpreter,
  MachineState,
  RoomId,
  roomMachine,
} from "./roomMachine";
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
import { DawnBreakerScene } from "./scenes/DawnBreakerScene";
import { Label } from "components/ui/Label";

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

interface Props {
  scene: RoomId;
}
export const PhaserComponent: React.FC<Props> = ({ scene }) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const roomService = useInterpret(roomMachine, {
    context: {
      jwt: authState.context.user.rawToken,
      farmId: authState.context.user.farmId,
      bumpkin: gameState.context.state.bumpkin,
      roomId: scene,
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
      width: window.innerWidth,
      height: window.innerHeight,

      physics: {
        default: "arcade",
        arcade: {
          debug: true,
          gravity: { y: 0 },
        },
      },
      scene: [
        Preloader,
        DawnBreakerScene,
        PlazaScene,
        AuctionScene,
        WoodlandsScene,
        BettyHomeScene,
        TimmyHomeScene,
        BertScene,
        IgorHomeScene,
        WindmillFloorScene,
        ClothesShopScene,
        DecorationShopScene,
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
    game.registry.set("initialScene", scene);
    gameService.onEvent((e) => {
      if (e.type === "bumpkin.equipped") {
        roomService.send("CHANGE_CLOTHING", {
          clothing: (e as EquipBumpkinAction).equipment,
        });
      }
    });

    return () => {
      game.destroy(true);
    };
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
        messages={messages ?? []}
      />
      <NPCModals />
      <InteractableModals id={authState.context.user.farmId as number} />
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
        <InnerPanel
          className="fixed bottom-2 left-2 flex items-center cursor-pointer"
          onClick={() => roomService.send("RETRY")}
        >
          <img src={SUNNYSIDE.icons.sad} className="h-6 mr-2" />
          <div className="mb-0.5">
            <Label type="danger">Connection failed</Label>
            <p className="text-xxs underline cursor-pointer ml-0.5">Retry</p>
          </div>
        </InnerPanel>
      )}
    </div>
  );
};
