import React, { useContext } from "react";

import * as AuthProvider from "features/auth/lib/Provider";

import humanDeath from "assets/npcs/human_death.gif";
import { Button } from "components/ui/Button";
import { redirectOAuth } from "../actions/oauth";
import { translate } from "lib/i18n/translate";

export const NotOnDiscordServer: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);

  return (
    <div className="flex flex-col text-center text-shadow items-center p-1">
      <div className="flex mb-3 items-center ml-8">
        <img src={humanDeath}alt={translate("notOnDiscordServer.warning")}className="w-full"/>
      </div>
      <p className="text-sm text-center mb-3">
        {translate("notOnDiscordServer.intro")}
      </p>

      <p className="mb-1 text-sm">
        {translate("notOnDiscordServer.joinDiscord")}
        <a
          className="underline"
          target="_blank"
          href="https://discord.gg/sunflowerland"
          rel="noreferrer"
        >
          {translate("notOnDiscordServer.discordServer")}
        </a>{" "}
      </p>
      <p className="mb-1 text-sm">{translate("notOnDiscordServer.completeVerification")}</p>
      <p className="mb-1 text-sm">{translate("notOnDiscordServer.acceptRules")}</p>
      <p className="mb-3 text-sm">{translate("notOnDiscordServer.tryAgain")}</p>

      <div className="flex w-full">
        <Button
          onClick={() => {
            // Remove query parameters from url
            window.history.pushState({}, "", window.location.pathname);
            authService.send("RETURN");
          }}
          className="mr-1"
        >
          {translate("notOnDiscordServer.close")}
        </Button>
        <Button
          onClick={() => {
            redirectOAuth();
          }}
        >
          {translate("notOnDiscordServer.tryAgainButton")}
        </Button>
      </div>
    </div>
  );
};
