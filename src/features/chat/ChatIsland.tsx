import React, { useContext, useLayoutEffect, useState } from "react";
import { useActor } from "@xstate/react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";

import WidgetBot from "@widgetbot/react-embed";
import { Client } from "@widgetbot/embed-api";

import background from "assets/land/helios.webp";
import { Context } from "features/game/GameProvider";
import { Chat, Message } from "./Chat";
import { randomInt } from "lib/utils/random";

const randomId = randomInt(0, 10000);

export const ChatIsland: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { state } = gameState.context;

  const [messages, setMessages] = useState<Message[]>([]);

  const { bumpkin } = state;

  const [scrollIntoView] = useScrollIntoView();

  useLayoutEffect(() => {
    // Start with island centered
    scrollIntoView(Section.HeliosBackGround, "auto");
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
  };

  // Load data
  return (
    <>
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: `${40 * GRID_WIDTH_PX}px`,
          height: `${40 * GRID_WIDTH_PX}px`,
        }}
      >
        <img
          src={background}
          className="absolute inset-0 w-full h-full"
          id={Section.HeliosBackGround}
        />
        <Chat messages={messages} bumpkinId={randomId} />
      </div>
      <WidgetBot
        height={500}
        server="880987707214544966"
        channel="1059720957427724388"
        shard="https://emerald.widgetbot.io"
        onAPI={onApi}
        username={`Bumpkin #${randomId}`}
        className="fixed right-0 bottom-0"
        style={{ zIndex: 999999 }}
        avatar="https://testnet-images.bumpkins.io/nfts/32_1_6_13_20_22_23x128.png"
      />
    </>
  );
};
