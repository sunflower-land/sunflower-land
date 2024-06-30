import React from "react";
import { Label } from "components/ui/Label";
import {
  MAX_OIL_CAPACITY_IN_MILLIS,
  getTotalOilMillisInMachine,
} from "features/game/events/landExpansion/supplyCropMachine";
import { CropMachineQueueItem } from "features/game/types/game";
import { useEffect, useState } from "react";
import { Button } from "components/ui/Button";
import { secondsToString } from "lib/utils/time";
import { ResizableBar } from "components/ui/ProgressBar";
import { PIXEL_SCALE } from "features/game/lib/constants";
import oilBarrel from "assets/icons/oil_barrel.webp";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface OilTankProps {
  stopped: boolean;
  queue: CropMachineQueueItem[];
  unallocatedOilTime: number;
  onAddOil: () => void;
}

export const OilTank = ({
  stopped,
  queue,
  unallocatedOilTime,
  onAddOil,
}: OilTankProps) => {
  const { t } = useAppTranslation();

  const calculatePercentageFull = (
    queue: CropMachineQueueItem[],
    unallocatedOilTime: number
  ) => {
    const totalOilMillis = getTotalOilMillisInMachine(
      queue,
      unallocatedOilTime
    );

    return (totalOilMillis / MAX_OIL_CAPACITY_IN_MILLIS) * 100;
  };

  const calculateOilTimeRemaining = (
    queue: CropMachineQueueItem[],
    unallocatedOilTime: number
  ) => {
    const totalOilMillis = getTotalOilMillisInMachine(
      queue,
      unallocatedOilTime
    );
    return totalOilMillis / 1000; // Convert milliseconds to seconds
  };

  // Initial state
  const [oilInTank, setOilInTank] = useState(
    calculatePercentageFull(queue, unallocatedOilTime)
  );
  const [runtime, setRuntime] = useState(
    calculateOilTimeRemaining(queue, unallocatedOilTime)
  );

  useEffect(() => {
    // Update the state immediately when paused or idle
    if (stopped) {
      setOilInTank(calculatePercentageFull(queue, unallocatedOilTime));
      setRuntime(calculateOilTimeRemaining(queue, unallocatedOilTime));
      return;
    }

    // Set interval when the machine is active
    const interval = setInterval(() => {
      setOilInTank(calculatePercentageFull(queue, unallocatedOilTime));
      setRuntime(calculateOilTimeRemaining(queue, unallocatedOilTime));
    }, 1000);

    // Cleanup function to clear the interval
    return () => clearInterval(interval);
  }, [queue, unallocatedOilTime, stopped]);

  return (
    <div>
      <Label
        type={runtime === 0 ? "danger" : "default"}
        className="ml-1.5 mt-2.5"
        icon={ITEM_DETAILS.Oil.image}
      >
        {runtime === 0
          ? t("cropMachine.moreOilRequired")
          : t("cropMachine.oilTank")}
      </Label>
      <div className="flex items-center justify-between">
        <div className="flex my-2 ml-1.5 space-x-2 items-center">
          <img src={oilBarrel} style={{ width: `${PIXEL_SCALE * 13}px` }} />
          <div className="flex flex-col justify-evenly h-full space-y-1">
            <ResizableBar
              percentage={oilInTank}
              type={oilInTank < 10 ? "error" : "quantity"}
              outerDimensions={{
                width: 40,
                height: 8,
              }}
            />
            <div className="flex">
              <div className="text-xs">
                {t("cropMachine.machineRuntime", {
                  time: secondsToString(runtime, {
                    length: "medium",
                    isShortFormat: true,
                    removeTrailingZeros: true,
                  }),
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="pr-2">
          <Button onClick={onAddOil}>{t("cropMachine.addOil")}</Button>
        </div>
      </div>
    </div>
  );
};
