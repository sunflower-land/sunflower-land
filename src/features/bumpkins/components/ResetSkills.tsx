import React, { useContext } from "react";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import tokenStatic from "assets/icons/token_2.png";
import { Bumpkin } from "features/game/types/game";
import { Button } from "components/ui/Button";
import token from "assets/icons/token_2.png";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

interface Props {
  bumpkin: Bumpkin | undefined;
}

const PRICE = 100;

export const ResetSkills: React.FC<Props> = ({ bumpkin }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const { setToast } = useContext(ToastContext);

  const [isOpen, setIsOpen] = React.useState(false);

  const buy = (amount = 1) => {
    gameService.send("reset.skill");

    setToast({
      icon: tokenStatic,
      content: `-${amount.toString()}`,
    });
  };

  const noSKillBumpkin = (bumpkin: Bumpkin | undefined) => {
    if (JSON.stringify(bumpkin?.skills) === "{}") return true;
  };

  return (
    <>
      <div className="flex-col text-center text-xxs lg:text-sm sm:text-xs">
        <h1 className="mb-2">This will reset all your bumpkin skills</h1>
      </div>
      <div className="flex items-center justify-center space-x-1 sm:w-full mb-2">
        <div className="w-5">
          <img src={token} className="h-5 mr-1" />
        </div>
        <span>{PRICE}</span>
      </div>
      <div className="flex justify-center my-2">
        <Button
          className="w-48"
          disabled={state.balance.lessThan(PRICE) || noSKillBumpkin(bumpkin)}
          onClick={() => {
            setIsOpen(true);
          }}
        >
          ACCEPT
        </Button>
      </div>
      {isOpen && (
        <Modal show={isOpen} onHide={() => setIsOpen(false)} centered>
          <CloseButtonPanel title="Confirm" onClose={() => setIsOpen(false)}>
            <div className="flex">
              <Button
                onClick={() => {
                  buy();
                  setIsOpen(false);
                }}
              >
                YES
              </Button>
              <Button onClick={() => setIsOpen(false)}>NO</Button>
            </div>
          </CloseButtonPanel>
        </Modal>
      )}
    </>
  );
};
