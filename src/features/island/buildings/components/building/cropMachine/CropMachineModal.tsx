import React, { useEffect, useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "components/ui/Modal";
import {
  CropMachineQueueItem,
  InventoryItemName,
} from "features/game/types/game";
import { CropMachineGrowingStage } from "./lib/cropMachine";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { ResizableBar } from "components/ui/ProgressBar";
import { isMobile } from "mobile-device-detect";
import { Label } from "components/ui/Label";
import { OuterPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { CROP_MACHINE_PLOTS } from "features/game/events/landExpansion/supplyCropMachine";
import add from "assets/icons/plus.png";

interface Props {
  show: boolean;
  queue: CropMachineQueueItem[];
  growingCropPackIndex?: number;
  growingCropPackStage?: CropMachineGrowingStage;
  paused: boolean;
  running: boolean;
  idle: boolean;
  onClose: () => void;
}

export const CropMachineModal: React.FC<Props> = ({
  show,
  queue,
  growingCropPackIndex,
  growingCropPackStage,
  running,
  paused,
  onClose,
}) => {
  const { t } = useAppTranslation();

  const growingPack =
    growingCropPackIndex !== undefined
      ? queue[growingCropPackIndex]
      : undefined;

  const makeMachineStatusLabel = () => {
    if (running) {
      return <Label type="success" className="capitalize">{`running`}</Label>;
    }

    if (paused) {
      return (
        <div className="flex space-x-1">
          <Label type="warning" className="capitalize">{`stopped`}</Label>
          <Label
            type="danger"
            className="capitalize"
          >{`More oil required`}</Label>
        </div>
      );
    }

    return <Label type="warning" className="capitalize">{`idle`}</Label>;
  };

  return (
    <Modal show={show} onHide={onClose}>
      <CloseButtonPanel onClose={onClose}>
        <div className="flex flex-col">
          <div className="p-1 my-0.5">{makeMachineStatusLabel()}</div>
          {/* Current crop */}
          <OuterPanel>
            {growingPack ? (
              <div className="flex flex-col">
                <div className="flex justify-between ml-2.5 mr-0.5 my-1">
                  <TimeRemainingLabel
                    paused={paused}
                    startTime={growingPack.startTime as number}
                    totalGrowTime={growingPack.totalGrowTime}
                  />
                  <Label
                    type="default"
                    className="capitalize"
                  >{`${growingCropPackStage}`}</Label>
                </div>
                <div className="flex">
                  <Box image={ITEM_DETAILS[growingPack.crop].image}></Box>
                  <div className="flex flex-col justify-center space-y-1">
                    <span className="text-xs sm:text-sm">{`${growingPack.amount} x ${growingPack.crop} Seeds`}</span>
                    <GrowthProgressBar
                      paused={paused}
                      startTime={growingPack.startTime as number}
                      totalGrowTime={growingPack.totalGrowTime}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="pl-1 pt-2 pb-2.5">{`No crops growing`}</div>
            )}
          </OuterPanel>
          {/* Rest of queue */}
          <div className="flex mt-2">
            {[
              ...queue,
              ...new Array(CROP_MACHINE_PLOTS - queue.length).fill(null),
            ]
              .filter((_, index) => {
                if (growingCropPackIndex === undefined) return true;

                return index !== growingCropPackIndex;
              })
              .map((item, index) => {
                if (!item) return <Box key={index} image={add} />;

                const isReady = item.readyAt && item.readyAt < Date.now();

                return (
                  <Box
                    key={index}
                    image={ITEM_DETAILS[item.crop as InventoryItemName].image}
                    secondaryImage={
                      isReady ? SUNNYSIDE.icons.confirm : undefined
                    }
                    count={item.amount}
                    countLabelType={isReady ? "success" : "danger"}
                  />
                );
              })}
          </div>
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};

interface ProgressProps {
  startTime: number;
  paused: boolean;
  totalGrowTime: number;
}

const TimeRemainingLabel = ({
  startTime,
  paused,
  totalGrowTime,
}: ProgressProps) => {
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  useEffect(() => {
    setSecondsRemaining((totalGrowTime - Date.now() - startTime) / 1000);
  }, [startTime, totalGrowTime]);

  useEffect(() => {
    if (!paused) {
      const interval = setInterval(() => {
        const remaining = totalGrowTime - (Date.now() - startTime);
        setSecondsRemaining(remaining / 1000);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [paused, startTime, totalGrowTime]);

  return (
    <Label
      type="info"
      icon={SUNNYSIDE.icons.stopwatch}
      className="capitalize"
    >{`Grow time remaining: ${secondsToString(secondsRemaining, {
      length: "short",
      isShortFormat: true,
      removeTrailingZeros: true,
    })}`}</Label>
  );
};

const GrowthProgressBar = ({
  startTime,
  totalGrowTime,
  paused,
}: ProgressProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(((Date.now() - startTime) / totalGrowTime) * 100);
  }, [startTime, totalGrowTime]);

  useEffect(() => {
    if (progress < 100 && !paused) {
      const interval = setInterval(() => {
        setProgress(((Date.now() - startTime) / totalGrowTime) * 100);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [progress, paused, startTime, totalGrowTime]);

  return (
    <ResizableBar
      percentage={progress}
      type="progress"
      outerDimensions={{
        width: isMobile ? 70 : 100,
        height: 8,
      }}
    />
  );
};
