/* eslint-disable no-console */
import React, { useEffect, useState } from "react";
import { ReactPortal } from "components/ui/ReactPortal";
import classNames from "classnames";
import { Button } from "components/ui/Button";
import { generateToken } from "lib/messaging";
import {
  cacheNotificationPermissions,
  getNotificationPermissions,
} from "features/farming/hud/lib/notifications";

interface Props {
  registration: ServiceWorkerRegistration | null;
}

export const RequestPermission: React.FC<Props> = ({ registration }) => {
  const [permission, setPermission] = useState<NotificationPermission>(
    getNotificationPermissions()
  );
  const [token, setToken] = useState<string>();

  const handleRequestPermission = async () => {
    const newPermission = await Notification.requestPermission();

    setPermission(newPermission);
    cacheNotificationPermissions(newPermission);

    if (newPermission === "granted" && registration?.active) {
      const newToken = await generateToken(registration);

      setToken(newToken);
    }
  };

  useEffect(() => {
    console.log("Permission: ", permission);
    console.log("Token: ", token);
  }, [token, permission]);

  const shouldRequestPermission = permission === "default";

  return (
    <ReactPortal>
      <div
        className={classNames(
          "fixed inset-x-0 bottom-0 transition-all duration-500 delay-1000 bg-brown-300 safe-pb safe-px",
          {
            "translate-y-20": !shouldRequestPermission,
            "-translate-y-0": shouldRequestPermission,
          }
        )}
        style={{ zIndex: 10000 }}
      >
        <div className="mx-auto max-w-2xl flex p-2 items-center safe-pb safe-px">
          <div className="p-1 flex flex-1">
            <span className="text-xs">
              Request permission to send notification.
            </span>
          </div>
          <div>
            <Button
              className="max-w-max h-10"
              onClick={handleRequestPermission}
            >
              Set Permission
            </Button>
          </div>
        </div>
      </div>
    </ReactPortal>
  );
};
