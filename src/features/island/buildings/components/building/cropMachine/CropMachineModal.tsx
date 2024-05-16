import React, { useEffect, useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "components/ui/Modal";
import { CropMachineQueueItem } from "features/game/types/game";
import { CropMachineGrowingStage } from "./lib/cropMachine";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { ResizableBar } from "components/ui/ProgressBar";
import { isMobile } from "mobile-device-detect";
import { Label } from "components/ui/Label";
import { OuterPanel } from "components/ui/Panel";

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
  idle,
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

          <OuterPanel>
            {growingPack ? (
              <div className="flex flex-col">
                <div className="flex space-x-1">
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
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};

interface GrowthProgressProps {
  startTime: number;
  paused: boolean;
  totalGrowTime: number;
}

const GrowthProgressBar = ({
  startTime,
  totalGrowTime,
  paused,
}: GrowthProgressProps) => {
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
