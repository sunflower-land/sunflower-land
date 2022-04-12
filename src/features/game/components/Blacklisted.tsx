import React, { useContext } from "react";

import death from "assets/npcs/skeleton_death.gif";
import { Context } from "../GameProvider";
import { useActor } from "@xstate/react";

export const Blacklisted: React.FC = () => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { whitelistedAt },
    },
  ] = useActor(gameService);

  console.log({ whitelistedAt });
  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-shadow text-center">Goblins detected!</span>
      <img src={death} className="w-1/2" />
      <span className="text-shadow text-xs text-center mt-2">
        This farm has been identified for using automated software to mint farms
        and play the game or identifed for multi-accounting.
      </span>
      <span className="text-shadow underline text-xs text-center mt-4 mb-2">
        Banned until
      </span>
      {whitelistedAt?.toLocaleString()}
    </div>
  );
};
