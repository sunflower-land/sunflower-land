import React, { useContext, useEffect } from "react";
import { useActor, useInterpret } from "@xstate/react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";

import background from "assets/land/world.png";

import { Context } from "features/game/GameProvider";
import { Bumpkins } from "./Bumpkins";
import { chatMachine, MachineInterpreter } from "./chatMachine";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { ChatUI } from "./ChatUI";
import { Bumpkin } from "features/game/types/game";

import { randomInt } from "lib/utils/random";

const randomId = randomInt(0, 99999);

interface Props {
  scrollContainer: HTMLElement;
}
export const WorldNavigation: React.FC<Props> = ({ scrollContainer }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { state } = gameState.context;

  const myBumpkin = {
    ...(state.bumpkin as Bumpkin),
    // Testing for solo sessions
    // id: randomId,
  };

  const chatService = useInterpret(chatMachine, {
    context: {
      bumpkin: myBumpkin,
    },
  }) as unknown as MachineInterpreter;

  const [chatState] = useActor(chatService);

  const [scrollIntoView] = useScrollIntoView();

  useEffect(() => {
    if (!chatState.context.currentPosition) {
      console.log("SEND!");
      chatService.send("SEND_LOCATION", {
        coordinates: { x: 740, y: 1400 },
      });
    }
  }, [chatState.value]);

  useEffect(() => {
    return () => {
      chatService.send("DISCONNECT");
    };
  }, []);

  const walk = (e: React.MouseEvent<HTMLElement>) => {
    // const coords = getInitialCorodinates();
    console.log({
      scrolLeft: scrollContainer.scrollLeft,
      scrollTop: scrollContainer.scrollTop,
      pageX: e.pageX,
      pageY: e.pageY,
      clientX: e.clientX,
      clientY: e.clientY,
    });
    const x = e.pageX + scrollContainer.scrollLeft;
    const y = scrollContainer.scrollTop + e.pageY;

    console.log({ x, y });
    console.log({ e });
    // const distanceX = x - coords[0];
    // const distanceY = coords[1] - y;

    // const gridX = distanceX / GRID_WIDTH_PX;
    // const gridY = distanceY / GRID_WIDTH_PX;

    chatService.send("SEND_LOCATION", {
      coordinates: { x: x, y: y },
    });
  };

  // Load data
  return (
    <>
      <div className="absolute inset-0" onClick={walk}>
        <img
          src={background}
          id={Section.HeliosBackGround}
          className="h-auto absolute"
          style={{
            width: `${40 * GRID_WIDTH_PX}px`,
          }}
        />

        <Modal show={chatState.matches("connecting")} centered>
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
          bumpkin={myBumpkin}
          chatService={chatService}
          position={chatState.context.currentPosition}
          bumpkins={chatState.context.bumpkins}
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
      {chatState.context.currentPosition && (
        <ChatUI
          onMessage={(text) => {
            chatService.send("SEND_CHAT_MESSAGE", {
              text,
            });
          }}
        />
      )}
    </>
  );
};
