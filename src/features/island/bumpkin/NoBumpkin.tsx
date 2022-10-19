import React from "react";

import heart from "assets/icons/heart.png";

import { CONFIG } from "lib/config";

export const NoBumpkin: React.FC = () => {
  return (
    <>
      <div className="flex items-center flex-col p-2">
        <span>You are missing your Bumpkin</span>
        <img src={heart} className="w-20 my-2" />
        <p className="text-sm my-2">
          A Bumpkin is an NFT that is minted on the Blockchain.
        </p>
        <p className="text-sm my-2">
          You need a Bumpkin to help you plant, harvest, chop, mine and expand
          your land.
        </p>
        <p className="text-sm my-2">
          All accounts come with a free Bumpkin. If you misplaced your Bumpkin,
          you can mint one below:
        </p>
        <p className="text-xs sm:text-sm text-shadow text-white p-1">
          <a
            className="underline"
            href={
              CONFIG.NETWORK === "mumbai"
                ? "https://testnet.bumpkins.io"
                : "https://bumpkins.io"
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            Bumpkins.io
          </a>
        </p>
      </div>
    </>
  );
};
