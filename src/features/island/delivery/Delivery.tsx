import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { ResizableBar } from "components/ui/ProgressBar";
import chest from "assets/icons/chest.png";
import deliveryBoard from "assets/ui/delivery_board.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";

import classNames from "classnames";
import { DeliveryOrders } from "./components/Orders";
import { Revealing } from "features/game/components/Revealing";
import { Revealed } from "features/game/components/Revealed";
import { Panel } from "components/ui/Panel";
import { DeliveryHelp } from "./components/DeliveryHelp";
import { hasFeatureAccess } from "lib/flags";

const DeliveryComponent: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showHelp, setShowHelp] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [isRevealing, setIsRevealing] = useState(false);

  const [selectedOrderId, setSelectedOrderId] = useState<string>();

  const delivery = gameState.context.state.delivery;

  const progress = Math.min(
    delivery.milestone.goal,
    delivery.milestone.goal -
      (delivery.milestone.total - delivery.fulfilledCount)
  );

  useEffect(() => {
    console.log("Top render");
  }, []);

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
          <Revealing icon={chest} />;
        </Panel>
      </Modal>
    );
  }

  if (gameState.matches("revealed") && isRevealing) {
    return (
      <Modal show centered>
        <Panel className="z-10">
          <Revealed onAcknowledged={() => setIsRevealing(false)} />;
        </Panel>
      </Modal>
    );
  }

  const hasAccess = hasFeatureAccess(
    gameState.context.state.inventory,
    "DELIVERIES"
  );
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
          className={classNames("w-full", {
            "cursor-pointer hover:img-highlight": hasAccess,
          })}
          onClick={() => {
            if (!hasAccess) {
              return;
            }
            setShowModal(true);
          }}
        />
      </div>
      <Modal
        centered
        show={showModal}
        onHide={() => setShowModal(false)}
        dialogClassName="md:max-w-3xl"
      >
        <CloseButtonPanel
          onClose={() => setShowModal(false)}
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
              <div
                className="flex relative mx-auto mt-1"
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
                    "animate-pulsate cursor-pointer ":
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

export const Delivery = React.memo(DeliveryComponent);
