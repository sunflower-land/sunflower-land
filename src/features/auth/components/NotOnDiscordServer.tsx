import React, { useContext } from "react";

import * as AuthProvider from "features/auth/lib/Provider";

import humanDeath from "assets/npcs/human_death.gif";
import { Button } from "components/ui/Button";
import { redirectOAuth } from "../actions/oauth";

export const NotOnDiscordServer: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);

  return (
    <div className="flex flex-col text-center text-shadow items-center p-1">
      <div className="flex mb-3 items-center ml-8">
        <img src={humanDeath} alt="Warning" className="w-full" />
      </div>
      <p className="text-sm text-center mb-3">
        {`Looks like you haven't joined the Sunflower Land Discord Server yet.`}
      </p>

      <p className="mb-1 text-sm">
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
      <p className="mb-1 text-sm">2. Complete verification & get started</p>
      <p className="mb-1 text-sm">3. Accept the rules in #rules</p>
      <p className="mb-3 text-sm">4. Try Again</p>

      <div className="flex w-full">
        <Button
          onClick={() => {
            // Remove query parameters from url
            window.history.pushState({}, "", window.location.pathname);
            authService.send("RETURN");
          }}
          className="mr-1"
        >
          Close
        </Button>
        <Button
          onClick={() => {
            redirectOAuth();
          }}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};
