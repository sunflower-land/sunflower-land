import React from "react";

import humanDeath from "assets/npcs/human_death.gif";
import { Button } from "components/ui/Button";

export const NotOnDiscordServer: React.FC = () => {
  return (
    <div className="flex flex-col text-center text-shadow items-center p-1">
      <div className="flex mb-3 items-center ml-8">
        <img src={humanDeath} alt="Warning" className="w-full" />
      </div>
      <p className="text-sm text-center mb-3">
        Looks like you haven't joined the Sunflower Land Discord Server yet.
      </p>

      <p className="mb-1">
        1. Join our{" "}
        <a
          className="underline"
          target="_blank"
          href="https://discord.gg/sunflowerland"
          rel="noreferrer"
        >
          Discord Server
        </a>{" "}
      </p>
      <p className="mb-3">2. Try Again</p>

      <div className="flex w-full">
        <Button className="mr-1">Close</Button>
        <Button>Try Again</Button>
      </div>
    </div>
  );
};
