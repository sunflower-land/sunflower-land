import React, { useContext, useEffect, useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "components/ui/Modal";
import { CropMachineQueueItem } from "features/game/types/game";
import {
  CropMachineState,
  MachineInterpreter,
  getTotalOilMillisInMachine,
  isCropPackReady,
} from "./lib/cropMachine";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { ResizableBar } from "components/ui/ProgressBar";
import { isMobile } from "mobile-device-detect";
import { Label } from "components/ui/Label";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import {
  AddSeedsInput,
  MAX_OIL_CAPACITY_IN_MILLIS,
  MAX_QUEUE_SIZE,
  calculateCropTime,
} from "features/game/events/landExpansion/supplyCropMachine";
import add from "assets/icons/plus.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import oilBarrel from "assets/icons/oil_barrel.webp";
import { Button } from "components/ui/Button";
import Decimal from "decimal.js-light";
import { CROP_SEEDS, CropName, CropSeedName } from "features/game/types/crops";
import { isBasicCrop } from "features/game/events/landExpansion/harvest";
import { getKeys } from "features/game/types/craftables";
import { useSelector } from "@xstate/react";
import { _paused, _running } from "./CropMachine";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";

interface Props {
  show: boolean;
  queue: CropMachineQueueItem[];
  unallocatedOilTime: number;
  growingCropPackIndex?: number;
  service: MachineInterpreter;
  onClose: () => void;
  onAddSeeds: (seeds: AddSeedsInput) => void;
  onHarvest: () => void;
}

type OverlayScreen = "harvestCrops" | "addOil";

const ALLOWED_SEEDS: CropSeedName[] = getKeys(CROP_SEEDS()).filter((seed) => {
  const crop = seed.split(" ")[0] as CropName;

  return isBasicCrop(crop);
});

const INCREMENT_AMOUNT = 10;

const _growingCropPackIndex = (state: CropMachineState) =>
  state.context.growingCropPackIndex;
const _inventory = (state: MachineState) => state.context.state.inventory;

export const CropMachineModal: React.FC<Props> = ({
  show,
  queue,
  service,
  unallocatedOilTime,
  onClose,
  onAddSeeds,
  onHarvest,
}) => {
  const { gameService } = useContext(Context);

  const growingCropPackIndex = useSelector(service, _growingCropPackIndex);
  const running = useSelector(service, _running);
  const paused = useSelector(service, _paused);
  const inventory = useSelector(gameService, _inventory);

  const [selectedPackIndex, setSelectedPackIndex] = useState<number>(
    growingCropPackIndex ?? 0
  );
  const [selectedSeed, setSelectedSeed] = useState<CropSeedName>();
  const [overlayScreen, setOverlayScreen] = useState<OverlayScreen>();
  const [totalSeeds, setTotalSeeds] = useState(0);

  const { t } = useAppTranslation();

  const incrementSeeds = () => {
    setTotalSeeds((prev) => prev + INCREMENT_AMOUNT);
  };

  const decrementSeeds = () => {
    setTotalSeeds((prev) => Math.max(prev - INCREMENT_AMOUNT, 0));
  };

  const getMachineStatusLabel = () => {
    if (running) {
      return <Label type="default">{`Crop machine is running`}</Label>;
    }

    if (paused) {
      return <Label type="warning">{`Crop machine has stopped`}</Label>;
    }

    return <Label type="default">{`Crop machine is idle`}</Label>;
  };

  const getQueueItemCountLabelType = (
    packIndex: number,
    itemReady: boolean
  ) => {
    if (itemReady) return "success";

    if (packIndex === growingCropPackIndex && paused) {
      return "danger";
    }

    if (packIndex === growingCropPackIndex) return "info";

    return "default";
  };

  const canIncrement = () => {
    if (!selectedSeed) return false;

    const seedBalance = inventory[selectedSeed] ?? new Decimal(0);

    return totalSeeds + INCREMENT_AMOUNT <= seedBalance.toNumber();
  };

  const handleAddSeeds = () => {
    if (!selectedSeed) return;

    onAddSeeds({
      type: selectedSeed,
      amount: totalSeeds,
    });

    setSelectedSeed(undefined);
    setTotalSeeds(0);
  };

  const handleHarvestAllCrops = () => {
    onHarvest();
    setOverlayScreen(undefined);
    setSelectedPackIndex(0);
  };

  const selectedPack = queue[selectedPackIndex];
  const stackedQueue: (CropMachineQueueItem | null)[] = [
    ...queue,
    ...new Array(MAX_QUEUE_SIZE - queue.length).fill(null),
  ];

  const readyPacks = queue.filter((pack) => isCropPackReady(pack));

  return (
    <Modal show={show} onHide={onClose}>
      <CloseButtonPanel onClose={onClose}>
        {/* Can harvest */}
        {/* Add oil */}
        {/* Add crops */}
        {/* Main screen */}

        <div className="flex flex-col mt-1">
          <div className="mt-0.5 mb-1.5 ml-0.5">{getMachineStatusLabel()}</div>
          {/* Current crop */}
          <OuterPanel>
            {/* Growing */}
            {selectedPackIndex === growingCropPackIndex && (
              <div className="flex flex-col">
                {show && (
                  <div className="flex flex-col space-y-1 sm:space-y-0 sm:flex-row justify-between ml-2.5 mr-0.5 my-1">
                    <TimeRemainingLabel
                      paused={paused}
                      growsUntil={selectedPack.growsUntil}
                      startTime={selectedPack.startTime as number}
                      totalGrowTime={selectedPack.totalGrowTime}
                    />
                    {paused && (
                      <Label
                        type="danger"
                        icon={ITEM_DETAILS.Oil.image}
                      >{`More oil required`}</Label>
                    )}
                  </div>
                )}
                <div className="flex">
                  <Box
                    image={ITEM_DETAILS[`${selectedPack.crop} Seed`].image}
                  ></Box>
                  <div className="flex flex-col justify-center space-y-1">
                    <span className="text-xs sm:text-sm">{`${selectedPack.amount} x ${selectedPack.crop} Seeds`}</span>
                    {show && (
                      <GrowthProgressBar
                        paused={paused}
                        growsUntil={selectedPack.growsUntil}
                        startTime={selectedPack.startTime as number}
                        totalGrowTime={selectedPack.totalGrowTime}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Harvest */}
            {selectedPack && isCropPackReady(selectedPack) && (
              <div className="flex flex-col w-full">
                <div className="flex justify-between ml-2.5 mr-0.5 my-1">
                  <Label type="success" icon={SUNNYSIDE.icons.confirm}>
                    {`Ready to harvest`}
                  </Label>
                </div>
                <div className="flex w-full">
                  <Box image={ITEM_DETAILS[selectedPack.crop].image}></Box>
                  <div className="flex flex-col justify-center space-y-1">
                    <span className="text-xs sm:text-sm">{`Total crops grown: ${selectedPack.amount}`}</span>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={
                    readyPacks.length > 1
                      ? () => setOverlayScreen("harvestCrops")
                      : onHarvest
                  }
                >{`Harvest`}</Button>
              </div>
            )}
            {/* Add seeds */}
            {selectedPack === undefined && (
              <div className="flex flex-col w-full">
                {!selectedSeed ? (
                  <>
                    <Label
                      type="default"
                      icon={add}
                      className="ml-2.5 my-1"
                    >{`Pick seed`}</Label>
                    <div className="flex">
                      {ALLOWED_SEEDS.map((seed, index) => (
                        <Box
                          key={`${seed}-${index}`}
                          image={ITEM_DETAILS[seed].image}
                          isSelected={selectedSeed === seed}
                          count={inventory[seed] ?? new Decimal(0)}
                          onClick={() => setSelectedSeed(seed)}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-1">
                      <img
                        src={SUNNYSIDE.icons.arrow_left}
                        className="h-6 w-6 ml-1 cursor-pointer"
                        onClick={() => setSelectedSeed(undefined)}
                      />
                      <div className="flex justify-between w-full my-1">
                        <Label type="default">{`Add ${selectedSeed.toLocaleLowerCase()}s`}</Label>
                        {!canIncrement() && (
                          <Label type="danger">{`Not enough seeds`}</Label>
                        )}
                      </div>
                    </div>
                    <div className="flex w-full">
                      <Box image={ITEM_DETAILS[selectedSeed].image} />
                      <div className="flex w-full justify-between">
                        <div className="flex flex-col justify-center text-xs">
                          <span>{`Seeds: ${totalSeeds}/${
                            inventory[selectedSeed] ?? new Decimal(0)
                          }`}</span>
                          <span>{`Grow time: ${secondsToString(
                            calculateCropTime({
                              type: selectedSeed,
                              amount: totalSeeds,
                            }) / 1000,
                            {
                              length: "full",
                              isShortFormat: true,
                              removeTrailingZeros: true,
                            }
                          )}`}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            disabled={totalSeeds === 0}
                            onClick={decrementSeeds}
                          >{`-10`}</Button>
                          <Button
                            onClick={incrementSeeds}
                            disabled={!canIncrement()}
                          >{`+10`}</Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      disabled={totalSeeds === 0}
                      onClick={handleAddSeeds}
                    >{`Add seed pack`}</Button>
                  </div>
                )}
              </div>
            )}
            {/* Not started */}
            {!!selectedPack &&
              selectedPackIndex !== growingCropPackIndex &&
              !isCropPackReady(selectedPack) && (
                <div className="flex flex-col">
                  <Label
                    type="warning"
                    className="my-1 ml-0.5"
                  >{`Not started yet`}</Label>
                  <div className="flex">
                    <Box
                      image={ITEM_DETAILS[`${selectedPack.crop} Seed`].image}
                    />
                    <div className="flex flex-col justify-center text-xxs">
                      <span>{`Seeds: ${selectedPack.seeds}`}</span>
                      <span>{`Grow time: ${secondsToString(
                        calculateCropTime({
                          type: `${selectedPack.crop} Seed`,
                          amount: selectedPack.seeds,
                        }) / 1000,
                        {
                          length: "full",
                          isShortFormat: true,
                          removeTrailingZeros: true,
                        }
                      )}`}</span>
                    </div>
                  </div>
                </div>
              )}
          </OuterPanel>
          {/* Rest of queue */}
          <div className="flex flex-col">
            <Label
              type="default"
              className="ml-1.5 mt-2 mb-1"
              icon={SUNNYSIDE.icons.seedling}
            >{`Seed packs`}</Label>
            <div className="flex mt-1">
              {stackedQueue.map((item, index) => {
                if (item === null)
                  return (
                    <Box
                      key={index}
                      image={add}
                      onClick={() => setSelectedPackIndex(index)}
                    />
                  );

                const isReady = item.readyAt && item.readyAt < Date.now();

                return (
                  <Box
                    isSelected={index === selectedPackIndex}
                    key={index}
                    image={ITEM_DETAILS[`${item.crop} Seed`].image}
                    count={new Decimal(item.seeds)}
                    countLabelType={getQueueItemCountLabelType(
                      index,
                      !!isReady
                    )}
                    onClick={() => setSelectedPackIndex(index)}
                  />
                );
              })}
            </div>
            {show && (
              <OilRemaining
                paused={paused}
                queue={queue}
                unallocatedOilTime={unallocatedOilTime}
              />
            )}
          </div>
        </div>
        <ModalOverlay
          show={overlayScreen !== undefined}
          className="top-4"
          onBackdropClick={() => setOverlayScreen(undefined)}
        >
          <InnerPanel>
            <div className="flex flex-col space-y-2">
              <Label
                type="default"
                icon={CROP_LIFECYCLE.Sunflower.crop}
                className="ml-1.5 mt-2 mb-1"
              >{`Ready crop packs`}</Label>
              <span className="text-xs px-1.5 pb-2">{`You currently have ${readyPacks.length} crop packs to harvest! Click the harvest button to collect all your crops.`}</span>
              <div className="flex">
                {readyPacks.map((pack, index) => (
                  <Box
                    key={index}
                    image={ITEM_DETAILS[pack.crop].image}
                    count={new Decimal(pack.amount)}
                    countLabelType="success"
                    onClick={() => setSelectedPackIndex(index)}
                  />
                ))}
              </div>

              <Button
                onClick={handleHarvestAllCrops}
              >{`Harvest all crops`}</Button>
            </div>
          </InnerPanel>
        </ModalOverlay>
      </CloseButtonPanel>
    </Modal>
  );
};

const OilRemaining = ({
  paused,
  queue,
  unallocatedOilTime,
}: {
  paused: boolean;
  queue: CropMachineQueueItem[];
  unallocatedOilTime: number;
}) => {
  // update each second
  const [percentageFull, setPercentageFull] = useState(0);

  useEffect(() => {
    const totalOilMillis = getTotalOilMillisInMachine(
      queue,
      unallocatedOilTime
    );

    const percentageFull = (totalOilMillis / MAX_OIL_CAPACITY_IN_MILLIS) * 100;

    setPercentageFull(percentageFull);
  }, [queue, unallocatedOilTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (paused) return;

      const totalOilMillis = getTotalOilMillisInMachine(
        queue,
        unallocatedOilTime
      );

      const quantity = (totalOilMillis / MAX_OIL_CAPACITY_IN_MILLIS) * 100;

      setPercentageFull(quantity);
    }, 1000);
    return () => clearInterval(interval);
  }, [queue, unallocatedOilTime, paused]);

  return (
    <div className="flex">
      <div className="flex my-2 ml-1.5 space-x-2 items-center">
        <img src={oilBarrel} style={{ width: `${PIXEL_SCALE * 13}px` }} />
        <div className="flex flex-col justify-evenly h-full">
          <ResizableBar
            percentage={percentageFull}
            type={percentageFull < 10 ? "error" : "quantity"}
            outerDimensions={{
              width: 44,
              height: 8,
            }}
          />
          <div className="flex">
            <div className="text-xs">{`Oil remaining: 2hrs`}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProgressProps {
  startTime: number;
  paused: boolean;
  growsUntil?: number;
  totalGrowTime: number;
}

const TimeRemainingLabel = ({
  startTime,
  paused,
  growsUntil,
  totalGrowTime,
}: ProgressProps) => {
  // Calculate initial seconds remaining
  const calculateSecondsRemaining = () => {
    if (paused && growsUntil) {
      const secondsGrown = (growsUntil - startTime) / 1000;
      return totalGrowTime - secondsGrown;
    } else {
      return (totalGrowTime - (Date.now() - startTime)) / 1000;
    }
  };

  const [secondsRemaining, setSecondsRemaining] = useState(
    calculateSecondsRemaining
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused) {
        setSecondsRemaining((totalGrowTime - (Date.now() - startTime)) / 1000);
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, startTime, totalGrowTime]);

  const seconds = Math.max(secondsRemaining, 0);
  const time = secondsToString(seconds, {
    length: "short",
    isShortFormat: true,
    removeTrailingZeros: true,
  });

  return (
    <Label
      type="info"
      icon={SUNNYSIDE.icons.stopwatch}
      className="capitalize"
    >{`Grow time remaining: ${time}`}</Label>
  );
};

const GrowthProgressBar = ({
  startTime,
  totalGrowTime,
  growsUntil,
  paused,
}: ProgressProps) => {
  // Calculate initial progress
  const calculateProgress = () => {
    if (paused && growsUntil) {
      const progressUntilPaused =
        ((growsUntil - startTime) / totalGrowTime) * 100;
      return progressUntilPaused;
    } else {
      return ((Date.now() - startTime) / totalGrowTime) * 100;
    }
  };

  const [progress, setProgress] = useState(calculateProgress);

  useEffect(() => {
    if (progress < 100 && !paused) {
      const interval = setInterval(() => {
        setProgress(((Date.now() - startTime) / totalGrowTime) * 100);
      }, 1000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
