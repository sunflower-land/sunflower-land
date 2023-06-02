import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GoblinProvider";
import { Equipped } from "features/game/types/bumpkin";
import { NPC } from "features/island/bumpkin/components/NPC";
import React, { useContext } from "react";

import wallet from "assets/icons/wallet.png";
interface Props {
  onWithdraw: () => void;
}
export const WithdrawBumpkin: React.FC<Props> = ({ onWithdraw }) => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  return (
    <div className="pt-2">
      <div className="flex items-center border-2 rounded-md border-black p-2 bg-green-background mb-3">
        <span className="text-xs">
          {" To play the game, you always need a Bumpkin on your farm."}
        </span>
      </div>
      <p className="text-sm mb-2">
        Are you sure you want to withdraw your Bumpkin?
      </p>
      <div className="flex justify-center items-center mb-4">
        <div className="h-10 w-10 relative bottom-[22px] mr-2">
          <NPC
            parts={goblinState.context.state.bumpkin?.equipped as Equipped}
          />
        </div>
        <img src={SUNNYSIDE.icons.arrow_right} className="h-10 mr-2" />
        <img src={wallet} className="h-10" />
      </div>
      <Button onClick={onWithdraw}>Withdraw</Button>
    </div>
  );
};
