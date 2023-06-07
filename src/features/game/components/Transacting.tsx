import React from "react";

import syncing from "assets/npcs/syncing.gif";

export const Transacting: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-2">
      <span className="mb-2 text-center">Processing your transaction.</span>
      <img src={syncing} className="w-1/4 mb-2 mr-10" />
      <span className="text-sm text-center mt-2 mb-2">
        Please wait for your transaction to be confirmed by the Blockchain.
      </span>
      <a
        className="underline text-xxs text-center hover:text-white"
        href="https://docs.sunflower-land.com/fundamentals/blockchain-fundamentals"
        target="_blank"
        rel="noreferrer"
      >
        After 5 minutes, any unconfirmed transactions will be reset.
      </a>
    </div>
  );
};
