import React, { useContext, useLayoutEffect, useState } from "react";
import { useActor, useInterpret } from "@xstate/react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";

import WidgetBot from "@widgetbot/react-embed";
import { Client } from "@widgetbot/embed-api";
import background from "assets/land/levels/level_2.webp";

import { Context } from "features/game/GameProvider";
import { Chat, Message } from "./Chat";
import { randomInt } from "lib/utils/random";
import { chatMachine, MachineInterpreter } from "./chatMachine";
import { PlaceableBumpkin } from "./PlaceableBumpkin";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Bumpkin } from "features/game/types/game";

export const ChatIsland: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { state } = gameState.context;

  const chatService = useInterpret(chatMachine, {
    context: {
      bumpkin: state.bumpkin,
    },
  }) as unknown as MachineInterpreter;

  const [chatState] = useActor(chatService);

  const [messages, setMessages] = useState<Message[]>([]);

  const [scrollIntoView] = useScrollIntoView();

  useLayoutEffect(() => {
    // Start with island centered
    scrollIntoView(Section.HeliosBackGround, "auto");

    return () => {
      chatService.send("DISCONNECT");
    };
  }, []);

  const onApi = async (client: Client) => {
    console.log("Init API");
    // Listen for discord message events
    client.on("message", ({ message, channel }) => {
      if (!message.author.name.startsWith("Bumpkin #")) {
        console.log("NOT A BUMPKIN MESSAGE");
      }

      const [prefix, bumpkinId] = message.author.name.split("Bumpkin #");
      console.log(`New message in ${channel}`, message);
      const newMessage: Message = {
        id: message.id,
        bumpkinId: Number(bumpkinId),
        createdAt: Date.now(),
        text: message.content,
      };

      setMessages((prev) => [...prev, newMessage]);
    });

    client.on("signIn", (user) => {
      console.log(`Guest signed in as ${user.username}`, user);
    });
  };

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
          messages={messages}
          bumpkin={gameState.context.state.bumpkin as Bumpkin}
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
        />
      )}

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
      )}
    </>
  );
};
