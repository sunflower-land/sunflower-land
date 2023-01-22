import React, { useContext } from "react";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import tokenStatic from "assets/icons/token_2.png";
import { Bumpkin } from "features/game/types/game";
import { Button } from "components/ui/Button";

interface Props {
  bumpkin: Bumpkin | undefined;
  onClose: () => void;
}

const PRICE = 100;

export const ResetSkills: React.FC<Props> = ({ bumpkin, onClose }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const { setToast } = useContext(ToastContext);

  const buy = (amount = 1) => {
    gameService.send("reset.skill", {});

    setToast({
      icon: tokenStatic,
      content: `-${amount.toString()}`,
    });
  };

  const reset = (bumpkin: Bumpkin | undefined) => {
    if (bumpkin?.skills) {
      bumpkin.skills = {};
      buy(PRICE);
    }
  };

  const noSKillBumpkin = (bumpkin: Bumpkin | undefined) => {
    if (bumpkin?.skills == undefined) {
      return true;
    }
    return false;
  };

  return (
    <>
      <div className="flex-col text-center text-xxs sm:text-xs my-6">
        <h2>Sure you want to reset your skills?</h2>

        <span>Cost: {PRICE} SFL</span>
      </div>
      <div className="flex justify-center">
        <Button
          className="w-48"
          disabled={state.balance.lessThan(PRICE) || noSKillBumpkin(bumpkin)}
          onClick={() => {
            reset(bumpkin);
            onClose();
          }}
        >
          ACCEPT
        </Button>
      </div>
    </>
  );
  //}
};
