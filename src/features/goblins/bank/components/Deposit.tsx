import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import * as AuthProvider from "features/auth/lib/Provider";

import { CopyAddress } from "components/ui/CopyAddress";
import { SUNNYSIDE } from "assets/sunnyside";

export const Deposit: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const farmAddress = authState.context.address as string;

  return (
    <div className="p-2 pt-0">
      <div className="flex flex-col items-center text-xs sm:text-sm mb-3">
        <p className="mb-3">
          Your account in Sunflower Land has its own wallet address into which
          you can send SFL tokens or SFL collectibles.
        </p>
        <p>
          {`This address will be the "recipient" address of any transfer you initiate whether it's from your personal wallet or from a marketplace like OpenSea or Niftyswap.`}
        </p>
        <CopyAddress address={farmAddress} />
        <p className="mb-3">
          Always double check the address before and after copying and pasting.
        </p>
        <p>
          Once the transfer has been completed, you can go into Settings and use
          the Refresh button to see your deposited items in the game.
        </p>
      </div>

      <div className="flex items-center border-2 rounded-md border-black p-2 bg-orange-400">
        <img
          src={SUNNYSIDE.icons.expression_alerted}
          alt="alert"
          className="mr-2 w-5 h-5/6"
        />
        <span className="text-xs">
          DO NOT SEND MATIC, BUMPKIN ITEMS OR ANY OTHER NON SFL TOKENS TO YOUR
          FARM ADDRESS
        </span>
      </div>
    </div>
  );
};
