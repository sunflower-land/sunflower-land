import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { SEASONS } from "features/game/types/seasons";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import React, { useEffect, useState } from "react";

const originalDate = window.Date;

export const DEV_TimeMachine = () => {
  useUiRefresher();
  const [days, setDays] = useState(0);

  useEffect(() => {
    (window as any).Date = class extends Date {
      constructor(options: any) {
        if (options) {
          super(options);
        } else {
          super(originalDate.now() + days * 24 * 60 * 60 * 1000);
        }
      }
    };
    Date.now = function () {
      return originalDate.now() + days * 24 * 60 * 60 * 1000;
    };

    return () => {
      window.Date = originalDate;
      Date.now = originalDate.now;
    };
  }, [days]);

  return (
    <div className="w-full flex justify-center">
      <Panel className="fixed bottom-0">
        <div className="flex-col">
          <div className="flex">
            <Button onClick={() => setDays(days - 1)}>{" - "}</Button>
            <span className="whitespace-nowrap">
              {new Date().toDateString()}
            </span>
            <Button onClick={() => setDays(days + 1)}>{" + "}</Button>
          </div>
          <div>
            {SEASONS["Witches' Eve"].startDate.getTime() < Date.now()
              ? "Witches's Eve"
              : "Dawn Breaker"}
          </div>
        </div>
      </Panel>
    </div>
  );
};
