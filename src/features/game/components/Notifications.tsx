import React, { useContext } from "react";
import classNames from "classnames";
import { useActor } from "@xstate/react";

import close from "assets/icons/close.png";

import { Context } from "features/game/GameProvider";

import { useShowScrollbar } from "lib/utils/hooks/useShowScrollbar";

import { OnChainEvent } from "../actions/onChainEvents";
import { Button } from "components/ui/Button";

const CONTENT_HEIGHT = 400;

export const Notifications: React.FC = () => {
  const { ref: itemContainerRef, showScrollbar } =
    useShowScrollbar(CONTENT_HEIGHT);
  const { gameService } = useContext(Context);
  const [state] = useActor(gameService);

  function onAcknowledge() {
    gameService.send("ACKNOWLEDGE");
  }

  const notifications = state.context.notifications as OnChainEvent[];

  return (
    <>
      <div className="flex justify-between items-center mb-2 px-2">
        <p className="text-sm">{`Since you've been gone`}</p>
        <img
          src={close}
          className="h-6 cursor-pointer"
          onClick={onAcknowledge}
        />
      </div>

      <div
        ref={itemContainerRef}
        style={{ maxHeight: CONTENT_HEIGHT }}
        className={classNames("overflow-y-auto p-2 divide-brown-600", {
          scrollable: showScrollbar,
        })}
      >
        {notifications.map((notification, index) => (
          <div className="mb-4 flex items-center" key={index}>
            <img src={notification.icon} className="w-6 mr-2" />
            <span className="text-xs">{notification.message}</span>
          </div>
        ))}
      </div>
      <Button onClick={onAcknowledge}>Continue</Button>
    </>
  );
};
