import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "components/ui/Modal";
import { CropMachineQueueItem } from "features/game/types/game";
import {
  CropMachineState,
  MachineInterpreter,
  isCropPackReady,
} from "./lib/cropMachine";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { ResizableBar } from "components/ui/ProgressBar";
import { Label } from "components/ui/Label";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import {
  AddSeedsInput,
  MAX_OIL_CAPACITY_IN_MILLIS,
  MAX_QUEUE_SIZE,
  calculateCropTime,
  getOilTimeInMillis,
  getTotalOilMillisInMachine,
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
import { _paused, _running, _idle } from "./CropMachine";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { calculateCropProgress } from "./lib/calculateCropProgress";
import lightning from "assets/icons/lightning.png";

interface Props {
  show: boolean;
  queue: CropMachineQueueItem[];
  unallocatedOilTime: number;
  growingCropPackIndex?: number;
  service: MachineInterpreter;
  onClose: () => void;
  onAddSeeds: (seeds: AddSeedsInput) => void;
  onHarvest: () => void;
  onAddOil: (oil: number) => void;
}

type OverlayScreen = "harvestCrops" | "addOil";

const ALLOWED_SEEDS: CropSeedName[] = getKeys(CROP_SEEDS()).filter((seed) => {
  const crop = seed.split(" ")[0] as CropName;

  return isBasicCrop(crop);
});

const SEED_INCREMENT_AMOUNT = 10;
const OIL_INCREMENT_AMOUNT = 1;

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
  onAddOil,
}) => {
  const { gameService } = useContext(Context);

  const growingCropPackIndex = useSelector(service, _growingCropPackIndex);
  const idle = useSelector(service, _idle);
  const running = useSelector(service, _running);
  const paused = useSelector(service, _paused);
  const inventory = useSelector(gameService, _inventory);

  const [selectedPackIndex, setSelectedPackIndex] = useState<number>(
    growingCropPackIndex ?? 0
  );
  const [selectedSeed, setSelectedSeed] = useState<CropSeedName>();
  const [overlayScreen, setOverlayScreen] = useState<OverlayScreen>();
  const [totalSeeds, setTotalSeeds] = useState(0);
  const [totalOil, setTotalOil] = useState(0);
  const [tab, setTab] = useState(0);

  const { t } = useAppTranslation();

  useLayoutEffect(() => {
    if (show) {
      setSelectedPackIndex(growingCropPackIndex ?? 0);
      setSelectedSeed(undefined);
      setTotalSeeds(0);
    }
  }, [show]);

  const getProjectedOilTimeMillis = () => {
    const projectedOilTime = getOilTimeInMillis(totalOil);
    const projectedTotalOilTime = getTotalOilMillisInMachine(
      queue,
      unallocatedOilTime + projectedOilTime
    );

    return projectedTotalOilTime;
  };

  const canAddOneHourOfOil = () => {
    const ONE_HOUR_IN_MILLIS = 60 * 60 * 1000;

    const projectedTotalOilTime = getProjectedOilTimeMillis();
    const newProjectedTotalOilTime = projectedTotalOilTime + ONE_HOUR_IN_MILLIS;

    return newProjectedTotalOilTime <= MAX_OIL_CAPACITY_IN_MILLIS;
  };

  const incrementSeeds = () => {
    setTotalSeeds((prev) => prev + SEED_INCREMENT_AMOUNT);
  };

  const decrementSeeds = () => {
    setTotalSeeds((prev) => Math.max(prev - SEED_INCREMENT_AMOUNT, 0));
  };

  const incrementOil = () => {
    setTotalOil((prev) => prev + OIL_INCREMENT_AMOUNT);
  };

  const decrementOil = () => {
    setTotalOil((prev) => Math.max(prev - OIL_INCREMENT_AMOUNT, 0));
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

  const canIncrementSeeds = () => {
    if (!selectedSeed) return false;

    const seedBalance = inventory[selectedSeed] ?? new Decimal(0);

    return totalSeeds + SEED_INCREMENT_AMOUNT <= seedBalance.toNumber();
  };

  const canIncrementOil = () => {
    if (!canAddOneHourOfOil()) return false;

    const oilBalance = inventory.Oil ?? new Decimal(0);

    return totalOil + OIL_INCREMENT_AMOUNT <= oilBalance.toNumber();
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

  const handleAddOil = () => {
    onAddOil(totalOil);
    setTotalOil(0);
    setOverlayScreen(undefined);
  };

  const selectedPack = queue[selectedPackIndex];
  const stackedQueue: (CropMachineQueueItem | null)[] = [
    ...queue,
    ...new Array(MAX_QUEUE_SIZE - queue.length).fill(null),
  ];

  const readyPacks = queue.filter((pack) => isCropPackReady(pack));

  return (
    <Modal show={show} onHide={onClose}>
      <CloseButtonPanel
        tabs={[{ icon: SUNNYSIDE.icons.seedling, name: "Crop Machine" }]}
        currentTab={tab}
        setCurrentTab={setTab}
        onClose={onClose}
      >
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
                      readyAt={selectedPack.readyAt}
                      startTime={selectedPack.startTime as number}
                      totalGrowTime={selectedPack.totalGrowTime}
                      growTimeRemaining={selectedPack.growTimeRemaining}
                    />
                    {paused && <Label type="default">{`Paused`}</Label>}
                  </div>
                )}
                <div className="flex">
                  <Box
                    image={ITEM_DETAILS[`${selectedPack.crop} Seed`].image}
                  />
                  <div className="flex flex-col justify-center space-y-1">
                    <span className="text-xs">{`${selectedPack.amount} x ${selectedPack.crop} Seeds`}</span>
                    {show && (
                      <GrowthProgressBar
                        paused={paused}
                        growsUntil={selectedPack.growsUntil}
                        startTime={selectedPack.startTime as number}
                        totalGrowTime={selectedPack.totalGrowTime}
                        readyAt={selectedPack.readyAt}
                        growTimeRemaining={selectedPack.growTimeRemaining}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Harvest */}
            {selectedPack && isCropPackReady(selectedPack) && (
              <div className="flex flex-col w-full">
                <div className="flex justify-between ml-2.5 mr-0.5 mt-1 mb-0.5">
                  <Label type="success" icon={SUNNYSIDE.icons.confirm}>
                    {`Ready to harvest`}
                  </Label>
                  {selectedPack.amount > selectedPack.seeds && (
                    <Label type="vibrant" icon={lightning}>{`Boosted`}</Label>
                  )}
                </div>
                <div className="flex w-full">
                  <Box image={ITEM_DETAILS[selectedPack.crop].image}></Box>
                  <div className="flex flex-col justify-center space-y-1">
                    <span className="text-xs">{`Total ${selectedPack.crop}s: ${selectedPack.amount}`}</span>
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
                        <Label
                          type={
                            (inventory[selectedSeed]?.toNumber() ?? 0) < 1
                              ? "danger"
                              : "info"
                          }
                        >{`Available: ${
                          (inventory[selectedSeed]?.toNumber() ?? 0) -
                          totalSeeds
                        }`}</Label>
                      </div>
                    </div>
                    <div className="flex w-full">
                      <Box image={ITEM_DETAILS[selectedSeed].image} />
                      <div className="flex w-full justify-between">
                        <div className="flex flex-col justify-center space-y-1 text-xs">
                          <span>{`Seeds: ${totalSeeds}`}</span>
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
                            className="px-2"
                          >{`-${SEED_INCREMENT_AMOUNT}`}</Button>
                          <Button
                            onClick={incrementSeeds}
                            disabled={!canIncrementSeeds()}
                            className="px-2"
                          >{`+${SEED_INCREMENT_AMOUNT}`}</Button>
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
                    <div className="flex flex-col justify-center text-xs">
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
          {/* Queued packs */}
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
                      isSelected={index === selectedPackIndex}
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
              <OilTank
                idle={idle}
                paused={paused}
                queue={queue}
                unallocatedOilTime={unallocatedOilTime}
                onAddOil={() => setOverlayScreen("addOil")}
              />
            )}
          </div>
        </div>
        <ModalOverlay
          show={overlayScreen !== undefined}
          className="top-11"
          onBackdropClick={() => setOverlayScreen(undefined)}
        >
          <InnerPanel>
            {overlayScreen === "harvestCrops" && (
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <Label
                    type="default"
                    icon={CROP_LIFECYCLE.Sunflower.crop}
                    className="ml-1.5 mt-2 mb-1"
                  >{`Ready crop packs`}</Label>
                  <img
                    src={SUNNYSIDE.icons.close}
                    className="cursor-pointer m-0.5"
                    onClick={() => setOverlayScreen(undefined)}
                    style={{
                      width: `${PIXEL_SCALE * 9}px`,
                      height: `${PIXEL_SCALE * 9}px`,
                    }}
                  />
                </div>
                <span className="text-xs px-2 pb-2">{`You currently have ${readyPacks.length} crop packs to harvest! Click the harvest button to collect all your crops.`}</span>
                <div className="flex">
                  {readyPacks.map((pack, index) => (
                    <Box
                      key={index}
                      image={ITEM_DETAILS[pack.crop].image}
                      count={new Decimal(pack.amount)}
                      countLabelType="success"
                    />
                  ))}
                </div>

                <Button
                  onClick={handleHarvestAllCrops}
                >{`Harvest all crops`}</Button>
              </div>
            )}
            {overlayScreen === "addOil" && (
              <div className="flex flex-col space-y-1.5">
                <div className="flex justify-between">
                  <div className="flex space-x-2">
                    <Label
                      type="default"
                      icon={ITEM_DETAILS.Oil.image}
                      className="m-1.5"
                    >{`Add oil`}</Label>
                  </div>
                  <img
                    src={SUNNYSIDE.icons.close}
                    className="cursor-pointer m-0.5"
                    onClick={() => setOverlayScreen(undefined)}
                    style={{
                      width: `${PIXEL_SCALE * 9}px`,
                      height: `${PIXEL_SCALE * 9}px`,
                    }}
                  />
                </div>
                <span className="px-2 text-xs pb-1">{`Your machine needs oil to run. Every seed pack will require a certain amount of oil based on how long the crops take to grow. As you add oil you can see how long the machine will run when given that amount.`}</span>
                <div className="flex justify-between items-center">
                  <Label
                    type={
                      (inventory.Oil?.toNumber() ?? 0) < 1 ? "danger" : "info"
                    }
                    className="ml-1.5 mt-4"
                  >{`Available: ${
                    (inventory.Oil?.toNumber() ?? 0) - totalOil
                  }`}</Label>
                  <Label
                    type={!canAddOneHourOfOil() ? "danger" : "info"}
                    className="ml-1.5 mt-4"
                  >{`Max runtime: 48hrs`}</Label>
                </div>
                <div className="flex ml-1">
                  <Box image={oilBarrel} />
                  <div className="flex w-full justify-between">
                    <div className="flex flex-col justify-center text-xs space-y-1">
                      <span>{`Oil to add: ${totalOil}`}</span>
                      <span>{`Total runtime: ${secondsToString(
                        getOilTimeInMillis(totalOil) / 1000,
                        {
                          length: "full",
                          isShortFormat: true,
                          removeTrailingZeros: true,
                        }
                      )}`}</span>
                    </div>
                    <div className="flex items-center space-x-1 mr-2">
                      <Button
                        className="w-11"
                        disabled={totalOil === 0}
                        onClick={decrementOil}
                      >{`-${OIL_INCREMENT_AMOUNT}`}</Button>
                      <Button
                        className="w-11"
                        onClick={incrementOil}
                        disabled={!canIncrementOil()}
                      >{`+${OIL_INCREMENT_AMOUNT}`}</Button>
                    </div>
                  </div>
                </div>
                <Button
                  disabled={totalOil === 0}
                  onClick={handleAddOil}
                >{`Add oil`}</Button>
              </div>
            )}
          </InnerPanel>
        </ModalOverlay>
      </CloseButtonPanel>
    </Modal>
  );
};

interface IOilTank {
  idle: boolean;
  paused: boolean;
  queue: CropMachineQueueItem[];
  unallocatedOilTime: number;
  onAddOil: () => void;
}

const OilTank = ({
  idle,
  paused,
  queue,
  unallocatedOilTime,
  onAddOil,
}: IOilTank) => {
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
    if (paused || idle) {
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
  }, [queue, unallocatedOilTime, paused, idle]);

  return (
    <div>
      <Label
        type={runtime === 0 ? "danger" : "default"}
        className="ml-1.5 mt-2.5"
        icon={ITEM_DETAILS.Oil.image}
      >
        {runtime === 0 ? `More oil required` : `Oil tank`}
      </Label>
      <div className="flex items-center justify-between">
        <div className="flex my-2 ml-1.5 space-x-2 items-center">
          <img src={oilBarrel} style={{ width: `${PIXEL_SCALE * 13}px` }} />
          <div className="flex flex-col justify-evenly h-full space-y-1">
            <ResizableBar
              percentage={oilInTank}
              type={oilInTank < 10 ? "error" : "quantity"}
              outerDimensions={{
                width: 60,
                height: 8,
              }}
            />
            <div className="flex">
              <div className="text-xs">{`Machine runtime: ${secondsToString(
                runtime,
                {
                  length: "short",
                  isShortFormat: true,
                  removeTrailingZeros: true,
                }
              )}`}</div>
            </div>
          </div>
        </div>
        <div className="pr-2">
          <Button onClick={onAddOil}>{`Add oil`}</Button>
        </div>
      </div>
    </div>
  );
};

interface ProgressProps {
  startTime: number;
  paused: boolean;
  growsUntil?: number;
  readyAt?: number;
  totalGrowTime: number;
  growTimeRemaining: number;
}

const TimeRemainingLabel = ({
  startTime,
  paused,
  growsUntil,
  totalGrowTime,
  readyAt,
  growTimeRemaining,
}: ProgressProps) => {
  const getTimeRemaining = () => {
    const progress = calculateCropProgress({
      startTime,
      totalGrowTime,
      readyAt,
      growsUntil,
      growTimeRemaining,
    });
    const elapsedGrowTime = (totalGrowTime * progress) / 100;
    const remainingGrowTime = totalGrowTime - elapsedGrowTime;

    return remainingGrowTime / 1000;
  };

  const [secondsRemaining, setSecondsRemaining] = useState(getTimeRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused) {
        setSecondsRemaining(getTimeRemaining());
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
  readyAt,
  growTimeRemaining,
  paused,
}: ProgressProps) => {
  // Calculate initial progress

  // Calculate initial progress as default
  const [progress, setProgress] = useState(
    calculateCropProgress({
      startTime,
      totalGrowTime,
      readyAt,
      growsUntil,
      growTimeRemaining,
    })
  );

  useEffect(() => {
    if (progress < 100 && !paused) {
      const interval = setInterval(() => {
        setProgress(
          calculateCropProgress({
            startTime,
            totalGrowTime,
            readyAt,
            growsUntil,
            growTimeRemaining,
          })
        );
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
        width: 70,
        height: 8,
      }}
    />
  );
};
