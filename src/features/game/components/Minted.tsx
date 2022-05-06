import { Button } from "components/ui/Button";
import React, { useContext } from "react";

import goblinWorking from "assets/npcs/goblin_doing.gif";
import { Context } from "../GoblinProvider";

export const Minted: React.FC = () => {
  const { goblinService } = useContext(Context);

  return (
    <div className="flex flex-col items-center">
      <img src={goblinWorking} className="w-16" />
      <h1 className="text-center mb-4 text-lg">Preparing your item..</h1>
      <p className="mb-4">The goblins are hard at work preparing your item.</p>
      <p className="mb-4">This process will take 7 days.</p>
      <p className="mb-4">
        You can check the progress at any time from inside your inventory panel.
      </p>
      <p className="mb-4">
        You will <span className="underline">not</span> be able to withdraw this
        item until this progress is complete.
      </p>
      <Button onClick={() => goblinService.send("REFRESH")}>Ok</Button>
    </div>
  );
};
