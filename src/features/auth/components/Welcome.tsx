import { Button } from "components/ui/Button";
import React, { useContext } from "react";
import { Context } from "../lib/Provider";

import walletIcon from "src/assets/icons/wallet.png";
import { SUNNYSIDE } from "assets/sunnyside";

export const Welcome: React.FC = () => {
  const { authService } = useContext(Context);

  return (
    <div className="p-2">
      <Button
        className="mb-2 py-2 text-sm relative"
        onClick={() => authService.send("SIGN_IN")}
      >
        <div className="px-8">
          <img
            src={walletIcon}
            className="h-7 mobile:h-6 ml-2.5 mr-6 absolute left-0 top-1"
          />
          Connect Wallet
        </div>
      </Button>
      <Button
        className="mb-2 py-2 text-sm relative"
        onClick={() => authService.send("CONTINUE")}
      >
        <div className="px-8">
          <img
            src={SUNNYSIDE.icons.player}
            className="h-7 mobile:h-6 ml-2.5 mr-6 absolute left-0 top-1"
          />
          Create Account
        </div>
      </Button>
      <div className="flex justify-center">
        <a href="https://discord.gg/sunflowerland">
          <img
            src="https://img.shields.io/discord/880987707214544966?label=Sunflower%20Land&logo=Discord&style=social"
            alt="Discord: Sunflower Land"
          />
        </a>
      </div>
    </div>
  );
};
