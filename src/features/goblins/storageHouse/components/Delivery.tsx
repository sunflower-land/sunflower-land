import React, { useState } from "react";

import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";

import goblinCarry from "assets/npcs/goblin_carry.gif";

import { getKeys } from "features/game/types/craftables";
import { DeliverItems } from "./DeliverItems";

interface Props {
  onWithdraw: () => void;
}

export const Delivery: React.FC<Props> = ({ onWithdraw }) => {
  const [isTalking, setIsTalking] = useState(true);

  if (isTalking) {
    return (
      <div className="p-1">
        <img
          src={goblinCarry}
          className="h-16 my-2 running relative left-1/4"
        />

        <div>
          <span className="text-sm">Want me to deliver resources?</span>
          <span className="text-sm block mt-2 mb-2">
            It aint free, I've got a tribe to feed!
          </span>
          <span className="text-sm my-4">
            30% of the resources I'll take for the{" "}
            <a
              className="underline ml-2"
              href="https://docs.sunflower-land.com/fundamentals/withdrawing"
              target="_blank"
              rel="noreferrer"
            >
              Goblin community treasury.
            </a>
          </span>
          <Button className="mt-2" onClick={() => setIsTalking(false)}>
            Continue
          </Button>
        </div>
      </div>
    );
  }
  return <DeliverItems onWithdraw={onWithdraw} />;
};
