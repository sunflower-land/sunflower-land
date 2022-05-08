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
      <img src={secure} className="w-12 my-2" />
      <h1 className="text-center mb-4 mt-1 text-lg">Success!</h1>
      <p className="mb-4">
        Your items have been sent to:
        <span className="text-center mb-2 ml-2 text-sm">
          {shortAddress(metamask.myAccount as string)}
        </span>
      </p>

      <span className="mb-4">
        You can view your items on{" "}
        <a
          className="underline hover:text-white"
          href="https://opensea.io/account?search[resultModel]=ASSETS&search[sortBy]=LAST_TRANSFER_DATE&search[query]=sunflower%20land"
          target="_blank"
          rel="noreferrer"
        >
          Open Sea
        </a>
      </span>

      <span className="mb-4">
        Please note that Open Sea can take up to 30 minutes to display your
        items. You can also view your items on{" "}
        <a
          className="underline hover:text-white"
          href={`https://polygonscan.com/address/${metamask.myAccount}#tokentxnsErc1155`}
          target="_blank"
          rel="noreferrer"
        >
          PolygonScan
        </a>
      </span>

      <Button onClick={() => goblinService.send("REFRESH")}>Ok</Button>
    </div>
  );
};
