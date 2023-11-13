import React from "react";

import plaza from "assets/tutorials/plaza_screenshot1.png";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import lockIcon from "assets/skills/lock.png";
import { Button } from "components/ui/Button";

export const PeteHelp: React.FC = () => {
  // Travel to the plaza
  return (
    <div className="p-2">
      <p className="text-sm mb-2">
        As you level up, you will unlock new areas to explore. First up is the
        Pumpkin Plaza....my home!
      </p>
      <p className="text-sm">
        Here you can complete deliveries for rewards, craft magical items &
        trade with other players.
      </p>

      <img src={plaza} className="w-full mx-auto rounded-lg my-2" />
      <p className="text-xs">
        Visit the fire pit, cook food and eat to level up.
      </p>
      <Label type="danger" className="my-2 ml-1" icon={lockIcon}>
        Level 3 Required
      </Label>

      <Button disabled onClick={console.log}>
        Let's go!
      </Button>
    </div>
  );
};
