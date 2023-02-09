import React, { useContext, useEffect, useState } from "react";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { ModalContext } from "features/game/components/modal/ModalProvider";

interface Props {
  onClose: () => void;
}

export const Restock: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [isDisabled, setIsDisabled] = useState(true);
  const { setToast } = useContext(ToastContext);
  const { openModal } = useContext(ModalContext);

  const canRestock = gameState.context.state.inventory["Block Buck"]?.gte(1);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (canRestock) {
        setIsDisabled(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleBuy = () => {
    onClose();
    openModal("BUY_BLOCK_BUCKS");
  };

  const handleRestock = () => {
    setToast({
      icon: ITEM_DETAILS["Block Buck"].image,
      content: `-1`,
    });

    gameService.send("shops.restocked");
  };
  return (
    <div className="my-1 flex flex-col flex-1 items-center justify-end">
      <div className="flex items-center">
        <p className="text-xs mr-1">Restock = 1 x</p>
        <img src={ITEM_DETAILS["Block Buck"].image} className="h-4" />
      </div>
      <Button
        disabled={isDisabled}
        className="text-xs mt-1"
        onClick={handleRestock}
      >
        <div className="flex items-center h-4">
          <p>Restock</p>
        </div>
      </Button>
      {!canRestock && (
        <Button className="text-xs mt-1" onClick={handleBuy}>
          <div className="flex items-center h-4">
            <p>Buy</p>

            <img src={ITEM_DETAILS["Block Buck"].image} className="h-5 ml-1" />
          </div>
        </Button>
      )}
    </div>
  );
};
