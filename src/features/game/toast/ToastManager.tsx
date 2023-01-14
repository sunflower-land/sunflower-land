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
    <>
      {listed && (
        <InnerPanel
          className="text-white flex flex-col-reverse items-start fixed z-[99999] pointer-events-none"
          style={{
            bottom: `${PIXEL_SCALE * 22}px`,
            left: `${PIXEL_SCALE * 3}px`,
          }}
        >
          {toastList.map(({ content, id, icon }) => (
            <div className="flex items-center justify-center" key={id}>
              {icon && (
                <img className="h-4 sm:h-6" src={icon} alt="toast-icon" />
              )}
              <span className="text-xs sm:text-sm mx-1">{content}</span>
            </div>
          ))}
        </InnerPanel>
      )}
    </>
  );
};
