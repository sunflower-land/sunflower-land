import React, { useContext } from "react";
import { Button } from "components/ui/Button";

import humanDeath from "assets/npcs/human_death.gif";

import * as AuthProvider from "features/auth/lib/Provider";
import { removeSession } from "../actions/login";
import { wallet } from "lib/blockchain/wallet";
import { translate } from "lib/i18n/translate";
import { removeSocialSession } from "../actions/social";

export const Blocked: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const tryAgain = () => {
    removeSession(wallet.myAccount as string);
    removeSocialSession();

    authService.send("REFRESH");
  };

  return (
    <div className="flex flex-col text-center text-shadow items-center p-1">
      <div className="flex mb-3 items-center ml-8">
        <img src={humanDeath} alt="Warning" className="w-full" />
      </div>
      <p className="text-center mb-3">{translate("error.betaTestersOnly")}</p>

      <p className="text-center mb-2 text-xs">
        {`You don't have access to the game yet.`}
      </p>
      <p className="text-center mb-4 text-xs">
        {translate("statements.join.discord")}
        <a
          className="underline hover:text-white"
          href="https://discord.gg/sunflowerland"
          target="_blank"
          rel="noreferrer"
        >
          {translate("sfl.discord")}
        </a>
      </p>
      <Button onClick={tryAgain} className="overflow-hidden mb-2">
        <span>{translate("try.again")}</span>
      </Button>
    </div>
  );
};
