import React, { useContext } from "react";

import * as AuthProvider from "features/auth/lib/Provider";

import humanDeath from "assets/npcs/human_death.gif";
import { Button } from "components/ui/Button";
import { redirectOAuth } from "../actions/oauth";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const NotOnDiscordServer: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col text-center  items-center p-1">
      <div className="flex mb-3 items-center ml-8">
        <img src={humanDeath} alt={t("warning")} className="w-full" />
      </div>
      <p className="text-sm text-center mb-3">
        {t("notOnDiscordServer.intro")}
      </p>

      <p className="mb-1 text-sm">
        {t("notOnDiscordServer.joinDiscord")}
        <a
          className="underline"
          target="_blank"
          href="https://discord.gg/sunflowerland"
          rel="noreferrer"
        >
          {t("notOnDiscordServer.discordServer")}
        </a>{" "}
      </p>
      <p className="mb-1 text-sm">
        {t("notOnDiscordServer.completeVerification")}
      </p>
      <p className="mb-1 text-sm">{t("notOnDiscordServer.acceptRules")}</p>
      <p className="mb-3 text-sm">{t("try.again")}</p>

      <div className="flex w-full">
        <Button
          onClick={() => {
            // Remove query parameters from url
            window.history.pushState({}, "", window.location.pathname);
            authService.send("RETURN");
          }}
          className="mr-1"
        >
          {t("close")}
        </Button>
        <Button
          onClick={() => {
            redirectOAuth();
          }}
        >
          {t("try.again")}
        </Button>
      </div>
    </div>
  );
};
