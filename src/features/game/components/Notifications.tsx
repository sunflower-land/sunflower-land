import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import { OnChainEvent } from "../actions/onChainEvents";
import { Button } from "components/ui/Button";
import { PIXEL_SCALE } from "../lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "../GoblinProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const CONTENT_HEIGHT = 400;

export const Notifications: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  function onAcknowledge() {
    goblinService.send("REFRESH");
  }

  const notifications = goblinState.context.notifications as OnChainEvent[];

  const { t } = useAppTranslation();

  return (
    <>
      <div className="flex justify-between items-center mb-2 px-2">
        <p className="text-sm">{`Since you've been gone`}</p>
        <img
          src={SUNNYSIDE.icons.close}
          className="absolute cursor-pointer z-20"
          onClick={onAcknowledge}
          style={{
            top: `${PIXEL_SCALE * 6}px`,
            right: `${PIXEL_SCALE * 6}px`,
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
      </div>

      <div
        style={{ maxHeight: CONTENT_HEIGHT }}
        className="overflow-y-auto p-2 divide-brown-600 scrollable"
      >
        {notifications.map((notification, index) => (
          <div className="mb-4 flex items-center" key={index}>
            <img src={notification.icon} className="w-6 mr-2" />
            <span className="text-xs">{notification.message}</span>
          </div>
        ))}
      </div>
      <Button onClick={onAcknowledge}>{t("continue")}</Button>
    </>
  );
};
