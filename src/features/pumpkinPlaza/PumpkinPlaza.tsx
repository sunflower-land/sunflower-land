import React, { useContext, useEffect, useLayoutEffect } from "react";
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
import { IslandTravel } from "features/game/expansion/components/travel/IslandTravel";
import { randomInt } from "lib/utils/random";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { Hud } from "features/island/hud/Hud";

// Spawn players in different areas
const randomXOffset = randomInt(0, 50);
const randomYOffset = randomInt(0, 50);
export const PumpkinPlaza: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState, send] = useActor(authService);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [scrollIntoView] = useScrollIntoView();

  useLayoutEffect(() => {
    // Start with plaza centered
    scrollIntoView(Section.PumpkinPlazaBackGround, "auto");
  }, []);

  const websocketService = useInterpret(websocketMachine, {
    context: {
      currentPosition: { x: 1680 + randomXOffset, y: 1880 + randomYOffset },
      accountId: authState.context.farmId as number,
      jwt: authState.context.rawToken,
      bumpkin: gameState.context.state.bumpkin,
    },
  }) as unknown as MachineInterpreter;

  const [chatState] = useActor(websocketService);

  console.log({ state: chatState.value });
  useEffect(() => {
    return () => {
      console.log("Time to disconnect!");
      websocketService.send("DISCONNECT");
    };
  }, []);

  const walk = (e: React.MouseEvent<HTMLElement>) => {
    const scrollContainer = document.getElementsByClassName(
      "page-scroll-container"
    )[0];

    const x = e.pageX + scrollContainer.scrollLeft;
    const y = scrollContainer.scrollTop + e.pageY;

    websocketService.send("SEND_LOCATION", {
      coordinates: { x: x, y: y },
    });
  };

  // Load data
  return (
    <>
      <div
        className="absolute"
        style={{
          width: `${84 * GRID_WIDTH_PX}px`,
          height: `${56 * GRID_WIDTH_PX}px`,
        }}
        // TODO dynamic game board size based on tile dimensions
      >
        <img
          src={background}
          id={Section.PumpkinPlazaBackGround}
          className="h-auto absolute "
          style={{
            width: `${84 * GRID_WIDTH_PX}px`,
            height: `${56 * GRID_WIDTH_PX}px`,
          }}
        />
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

        <div className="absolute inset-0 cursor-pointer" onClick={walk} />

        <Bumpkins
          messages={chatState.context.messages}
          discoveries={chatState.context.discoveries}
          bumpkin={chatState.context.bumpkin}
          websocketService={websocketService}
          position={chatState.context.currentPosition}
          lastPosition={chatState.context.lastPosition}
          bumpkins={chatState.context.bumpkins}
          onVisit={(id) => gameService.send({ type: "VISIT", landId: id })}
        />

        <DailyReward />

        <IslandTravel
          inventory={gameState.context.state.inventory}
          bumpkin={gameState.context.state.bumpkin}
          x={-3}
          y={-22}
        />

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
      <Hud isFarming={false} />
    </>
  );
};
