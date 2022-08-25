import React, { useContext } from "react";

import { Context } from "features/game/GameProvider";

import synced from "assets/npcs/synced.gif";
import { Button } from "components/ui/Button";

export const BumpkinMinted: React.FC = () => {
  const { gameService } = useContext(Context);
  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-shadow text-center">Woohoo!</span>
      <img src={synced} className="w-1/3 mt-2 mb-3" />
      <p className="text-sm my-2">Your Bumpkin is secured on the Blockchain.</p>
      <p className="text-sm my-2">
        Level your Bumpkin to unlock new content and rare items.
      </p>
      <p className="text-sm my-2">
        Your Bumpkin is an NFT on Polygon. Be careful, if you trade your Bumpkin
        you cannot farm!
      </p>
      <Button
        onClick={() => {
          gameService.send("CONTINUE");
        }}
      >
        Continue
      </Button>
    </div>
  );
};
