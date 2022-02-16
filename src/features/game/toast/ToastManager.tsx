import React, { useContext, useState, useEffect } from "react";
import { Panel } from "components/ui/Panel";
import { ToastContext } from "./ToastQueueProvider";

export const ToastManager = () => {
  const { toastList, removeToast } = useContext(ToastContext);
  const [listed, setListed] = useState<boolean>(false);

  useEffect(() => {
    if (toastList.length >= 1) {
      setListed(true);
    } else {
      setListed(false);
    }
  }, [toastList]);

  return (
    <div>
      {listed && (
        <div className="text-shadow p-0.5 text-white shadow-lg flex flex-col items-end mr-2 sm:block fixed top-20 left-2 z-[99999]">
          <Panel>
            {toastList.map(({ content, id }) => (
              <div className="relative" key={id}>
                {content}
              </div>
            ))}
          </Panel>
        </div>
      )}
    </div>
  );
};
