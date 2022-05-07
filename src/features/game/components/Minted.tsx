import { Button } from "components/ui/Button";
import React, { useContext } from "react";

import busyGoblin from "assets/npcs/goblin_doing.gif";
import { Context } from "../GoblinProvider";

export const Minted: React.FC = () => {
  const { goblinService } = useContext(Context);

  return (
    <div className="flex flex-col">
      <div className="p-2 flex flex-col items-center">
        <h1 className="text-center mb-3 text-lg">
          The goblins are crafting your item!
        </h1>
        <img src={busyGoblin} className="w-20 mb-3" />
        <p className="mb-3 text-sm text-justify">
          The goblins are renowned for their exceptional craftsmanship. They
          build each of these rare items by hand.
        </p>
        <p className="mb-4 text-sm text-justify">
          It will take them 7 days for this process to be completed.
        </p>
        <p className="mb-4 text-sm text-justify">
          {`You will not be able to withdraw your item or mint another one until
          they're done.`}
        </p>
      </div>
      <Button onClick={() => goblinService.send("REFRESH")}>Ok</Button>
    </div>
  );
};
