import React, { useContext, useState, useEffect } from "react";
import { Panel } from "components/ui/Panel";
import { ToastContext } from "./ToastQueueProvider";
import { useActor } from "@xstate/react";
import { Context } from "../GameProvider";

export const ToastManager = () => {
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
        <div className="p-0.5 flex flex-col items-end mr-2 sm:block fixed top-20 left-2 z-[99999]">
          <Panel>
            {toastList.map(({ content, id, icon }) => (
              <div className="flex items-center relative" key={id}>
                {icon && (
                  <img className="h-6 mr-3" src={icon} alt="toast-icon" />
                )}
                <span>{content}</span>
              </div>
            ))}
          </Panel>
        </div>
      )}
    </div>
  );
};
