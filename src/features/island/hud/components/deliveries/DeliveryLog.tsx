import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import chest from "assets/icons/chest.png";
import deliveryBoard from "assets/ui/delivery_board_no_shadow.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";

import classNames from "classnames";
import { Revealing } from "features/game/components/Revealing";
import { Revealed } from "features/game/components/Revealed";
import { Panel } from "components/ui/Panel";
import { DeliveryHelp } from "features/island/delivery/components/DeliveryHelp";
import { hasNewOrders } from "features/island/delivery/lib/delivery";
import { DeliveryOrders } from "features/island/delivery/components/Orders";

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
          width: `${PIXEL_SCALE * 10.5}px`,
          top: `${PIXEL_SCALE * 3.3}px`,
        }}
      >
        <img
          src={deliveryBoard}
          className={classNames("w-full cursor-pointer hover:img-highlight")}
          onClick={() => {
            setShowModal(true);
          }}
        />
        {hasNewOrders(delivery) && (
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            className="absolute top-2.5 left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 3}px`,
            }}
          />
        )}
      </div>

      <DeliveryModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export const DeliveryLog = React.memo(Board);

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DeliveryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [tab, setTab] = useState(0);

  const [showHelp, setShowHelp] = useState(false);

  const [isRevealing, setIsRevealing] = useState(false);

  const [selectedOrderId, setSelectedOrderId] = useState<string>();

  const delivery = gameState.context.state.delivery;
  const orders = delivery.orders.filter((order) => Date.now() >= order.readyAt);

  const progress = Math.min(
    delivery.milestone.goal,
    delivery.milestone.goal -
      (delivery.milestone.total - delivery.fulfilledCount)
  );

  const reachMilestone = () => {
    gameService.send("REVEAL", {
      event: {
        type: "delivery.milestoneReached",
        createdAt: new Date(),
      },
    });
    setIsRevealing(true);
  };

  if (gameState.matches("revealing") && isRevealing) {
    return (
      <Modal show centered>
        <Panel className="z-10">
          <Revealing icon={chest} />
        </Panel>
      </Modal>
    );
  }

  if (gameState.matches("revealed") && isRevealing) {
    return (
      <Modal show centered>
        <Panel className="z-10">
          <Revealed onAcknowledged={() => setIsRevealing(false)} />
        </Panel>
      </Modal>
    );
  }

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
          tabs={[
            { icon: SUNNYSIDE.icons.expression_chat, name: "Deliveries" },
            { icon: SUNNYSIDE.icons.expression_chat, name: "Bumpkins" },
          ]}
          currentTab={tab}
          setCurrentTab={setTab}
        >
          {/* <div className="flex justify-end mx-2 mb-1">
            <div
              className="flex relative justify-end mt-1"
              style={{ width: "fit-content" }}
            >
              <ResizableBar
                percentage={(progress / delivery.milestone.goal) * 100}
                type="progress"
                outerDimensions={{
                  width: 80,
                  height: 10,
                }}
              />
              <span
                className="absolute text-xs"
                style={{
                  left: "93px",
                  top: "3px",
                  fontSize: "16px",
                }}
              >
                {`${progress}/${delivery.milestone.goal}`}
              </span>
              <img
                src={chest}
                className={classNames("absolute h-8 shadow-lg", {
                  "ready cursor-pointer img-highlight-heavy":
                    progress >= delivery.milestone.goal && !isRevealing,
                })}
                onClick={() => {
                  if (progress < delivery.milestone.goal) {
                    return;
                  }

                  reachMilestone();
                }}
                style={{
                  right: 0,
                  top: "-4px",
                }}
              />
            </div>
          </div> */}
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
          {tab === 0 && showHelp ? (
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
