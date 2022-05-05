import { Button } from "components/ui/Button";
import React, { useContext } from "react";

import secure from "assets/npcs/synced.gif";
import { Context } from "../GoblinProvider";
import { metamask } from "lib/blockchain/metamask";
import { shortAddress } from "features/farming/hud/components/Address";

export const Withdrawn: React.FC = () => {
  const { goblinService } = useContext(Context);

  return (
    <div className="flex flex-col items-center">
      <span className="text-center mb-2">Your items have been sent:</span>
      <span className="text-center mb-2 text-sm">
        {shortAddress(metamask.myAccount as string)}
      </span>
      <img src={secure} className="w-16 my-4" />

      <span className="text-center text-sm mb-2">
        View on{" "}
        <a
          className="underline hover:text-white"
          href="https://opensea.io/account?search[resultModel]=ASSETS&search[sortBy]=LAST_TRANSFER_DATE&search[query]=sunflower%20land"
          target="_blank"
          rel="noreferrer"
        >
          Open Sea
        </a>
      </span>

      <span className="text-center text-xxs mb-4">
        Open Sea can take up to 30 minutes to display your items. You can also
        view the items on{" "}
        <a
          className="underline hover:text-white"
          href={`https://polygonscan.com/address/${metamask.myAccount}#tokentxnsErc1155`}
          target="_blank"
          rel="noreferrer"
        >
          PolygonScan
        </a>
      </span>

      <Button onClick={() => goblinService.send("REFRESH")}>Continue</Button>
    </div>
  );
};
