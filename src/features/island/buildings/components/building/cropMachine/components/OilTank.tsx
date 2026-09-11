import React from "react";
import { Label } from "components/ui/Label";
import { MAX_OIL_CAPACITY_IN_MILLIS } from "features/game/events/landExpansion/supplyCropMachine";
import { getTotalOilMillisInMachine } from "features/game/events/landExpansion/supplyCropMachineOil";
import type {
  CropMachineBuilding,
  CropMachineQueueItem,
  GameState,
} from "features/game/types/game";
import type { BoostWindow } from "features/game/lib/boostWindows";
import { getCropMachineFuelAt } from "../lib/cropMachineView";
import { Button } from "components/ui/Button";
import { secondsToString } from "lib/utils/time";
import { ResizableBar } from "components/ui/ProgressBar";
import { PIXEL_SCALE } from "features/game/lib/constants";
import oilBarrel from "assets/icons/oil_barrel.webp";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";

interface OilTankProps {
  stopped: boolean;
  queue: CropMachineQueueItem[];
  unallocatedOilTime: number;
  /** Windowed machine (SPEED_BOOSTS): the tank derives from the fuel ledger. */
  machine: CropMachineBuilding;
  windowed: boolean;
  windows: BoostWindow[];
  onAddOil: () => void;
  state: GameState;
}

export const OilTank: React.FC<OilTankProps> = ({
  stopped,
  queue,
  unallocatedOilTime,
  machine,
  windowed,
  windows,
  onAddOil,
  state,
}) => {
  const { t } = useAppTranslation();

  const now = useNow({ live: !stopped });

  // A windowed machine's tank has no per-pack earmarks — its level derives
  // from the settled fuel ledger (and drains 1:1 with wall clock only while a
  // pack is actively growing); getTotalOilMillisInMachine is legacy-only.
  const totalOilMillis = windowed
    ? getCropMachineFuelAt({ machine, windows, at: now })
    : getTotalOilMillisInMachine(queue, unallocatedOilTime, now);
  const oilInTank = Math.min(
    100,
    (totalOilMillis / MAX_OIL_CAPACITY_IN_MILLIS(state)) * 100,
  );
  const runtime = totalOilMillis / 1000;

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
