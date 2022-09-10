import React, { useState } from "react";

import heart from "assets/icons/heart.png";
import { Button } from "components/ui/Button";

import { BumpkinBuilder } from "./BumpkinBuilder";

export const NoBumpkin: React.FC = () => {
  const [showBuilder, setShowBuilder] = useState(false);

  if (showBuilder) {
    return <BumpkinBuilder />;
  }

  return (
    <>
      <div className="flex items-center flex-col p-2">
        <span>Create a Bumpkin</span>
        <img src={heart} className="w-20 my-2" />
        <p className="text-sm my-2">
          A Bumpkin is an NFT that is minted on the Blockchain.
        </p>
        <p className="text-sm my-2">
          You need a Bumpkin to help you plant, harvest, chop, mine and expand
          your land.
        </p>
      </div>
      <Button onClick={() => setShowBuilder(true)}>Continue</Button>
    </>
  );
};
