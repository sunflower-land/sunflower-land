import React, { useContext } from "react";
import { Button } from "components/ui/Button";

import humanDeath from "assets/npcs/human_death.gif";

import * as AuthProvider from "features/auth/lib/Provider";
import { removeJWT } from "../actions/social";
import { WalletContext } from "features/wallet/WalletProvider";
import { translate } from "lib/i18n/translate";

export const Blocked: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const { walletService } = useContext(WalletContext);

  const tryAgain = () => {
    removeJWT();

    authService.send("REFRESH");
    walletService.send("RESET");
  };

  return (
    <div className="flex flex-col text-center text-shadow items-center p-1">
      <div className="flex mb-3 items-center ml-8">
        <img
          src={humanDeath}
          alt={translate("errorAndAccess.warning")}
          className="w-full"
        />
      </div>
      <p className="text-center mb-3">
        {translate("errorAndAccess.blocked.betaTestersOnly")}
      </p>

      <p className="text-center mb-2 text-xs">
        {translate("errorAndAccess.denied.message")}
      </p>
      <p className="text-center mb-4 text-xs">
        {translate("errorAndAccess.instructions.part1")}{" "}
        <a
          className="underline hover:text-white"
          href="https://discord.gg/sunflowerland"
          target="_blank"
          rel="noreferrer"
        >
          {translate("sflDiscord")}
        </a>
        {translate("errorAndAccess.instructions.part2")}
      </p>
      <Button onClick={tryAgain} className="overflow-hidden mb-2">
        <span>{translate("errorAndAccess.try.again")}</span>
      </Button>
    </div>
  );
};
