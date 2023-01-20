import React, { useContext, useEffect } from "react";
import { useActor, useInterpret } from "@xstate/react";
import { Modal } from "react-bootstrap";

import { Bumpkins } from "./components/Bumpkins";
import { websocketMachine, MachineInterpreter } from "./websocketMachine";
import { Panel } from "components/ui/Panel";
import * as AuthProvider from "features/auth/lib/Provider";
import background from "assets/land/pumpkin_plaza.png";

import { ChatUI } from "./components/ChatUI";
import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { DailyReward } from "./components/DailyReward";

export const PumpkinPlaza: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState, send] = useActor(authService);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const websocketService = useInterpret(websocketMachine, {
    context: {
      currentPosition: { x: 1200, y: 1400 },
      accountId: authState.context.farmId as number,
      jwt: authState.context.rawToken,
      bumpkin: gameState.context.state.bumpkin,
    },
  }) as unknown as MachineInterpreter;

  const [chatState] = useActor(websocketService);

  useEffect(() => {
    return () => {
      websocketService.send("DISCONNECT");
    };
  }, []);

  const walk = (e: React.MouseEvent<HTMLElement>) => {
    const scrollContainer = document.getElementsByClassName(
      "page-scroll-container"
    )[0];

    // const coords = getInitialCorodinates();
    console.log({
      scrolLeft: scrollContainer.scrollLeft,
      scrollTop: scrollContainer.scrollTop,
      height: scrollContainer.scrollHeight,
      pageX: e.pageX,
      pageY: e.pageY,
      clientX: e.clientX,
      clientY: e.clientY,
    });
    const x = e.pageX + scrollContainer.scrollLeft;
    const y = scrollContainer.scrollTop + e.pageY;

    websocketService.send("SEND_LOCATION", {
      coordinates: { x: x, y: y },
    });
  };

  console.log({
    discovries: chatState.context.discoveries,
  });

  // Load data
  return (
    <div
      className="relative"
      style={{
        width: `${60 * GRID_WIDTH_PX}px`,
        height: `${40 * GRID_WIDTH_PX}px`,
      }}
      // TODO dynamic game board size based on tile dimensions
    >
      <img
        src={background}
        className="h-auto absolute"
        style={{
          width: `${60 * GRID_WIDTH_PX}px`,
          height: `${40 * GRID_WIDTH_PX}px`,
        }}
      />
      <div className="absolute inset-0" onClick={walk}>
        <Modal
          show={
            chatState.matches("initialising") || chatState.matches("connecting")
          }
          centered
        >
          <Panel>
            <span className="loading">Connecting</span>
          </Panel>
        </Modal>

        <Modal show={chatState.matches("loadingPlayers")} centered>
          <Panel>
            <span className="loading">Loading Players</span>
          </Panel>
        </Modal>

        <Modal show={chatState.matches("disconnected")} centered>
          <Panel>
            <span>Disconnected</span>
          </Panel>
        </Modal>
        <Modal show={chatState.matches("error")} centered>
          <Panel>
            <span>Error</span>
          </Panel>
        </Modal>

        <Bumpkins
          messages={chatState.context.messages}
          discoveries={chatState.context.discoveries}
          bumpkin={chatState.context.bumpkin}
          websocketService={websocketService}
          position={chatState.context.currentPosition}
          bumpkins={chatState.context.bumpkins}
          onVisit={(id) => gameService.send({ type: "VISIT", landId: id })}
        />
      </div>

      <DailyReward />
      <ChatUI
        onMessage={({ reaction, text }) => {
          websocketService.send("SEND_CHAT_MESSAGE", {
            text,
            reaction,
          });
        }}
        game={chatState.context.game}
      />
      {/* )} */}
    </div>
  );
};
