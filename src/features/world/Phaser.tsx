import React, { useContext, useEffect, useRef } from "react";
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
import { MarcusHomeScene } from "./scenes/MarcusHomeScene";
import { WorldIntroduction } from "./ui/WorldIntroduction";
import { CommunityScene } from "./scenes/CommunityScene";
import { CommunityModals } from "./ui/CommunityModalManager";

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
  isCommunity: boolean;
}

export const PhaserComponent: React.FC<Props> = ({ scene, isCommunity }) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const game = useRef<Game>();
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

  const scenes = isCommunity
    ? [CommunityScene]
    : [
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
        MarcusHomeScene,
      ];

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
      scene: scenes,
      loader: {
        crossOrigin: "anonymous",
      },
    };

    game.current = new Game({
      ...config,
      parent: "game-content",
    });

    game.current.registry.set("roomService", roomService);
    game.current.registry.set("gameService", gameService);
    game.current.registry.set("initialScene", scene);
    gameService.onEvent((e) => {
      if (e.type === "bumpkin.equipped") {
        roomService.send("CHANGE_CLOTHING", {
          clothing: (e as EquipBumpkinAction).equipment,
        });
      }
    });

    return () => {
      game.current?.destroy(true);
    };
  }, []);

  const ref = useRef<HTMLDivElement>(null);

  const pauseInput = () => {
    if (!game.current) {
      return;
    }
    game.current.input.enabled = false;
    if (game.current.input.keyboard) {
      game.current.input.keyboard.enabled = false;
      game.current.input.keyboard.clearCaptures();
    }
  };

  const resumeInput = () => {
    if (!game.current) {
      return;
    }

    game.current.input.enabled = true;
    if (game.current.input.keyboard) {
      game.current.input.keyboard.enabled = true;
      game.current.input.keyboard.clearCaptures();
    }
  };

  // Prevent Phaser events firing when interacting with HTML UI
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (!ref.current || !game.current) {
        return;
      }

      if (!ref.current.contains(event.target)) {
        pauseInput();
      } else {
        resumeInput();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [ref]);

  return (
    <div>
      <div id="game-content" ref={ref} />
      <img id="imageTest" />
      <ChatUI
        game={OFFLINE_FARM}
        onMessage={(m) => {
          roomService.send("SEND_CHAT_MESSAGE", { text: m.text ?? "?" });
          resumeInput(); // Focus on game again
        }}
        onChatStarted={() => {
          pauseInput();
        }}
        onChatClose={() => {
          resumeInput();
        }}
        messages={messages ?? []}
      />
      <NPCModals onClose={resumeInput} onOpen={pauseInput} />
      <CommunityModals onClose={resumeInput} onOpen={pauseInput} />
      <InteractableModals
        id={authState.context.user.farmId as number}
        onClose={resumeInput}
        onOpen={pauseInput}
      />
      <Modal
        show={roomState === "loading" || roomState === "initialising"}
        centered
      >
        <Panel>
          <p className="loading">Loading</p>
        </Panel>
      </Modal>

      <Modal show={roomState === "introduction"} centered>
        <WorldIntroduction roomService={roomService} />
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
          <img src={SUNNYSIDE.icons.sad} className="h-4 mr-1" />
          <div className="mb-0.5">
            <Label type="danger">Connection failed</Label>
          </div>
        </InnerPanel>
      )}
    </div>
  );
};
