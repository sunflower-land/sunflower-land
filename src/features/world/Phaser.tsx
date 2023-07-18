import React, { useContext, useEffect, useRef, useState } from "react";
import { Game, AUTO } from "phaser";
import { useActor, useSelector } from "@xstate/react";
import NinePatchPlugin from "phaser3-rex-plugins/plugins/ninepatch-plugin.js";
import VirtualJoystickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin.js";

import * as AuthProvider from "features/auth/lib/Provider";
import { ChatUI, Message } from "features/pumpkinPlaza/components/ChatUI";

import { PlazaScene } from "./scenes/PlazaScene";
import { AuctionScene } from "./scenes/AuctionHouseScene";

import { InteractableModals } from "./ui/InteractableModals";
import { NPCModals } from "./ui/NPCModals";
import { MachineInterpreter, MachineState } from "./mmoMachine";
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
import { SceneId } from "./mmoMachine";

const _roomState = (state: MachineState) => state.value;

interface Props {
  scene: SceneId;
  isCommunity: boolean;
  mmoService: MachineInterpreter;
}

export const PhaserComponent: React.FC<Props> = ({
  scene,
  isCommunity,
  mmoService,
}) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const [messages, setMessages] = useState<Message[]>([]);
  const { gameService } = useContext(Context);

  const game = useRef<Game>();

  const mmoState = useSelector(mmoService, _roomState);

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

    mmoService.state.context.server?.state.messages.onChange(() => {
      console.log("SET");
      setMessages(
        mmoService.state.context.server?.state.messages.map((m) => ({
          farmId: m.farmId ?? 0,
          text: m.text,
          sessionId: m.sessionId,
        })) ?? []
      );
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
      <ChatUI
        onMessage={(m) => {
          mmoService.state.context.server?.send(0, { text: m.text ?? "?" });
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
    </div>
  );
};
