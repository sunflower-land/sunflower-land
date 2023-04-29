import { useActor } from "@xstate/react";
import { OuterPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { NPC } from "../bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { ProgressBar, ResizableBar } from "components/ui/ProgressBar";
import chest from "assets/icons/chest.png";
import sfl from "assets/icons/token_2.png";
import deliveryBoard from "assets/ui/delivery_board.png";
import heartBg from "assets/ui/heart_bg.png";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import Decimal from "decimal.js-light";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { Button } from "components/ui/Button";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";

import selectBoxBL from "assets/ui/select/selectbox_bl.png";
import selectBoxBR from "assets/ui/select/selectbox_br.png";
import selectBoxTL from "assets/ui/select/selectbox_tl.png";
import selectBoxTR from "assets/ui/select/selectbox_tr.png";
import classNames from "classnames";
import { Order } from "features/game/types/game";

export const Delivery: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showHelp, setShowHelp] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const delivery = gameState.context.state.delivery;

  const [selectedId, setSelectedId] = useState<string>();

  let previewOrder = delivery.orders.find((order) => order.id === selectedId);

  const orders = delivery.orders.filter(
    (order) => order.expiresAt > Date.now()
  );

  if (!previewOrder) {
    previewOrder = orders[0];
  }

  const progress = Math.min(
    delivery.reward.goal,
    delivery.reward.goal - (delivery.reward.total - delivery.fulfilledCount)
  );

  const deliver = () => {
    gameService.send("order.delivered", { id: previewOrder.id });
    setSelectedId(undefined);
  };

  const hasRequirements = (order: Order) => {
    return getKeys(order.items).every((name) => {
      const count = gameState.context.state.inventory[name] || new Decimal(0);
      const amount = order.items[name] || new Decimal(0);

      return count.gte(amount);
    });
  };

  const Content = () => {
    if (orders.length === 0) {
      return <p>No orders available</p>;
    }

    if (showHelp) {
      return <p>TODO</p>;
    }

    const canFulfill = hasRequirements(previewOrder);

    return (
      <div className="flex md:flex-row flex-col-reverse">
        <div
          className={classNames("md:flex flex-col w-full  md:w-2/3", {
            hidden: selectedId,
          })}
        >
          <div className="flex flex-row w-full flex-wrap">
            {orders.map((order) => (
              <div className="w-1/2 sm:w-1/3 p-1">
                <OuterPanel
                  onClick={() => setSelectedId(order.id)}
                  className="w-full cursor-pointer hover:bg-brown-200 py-2 relative"
                >
                  {hasRequirements(order) && (
                    <img
                      src={SUNNYSIDE.icons.confirm}
                      className="absolute top-0.5 right-0.5 w-5"
                    />
                  )}

                  {!hasRequirements(order) &&
                    order.expiresAt - Date.now() < 60 * 60 * 1000 && (
                      <img
                        src={SUNNYSIDE.icons.stopwatch}
                        className="absolute top-0.5 right-0.5 w-5"
                      />
                    )}

                  <div className="flex">
                    <div className="relative bottom-4 h-14 w-12 mr-2 ml-0.5">
                      <NPC parts={NPC_WEARABLES[order.from]} />
                    </div>
                    <div className="flex flex-col justify-center items-center">
                      {order.reward.sfl && (
                        <div className="flex items-center">
                          <img src={sfl} className="h-6 mr-1" />
                          <span className="text-xs">{order.reward.sfl}</span>
                        </div>
                      )}
                      {getKeys(order.reward.items ?? {}).map((name) => (
                        <div className="flex items-center mt-1">
                          <img
                            src={ITEM_DETAILS[name].image}
                            className="h-5 mr-1"
                          />
                          <span className="text-xs">
                            {order.reward.items?.[name]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.id === previewOrder?.id && (
                    <div className="hidden md:block">
                      <img
                        className="absolute pointer-events-none"
                        src={selectBoxBL}
                        style={{
                          bottom: `${PIXEL_SCALE * -3}px`,
                          left: `${PIXEL_SCALE * -3}px`,
                          width: `${PIXEL_SCALE * 8}px`,
                        }}
                      />
                      <img
                        className="absolute pointer-events-none"
                        src={selectBoxBR}
                        style={{
                          bottom: `${PIXEL_SCALE * -3}px`,
                          right: `${PIXEL_SCALE * -3}px`,
                          width: `${PIXEL_SCALE * 8}px`,
                        }}
                      />
                      <img
                        className="absolute pointer-events-none"
                        src={selectBoxTL}
                        style={{
                          top: `${PIXEL_SCALE * -3}px`,
                          left: `${PIXEL_SCALE * -3}px`,
                          width: `${PIXEL_SCALE * 8}px`,
                        }}
                      />
                      <img
                        className="absolute pointer-events-none"
                        src={selectBoxTR}
                        style={{
                          top: `${PIXEL_SCALE * -3}px`,
                          right: `${PIXEL_SCALE * -3}px`,
                          width: `${PIXEL_SCALE * 8}px`,
                        }}
                      />
                    </div>
                  )}
                </OuterPanel>
              </div>
            ))}
          </div>
          {/* {delivery.orders.map((order) => (
        <div className="relative">
          <div
            className="w-full mb-1 absolute"
            style={{
              zIndex: 0,
              top: `${PIXEL_SCALE * -20}px`,
              left: `${PIXEL_SCALE * -8}px`,
              width: `${PIXEL_SCALE * 60}px`,
            }}
          >
            <DynamicNFT bumpkinParts={NPC_WEARABLES[order.from]} />
          </div>
          <OuterPanel
            key={order.id}
            className="flex flex-col w-full mb-1 relative mt-12"
          >
            <div className="relative bottom-4 h-14 w-12 mx-2">
              <NPC parts={NPC_WEARABLES[order.from]} />
            </div>
            <div className="flex-1 flex justify-between">
              <div className="flex flex-col">
                {getKeys(order.items).map((itemName) => (
                  <div className="flex items-center  relative">
                    <img
                      src={ITEM_DETAILS[itemName].image}
                      className="h-8 mr-1"
                    />
                    <p className="text-sm">{`x${order.items[itemName]}`}</p>
                    <img src={SUNNYSIDE.icons.confirm} className="h-4" />
                  </div>
                ))}
              </div>
              <div>
                <Label type="info" className="flex mb-2">
                  <img
                    src={SUNNYSIDE.icons.timer}
                    className="w-3 left-0 -top-4 mr-1"
                  />
                  <span className="mt-[2px]">{`${secondsToString(
                    (order.expiresAt - Date.now()) / 1000,
                    {
                      length: "medium",
                    }
                  )} left`}</span>
                </Label>
                <div className="flex flex-wrap">
                  {order.reward.sfl && (
                    <div className="flex items-center">
                      <img src={sfl} className="h-5 mr-1" />
                      <span className="text-xs">1</span>
                    </div>
                  )}
                  {getKeys(order.reward.items ?? {}).map((name) => (
                    <div className="flex items-center ml-3">
                      <img
                        src={ITEM_DETAILS[name].image}
                        className="h-5 mr-1"
                      />
                      <span className="text-xs">
                        {order.reward.items?.[name]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </OuterPanel>
        </div>
      ))} */}

          <p className="text-center mb-0.5 mt-1">Next order in</p>
          <div className="flex justify-center items-center">
            <img src={SUNNYSIDE.icons.timer} className="h-4 mr-2" />
            <p className="text-xs">2h 58m</p>
          </div>
        </div>
        <OuterPanel
          className={classNames(
            " md:flex md:flex-col items-center flex-1 relative",
            {
              hidden: !selectedId,
            }
          )}
        >
          <Label
            type="info"
            className="flex mb-2 absolute right-1.5 top-1.5 z-10"
          >
            <img
              src={SUNNYSIDE.icons.timer}
              className="w-2 left-0 -top-4 mr-1"
            />
            <span
              className="mt-[2px]"
              style={{ fontSize: "12px" }}
            >{`${secondsToString((previewOrder.expiresAt - Date.now()) / 1000, {
              length: "medium",
            })} left`}</span>
          </Label>
          <div
            className="mb-1 mx-auto w-full col-start-1 row-start-1 overflow-hidden z-0  rounded-lg relative"
            style={{
              height: `${PIXEL_SCALE * 50}px`,
              background:
                "linear-gradient(0deg, rgba(4,159,224,1) 0%, rgba(31,109,213,1) 100%)",
            }}
          >
            <p className="z-10 absolute bottom-1 right-1.5 capitalize text-xs">
              {previewOrder.from}
            </p>

            <div
              className="absolute -inset-2 bg-repeat"
              style={{
                height: `${PIXEL_SCALE * 50}px`,
                backgroundImage: `url(${heartBg})`,
                backgroundSize: `${32 * PIXEL_SCALE}px`,
              }}
            />
            <div key={previewOrder.from} className="w-1/2 md:w-full md:-ml-8">
              <DynamicNFT bumpkinParts={NPC_WEARABLES[previewOrder.from]} />
            </div>
          </div>
          <div className="flex-1 p-1">
            <p className="text-xs mb-2">
              Oh, I've been craving some fresh vegetables from the farm, would
              you mind delivering some to me?
            </p>
            {getKeys(previewOrder.items).map((itemName) => (
              // <div className="flex items-center  relative">
              //   <img
              //     src={ITEM_DETAILS[itemName].image}
              //     className="h-8 mr-1"
              //   />
              //   <p className="text-sm">{`x${previewOrder.items[itemName]}`}</p>
              // </div>
              <RequirementLabel
                key={itemName}
                type="item"
                item={itemName}
                balance={
                  gameState.context.state.inventory[itemName] ?? new Decimal(0)
                }
                showLabel
                requirement={new Decimal(previewOrder?.items[itemName] ?? 0)}
              />
            ))}
          </div>
          <Button disabled={!canFulfill} onClick={deliver}>
            Deliver
          </Button>
        </OuterPanel>
      </div>
    );
  };

  return (
    <>
      <div
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 13}px`,
          left: `${PIXEL_SCALE * 29}px`,
          top: `${PIXEL_SCALE * 2}px`,
        }}
      >
        <img
          src={deliveryBoard}
          className=" cursor-pointer hover:img-highlight w-full"
          onClick={() => setShowModal(true)}
        />
        <img
          src={SUNNYSIDE.icons.expression_alerted}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 4}px`,
            left: `${PIXEL_SCALE * 4.5}px`,
            top: `${PIXEL_SCALE * 4.5}px`,
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
                      hidden: !!selectedId,
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
                    hidden: !selectedId,
                    block: !!selectedId,
                  }
                )}
                onClick={() => setSelectedId(undefined)}
              />
              <div
                className="flex relative mx-auto mt-1"
                style={{ width: "fit-content" }}
              >
                <ResizableBar
                  percentage={(progress / delivery.reward.goal) * 100}
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
                  {`${progress}/${delivery.reward.goal}`}
                </span>
                <img
                  src={chest}
                  className={classNames("absolute h-8 shadow-lg", {
                    "animate-pulsate cursor-pointer ":
                      progress >= delivery.reward.goal,
                  })}
                  style={{
                    right: 0,
                    top: "-4px",
                  }}
                />
              </div>
            </>
          }
        >
          <Content />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
