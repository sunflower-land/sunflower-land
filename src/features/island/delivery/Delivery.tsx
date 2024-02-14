import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useEffect, useState } from "react";
import { Modal } from "components/ui/Modal";
import { ResizableBar } from "components/ui/ProgressBar";
import chest from "assets/icons/chest.png";
import deliveryBoard from "assets/ui/delivery_board.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";

import classNames from "classnames";
import { DeliveryOrders } from "./components/Orders";
import { DeliveryHelp } from "./components/DeliveryHelp";
import { hasNewOrders } from "./lib/delivery";

const Board: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showModal, setShowModal] = useState(false);

  const delivery = gameState.context.state.delivery;

  return (
    <>
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 13}px`,
          left: `${PIXEL_SCALE * 36}px`,
          top: `${PIXEL_SCALE * 2}px`,
        }}
      >
        <img
          src={deliveryBoard}
          className={classNames("w-full cursor-pointer hover:img-highlight")}
          onClick={() => {
            setShowModal(true);
          }}
        />
        {!!gameState.context.state.bumpkin?.experience &&
          gameState.context.state.bumpkin?.experience > 5 &&
          hasNewOrders(delivery) && (
            <img
              src={SUNNYSIDE.icons.expression_alerted}
              className="w-2.5 absolute top-3 right-3 pointer-events-none"
            />
          )}
      </div>

      <DeliveryModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export const DeliveryBoard = React.memo(Board);

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DeliveryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showHelp, setShowHelp] = useState(false);

  const [isRevealing, setIsRevealing] = useState(false);

  const [selectedOrderId, setSelectedOrderId] = useState<string>();

  const delivery = gameState.context.state.delivery;

  const progress = Math.min(
    delivery.milestone.goal,
    delivery.milestone.goal -
      (delivery.milestone.total - delivery.fulfilledCount)
  );

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("Top render");
  }, []);

  return (
    <>
      <Modal
        centered
        show={isOpen}
        onHide={onClose}
        dialogClassName="md:max-w-3xl"
      >
        <CloseButtonPanel
          onClose={onClose}
          title={
            <>
              {!showHelp && (
                <img
                  src={SUNNYSIDE.icons.expression_confused}
                  onClick={() => setShowHelp(true)}
                  className={classNames(
                    "absolute left-4 top-3 h-6 cursor-pointer md:block",
                    {
                      hidden: !!selectedOrderId,
                    }
                  )}
                />
              )}

              {showHelp && (
                <img
                  src={SUNNYSIDE.icons.arrow_left}
                  className={classNames(
                    "absolute left-4 top-3 h-6 cursor-pointer"
                  )}
                  onClick={() => setShowHelp(false)}
                />
              )}

              <img
                src={SUNNYSIDE.icons.arrow_left}
                className={classNames(
                  "absolute left-4 top-3 h-6 cursor-pointer md:hidden",
                  {
                    hidden: !selectedOrderId,
                    block: !!selectedOrderId,
                  }
                )}
                onClick={() => setSelectedOrderId(undefined)}
              />
            </>
          }
        >
          {showHelp ? (
            <DeliveryHelp />
          ) : (
            <DeliveryOrders
              selectedId={selectedOrderId}
              onSelect={setSelectedOrderId}
            />
          )}
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
