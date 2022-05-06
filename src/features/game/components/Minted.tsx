import { Button } from "components/ui/Button";
import React, { useContext } from "react";

import bouncer from "assets/npcs/big_goblin.gif";
import { Context } from "../GoblinProvider";

export const Minted: React.FC = () => {
  const { goblinService } = useContext(Context);

  return (
    <div className="flex flex-col">
      <div className="p-2 flex flex-col items-center">
        <h1 className="text-center mb-3 text-lg">Minted but...</h1>
        <img src={bouncer} className="w-12 mb-3" />
        <p className="mb-4 text-sm text-justify">
          The goblins are very serious about equity and fairness.
        </p>
        <p className="mb-4 text-sm text-justify">
          They believe that everyone should have an opportunity to mint one of
          these rare items.
        </p>
        <p className="mb-4 text-sm text-justify">
          To ensure that everyone has a chance the goblins will not allow you to
          withdraw your item or mint another one for 7 days.
        </p>
      </div>
      <Button onClick={() => goblinService.send("REFRESH")}>Ok</Button>
    </div>
  );
};
