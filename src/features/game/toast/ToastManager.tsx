import React, { useContext, useState, useEffect } from "react";

import { ToastContext } from "./ToastQueueProvider";
import { Context } from "../GameProvider";
import { useActor } from "@xstate/react";
import { PIXEL_SCALE } from "../lib/constants";
import { InnerPanel } from "components/ui/Panel";

export const ToastManager: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { toastList } = useContext(ToastContext);
  const [listed, setListed] = useState<boolean>(false);

  useEffect(() => {
    if (toastList.length >= 1 && !gameState.matches("hoarding")) {
      setListed(true);
    } else {
      setListed(false);
    }
  }, [toastList]);

  return (
    <div>
      {listed && (
        <div
          className={
            "flex flex-col items-end sm:block fixed z-[99999] pointer-events-none"
          }
          style={{
            top: `${PIXEL_SCALE * 52}px`,
            left: `${PIXEL_SCALE * 3}px`,
          }}
        >
          <InnerPanel className="text-white">
            {toastList.map(({ content, id, icon }) => (
              <div className="flex items-center relative" key={id}>
                {icon && (
                  <img className="h-6 mr-1" src={icon} alt="toast-icon" />
                )}
                <span className="text-sm mx-1">{content}</span>
              </div>
            ))}
          </InnerPanel>
        </div>
      )}
    </div>
  );
};
