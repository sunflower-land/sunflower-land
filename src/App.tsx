import React, { useEffect, useRef } from "react";

import * as Auth from "features/auth/lib/Provider";
import { initialise } from "lib/utils/init";
import { Navigation } from "./Navigation";

import "./styles.css";
import ErrorBoundary from "features/auth/components/ErrorBoundary";

// Initialise Global Settings
initialise();

import { Client } from "@widgetbot/embed-api";
import { Button } from "components/ui/Button";

/**
 * Top level wrapper for providers
 */
export const App: React.FC = () => {
  const api = useRef<Client>();

  // useEffect(() => {
  //   // Listen for discord message events
  //   crate.on("message", ({ message, channel }) => {
  //     console.log(`New message: ${message.content}`);
  //   });
  // }, []);
  // useEffect(() => {
  //   const load = async () => {
  //     await new Promise((res) => setTimeout(res, 2000));

  //     const iframe = document.getElementsByTagName("iframe")[0];
  //     console.log({ iframe });
  //     const api = new Client({
  //       id: "test",
  //       iframe,
  //     });

  //     api.on("message", (message) => {
  //       console.log("message:", message.id);
  //     });

  //     api.emit("sendMessage", "hello world");
  //   };

  //   load();
  // }, []);

  const onApi = async (client: Client) => {
    api.current = client;
    console.log({ client });
    client.on("signIn", (user) => {
      console.log(`Guest signed in as ${user.username}`, user);
    });

    // Listen for discord message events
    client.on("message", ({ message, channel }) => {
      console.log(`New message in ${channel}`, message);
    });

    // Listen for discord message delete events
    client.on("messageDelete", ({ channel, id }) => {
      console.log(`Message in ${channel} with an ID of ${id}, was deleted`);
    });

    await new Promise((r) => setTimeout(r, 5000));
    // client.emit("sendMessage", {
    //   channel: "880987707692687381",
    //   message: "I have sent this message from my Bumpkin",
    // });
  };

  // const onClick = () => {
  //   // console.log({ api: api.current?.emit });
  //   crate.notify("GHello");
  //   // console.log("Sent!", { crate: crate.emit });
  //   const res = crate.emit("sendMessage");
  //   console.log({ res });
  // };
  return (
    <Auth.Provider>
      <ErrorBoundary>
        <Navigation />
        {/* <div
          className="fixed inset-0 z-50"
          style={{
            zIndex: 100000000,
          }}
        >
          <WidgetBot
            height={500}
            server="880987707214544966"
            channel="880987707692687381"
            shard="https://emerald.widgetbot.io"
            onAPI={onApi}
            username={`Bumpkin #1`}
            avatar="https://testnet-images.bumpkins.io/nfts/32_1_6_13_20_22_23x128.png"
          />
          <Button onClick={onClick}>Send Message</Button>
        </div> */}
      </ErrorBoundary>
    </Auth.Provider>
  );
};
