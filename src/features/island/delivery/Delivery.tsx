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
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import Decimal from "decimal.js-light";
import { RequirementLabel } from "components/ui/RequirementsLabel";

export const Delivery: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showModal, setShowModal] = useState(true);

  const delivery = gameState.context.state.delivery;

  return (
    <Modal centered show={showModal} onHide={() => setShowModal(false)}>
      <CloseButtonPanel
        onClose={() => setShowModal(false)}
        title={
          <div
            className="flex relative mx-auto mt-1"
            style={{ width: "fit-content" }}
          >
            <ResizableBar
              percentage={20}
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
              9/12
            </span>
            <img
              src={chest}
              className="absolute h-8 shadow-lg"
              style={{
                right: 0,
                top: "-4px",
              }}
            />
          </div>
        }
      >
        <div className="flex flex-col w-full">
          {delivery.orders.map((order) => (
            <OuterPanel key={order.id} className="flex w-full mb-1">
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
                </div>
              </div>
            </OuterPanel>
          ))}

          <p className="text-center mb-0.5 mt-1">Next order in</p>
          <div className="flex justify-center items-center">
            <img src={SUNNYSIDE.icons.timer} className="h-4 mr-2" />
            <p className="text-xs">2h 58m</p>
          </div>
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};
