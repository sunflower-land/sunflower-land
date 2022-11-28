import React, { useState } from "react";

import { Button } from "components/ui/Button";

import goblinCarry from "assets/npcs/goblin_carry.gif";

import { DeliverItems } from "./DeliverItems";

interface Props {
  onWithdraw: () => void;
}

export const Delivery: React.FC<Props> = ({ onWithdraw }) => {
  const [isTalking, setIsTalking] = useState(true);

  if (isTalking) {
    return (
      <div className="p-2">
        <img
          src={goblinCarry}
          className="h-16 my-2 running relative left-1/4"
        />

        <div className="flex flex-col space-y-3">
          <span className="text-sm">Want me to deliver resources?</span>
          <span className="text-sm">
            {"It ain't free, I've got a tribe to feed!"}
          </span>
          <span className="text-sm">
            {"I'll take 30% of the resources for the "}
            <a
              className="underline"
              href="https://docs.sunflower-land.com/economy/goblin-community-treasury"
              target="_blank"
              rel="noreferrer"
            >
              Goblin community treasury
            </a>
            .
          </span>
          <Button onClick={() => setIsTalking(false)}>Continue</Button>
        </div>
      </div>
    );
  }
  return <DeliverItems onWithdraw={onWithdraw} />;
};
