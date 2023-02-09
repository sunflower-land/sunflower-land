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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDisabled(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRestock = () => {
    if (!gameState.context.state.inventory["Block Buck"]?.gte(1)) {
      // Show purchase modal
      onClose();
      openModal("BUY_BLOCK_BUCKS");
    } else {
      setToast({
        icon: ITEM_DETAILS["Block Buck"].image,
        content: `-1`,
      });

      gameService.send("shops.restocked");
    }
  };
  return (
    <div className="my-1">
      <Button
        disabled={isDisabled}
        className="text-xs mt-1"
        onClick={handleRestock}
      >
        <div className="flex items-center h-4">
          <p>Restock</p>

          <img src={ITEM_DETAILS["Block Buck"].image} className="h-5 ml-1" />
        </div>
      </Button>
    </div>
  );
};
