import React, { useCallback, useContext, useEffect, useState } from "react";
import { useActor, useInterpret } from "@xstate/react";
import PF from "pathfinding";
import { Modal } from "react-bootstrap";

import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";

import { Bumpkins } from "./components/Bumpkins";
import { exploreMachine, MachineInterpreter } from "./exploreMachine";
import { Panel } from "components/ui/Panel";
import { Bumpkin } from "features/game/types/game";
import * as AuthProvider from "features/auth/lib/Provider";

import { randomInt } from "lib/utils/random";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { ChatUI } from "./components/ChatUI";
import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

const randomId = randomInt(0, 99999);

const BLOCKED: Coordinates[] = [
  {
    x: 16,
    y: 10,
  },
  {
    x: 17,
    y: 10,
  },
  {
    x: 18,
    y: 10,
  },
  {
    x: 19,
    y: 10,
  },
  {
    x: 20,
    y: 10,
  },
];

const grid = new PF.Grid(40, 40);

BLOCKED.forEach((coords) => {
  grid.setWalkableAt(coords.x, coords.y, false);
});

export const WorldNavigation: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState, send] = useActor(authService);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [path, setPath] = useState<Coordinates[]>([]);

  const chatService = useInterpret(exploreMachine, {
    context: {
      currentPosition: { x: 1200, y: 1400 },
      accountId: authState.context.farmId as number,
      jwt: authState.context.rawToken,
      bumpkin: gameState.context.state.bumpkin,
    },
  }) as unknown as MachineInterpreter;

  const [chatState] = useActor(chatService);

  const [scrollIntoView] = useScrollIntoView();

  useEffect(() => {
    return () => {
      chatService.send("DISCONNECT");
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

    chatService.send("SEND_LOCATION", {
      coordinates: { x: x, y: y },
    });
  };

  console.log({
    discovries: chatState.context.discoveries,
  });

  // Load data
  return (
    <>
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
          chatService={chatService}
          position={chatState.context.currentPosition}
          bumpkins={chatState.context.bumpkins}
          onVisit={(id) => gameService.send({ type: "VISIT", landId: id })}
          path={path}
        />
      </div>
      {/* {chatState.matches("connected") && !chatState.context.currentPosition && (
        <PlaceableBumpkin
          onPlace={(coordinates) => {
            console.log("Send", coordinates);
            chatService.send("SEND_LOCATION", { coordinates });
          }}
          bumpkin={myBumpkin}
        />
      )} */}
      {/* {chatState.matches("connected") && ( */}
      <div
        id="wishing-well"
        className="bg-red-300 cursor-pointer absolute z-20"
        style={{
          width: `${GRID_WIDTH_PX * 1}px`,
          left: `${GRID_WIDTH_PX * 10}px`,
          top: `${GRID_WIDTH_PX * 10}px`,
          height: `${GRID_WIDTH_PX * 1}px`,
        }}
        onClick={() => {
          gameService.send("REVEAL", {
            event: {
              type: "well.searched",
              createdAt: new Date(),
            },
          });
        }}
      />
      <ChatUI
        onMessage={({ reaction, text }) => {
          chatService.send("SEND_CHAT_MESSAGE", {
            text,
            reaction,
          });
        }}
        game={chatState.context.game}
      />
      {/* )} */}
    </>
  );
};
