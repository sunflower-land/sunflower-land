import React, { useContext, useLayoutEffect, useState } from "react";
import { useActor, useInterpret } from "@xstate/react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";

import WidgetBot from "@widgetbot/react-embed";
import { Client } from "@widgetbot/embed-api";
import background from "assets/land/levels/level_2.webp";

import { Context } from "features/game/GameProvider";
import { Chat } from "./Chat";
import { randomInt } from "lib/utils/random";
import { chatMachine, MachineInterpreter } from "./chatMachine";
import { PlaceableBumpkin } from "./PlaceableBumpkin";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Bumpkin } from "features/game/types/game";

const randomId = randomInt(0, 1000000);
export const ChatIsland: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { state } = gameState.context;

  // Randomise ID for local testing
  const myBumpkin = {
    ...state.bumpkin,
    id: randomId,
  } as Bumpkin;

  const chatService = useInterpret(chatMachine, {
    context: {
      bumpkin: myBumpkin,
    },
  }) as unknown as MachineInterpreter;

  const [chatState] = useActor(chatService);

  const [scrollIntoView] = useScrollIntoView();

  useLayoutEffect(() => {
    // Start with island centered
    scrollIntoView(Section.HeliosBackGround, "auto");

    const interval = setInterval(() => {
      chatService.send("SEND_CHAT_MESSAGE", {
        text: `M: ${randomInt(0, 1000)}`,
      });
    }, 5000);

    return () => {
      chatService.send("DISCONNECT");
      clearInterval(interval);
    };
  }, []);

  // Load data
  return (
    <>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <img
          src={background}
          id={Section.HeliosBackGround}
          className="h-auto"
          style={{
            width: `${36 * GRID_WIDTH_PX}px`,
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

        <Chat
          messages={chatState.context.messages}
          bumpkin={myBumpkin}
          chatService={chatService}
          position={chatState.context.currentPosition}
          bumpkins={chatState.context.bumpkins}
        />
      </div>
      {chatState.matches("connected") && !chatState.context.currentPosition && (
        <PlaceableBumpkin
          onPlace={(coordinates) => {
            console.log("Send", coordinates);
            chatService.send("SEND_LOCATION", { coordinates });
          }}
          bumpkin={myBumpkin}
        />
      )}
      {/* 
      {chatState.context.currentPosition && (
        <WidgetBot
          height={500}
          server="880987707214544966"
          channel="1059720957427724388"
          shard="https://emerald.widgetbot.io"
          onAPI={onApi}
          username={`Bumpkin #${gameState.context.state.bumpkin?.id as Number}`}
          className="fixed right-0 bottom-0"
          style={{ zIndex: 999999 }}
          // avatar="https://testnet-images.bumpkins.io/nfts/32_1_6_13_20_22_23x128.png"
        />
      )} */}
    </>
  );
};
