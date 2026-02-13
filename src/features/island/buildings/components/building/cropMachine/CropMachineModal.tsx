import React, { useContext, useLayoutEffect, useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "components/ui/Modal";
import {
  Bumpkin,
  CropMachineQueueItem,
  Inventory,
} from "features/game/types/game";
import {
  CropMachineState,
  MachineInterpreter,
  isCropPackReady,
} from "./lib/cropMachine";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { Label } from "components/ui/Label";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import { millisecondsToString, secondsToString } from "lib/utils/time";
import {
  AddSeedsInput,
  BASIC_CROP_MACHINE_SEEDS,
  CROP_EXTENSION_MOD_III_SEEDS,
  CROP_EXTENSION_MOD_II_SEEDS,
  CROP_EXTENSION_MOD_I_SEEDS,
  CROP_MACHINE_PLOTS,
  MAX_OIL_CAPACITY_IN_MILLIS,
  MAX_QUEUE_SIZE,
  OIL_PER_HOUR_CONSUMPTION,
  calculateCropTime,
  getOilTimeInMillis,
} from "features/game/events/landExpansion/supplyCropMachine";
import { getTotalOilMillisInMachine } from "features/game/events/landExpansion/supplyCropMachineOil";
import add from "assets/icons/plus.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import oilBarrel from "assets/icons/oil_barrel.webp";
import { Button } from "components/ui/Button";
import Decimal from "decimal.js-light";
import { CROP_SEEDS, CropSeedName } from "features/game/types/crops";
import { useSelector } from "@xstate/react";
import { _paused, _running, _idle } from "./CropMachine";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { ModalOverlay } from "components/ui/ModalOverlay";
import lightning from "assets/icons/lightning.png";
import { PackGrowthProgressBar } from "./components/PackGrowthProgressBar";
import { TimeRemainingLabel } from "./components/TimeRemainingLabel";
import { OilTank } from "./components/OilTank";
import { formatNumber, setPrecision } from "lib/utils/formatNumber";
import { getPackYieldAmount } from "features/game/events/landExpansion/harvestCropMachine";
import { useNow } from "lib/utils/hooks/useNow";
import { hasFeatureAccess } from "lib/flags";

interface Props {
  show: boolean;
  queue: CropMachineQueueItem[];
  unallocatedOilTime: number;
  growingCropPackIndex?: number;
  service: MachineInterpreter;
  onClose: () => void;
  onAddSeeds: (seeds: AddSeedsInput) => void;
  onHarvestPack: (packIndex: number) => void;
  onRemovePack: (packIndex: number) => void;
  onAddOil: (oil: number) => void;
}

export const ALLOWED_SEEDS = (
  bumpkin: Bumpkin,
  inventory: Inventory,
): CropSeedName[] => {
  const seeds = [...BASIC_CROP_MACHINE_SEEDS];

  if (bumpkin.skills["Crop Extension Module I"]) {
    seeds.push(...CROP_EXTENSION_MOD_I_SEEDS);
  }
  if (bumpkin.skills["Crop Extension Module II"]) {
    seeds.push(...CROP_EXTENSION_MOD_II_SEEDS);
  }
  if (bumpkin.skills["Crop Extension Module III"]) {
    seeds.push(...CROP_EXTENSION_MOD_III_SEEDS);
  }

  return seeds.filter((seed) => inventory[seed]?.gt(0));
};

const _growingCropPackIndex = (state: CropMachineState) =>
  state.context.growingCropPackIndex;
const _inventory = (state: MachineState) => state.context.state.inventory;
const _state = (state: MachineState) => state.context.state;
const _farmId = (state: MachineState) => state.context.farmId;
const _farmActivity = (state: MachineState) => state.context.state.farmActivity;
export const CropMachineModalContent: React.FC<Props> = ({
  show,
  queue,
  service,
  unallocatedOilTime,
  onClose,
  onAddSeeds,
  onHarvestPack: onHarvestPack,
  onRemovePack,
  onAddOil,
}) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const now = useNow({
    live: show && queue.length > 0,
    autoEndAt: queue[queue.length - 1]?.readyAt,
  });
  const farmId = useSelector(gameService, _farmId);
  const growingCropPackIndex = useSelector(service, _growingCropPackIndex);
  const idle = useSelector(service, _idle);
  const running = useSelector(service, _running);
  const paused = useSelector(service, _paused);
  const inventory = useSelector(gameService, _inventory);
  const farmActivity = useSelector(gameService, _farmActivity);

  const [selectedPackIndex, setSelectedPackIndex] = useState<number>(
    growingCropPackIndex ?? 0,
  );
  const [selectedSeed, setSelectedSeed] = useState<CropSeedName>();
  const [showOverlayScreen, setShowOverlayScreen] = useState<boolean>(false);
  const [totalSeeds, setTotalSeeds] = useState(0);
  const [totalOil, setTotalOil] = useState(0);
  type Tab = "cropMachine";
  const [tab, setTab] = useState<Tab>("cropMachine");

  const { t } = useAppTranslation();

  useLayoutEffect(() => {
    if (show) {
      // We intentionally reset modal UI state when it opens / active pack changes.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedPackIndex(growingCropPackIndex ?? 0);
      setSelectedSeed(undefined);
      setTotalSeeds(0);
    }
  }, [show, growingCropPackIndex]);

  const getProjectedOilTimeMillis = () => {
    const projectedOilTime = getOilTimeInMillis(totalOil, state);
    const projectedTotalOilTime = getTotalOilMillisInMachine(
      queue,
      unallocatedOilTime + projectedOilTime,
      now,
    );

    return projectedTotalOilTime;
  };

  const canAddOneHourOfOil = () => {
    const ONE_HOUR_IN_MILLIS = 60 * 60 * 1000;

    const projectedTotalOilTime = getProjectedOilTimeMillis();
    const newProjectedTotalOilTime = projectedTotalOilTime + ONE_HOUR_IN_MILLIS;

    return newProjectedTotalOilTime <= MAX_OIL_CAPACITY_IN_MILLIS(state);
  };

  const incrementSeeds = (amount = 1) => {
    setTotalSeeds((prev) => prev + amount);
  };

  const decrementSeeds = (amount = 1) => {
    setTotalSeeds((prev) => Math.max(prev - amount, 0));
  };

  const incrementOil = () => {
    setTotalOil((prev) => prev + OIL_PER_HOUR_CONSUMPTION(state));
  };

  const decrementOil = () => {
    setTotalOil((prev) => Math.max(prev - OIL_PER_HOUR_CONSUMPTION(state), 0));
  };

  const calculateMaxOil = () => {
    const projectedOilTime = getProjectedOilTimeMillis();
    const getRemainingOilTime =
      MAX_OIL_CAPACITY_IN_MILLIS(state) - projectedOilTime;
    const getMaxHours = getRemainingOilTime / (60 * 60 * 1000);
    const getMaxOil = getMaxHours * OIL_PER_HOUR_CONSUMPTION(state);
    return getMaxOil;
  };

  const incrementMaxOil = () => {
    setTotalOil((prev) => prev + calculateMaxOil());
  };

  const getMachineStatusLabel = () => {
    if (running) {
      return <Label type="default">{t("cropMachine.running")}</Label>;
    }

    if (paused) {
      return <Label type="warning">{t("cropMachine.stopped")}</Label>;
    }

    return <Label type="default">{t("cropMachine.idle")}</Label>;
  };

  const canIncrementSeeds = () => {
    if (!selectedSeed) return false;

    const seedBalance = inventory[selectedSeed] ?? new Decimal(0);

    return totalSeeds + CROP_MACHINE_PLOTS(state) <= seedBalance.toNumber();
  };

  const canIncrementOil = () => {
    if (!canAddOneHourOfOil()) return false;

    const oilBalance = inventory.Oil ?? new Decimal(0);

    return totalOil + OIL_PER_HOUR_CONSUMPTION(state) <= oilBalance.toNumber();
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

  const handleHarvestCropPack = () => {
    onHarvestPack(selectedPackIndex);
    setSelectedPackIndex(0);
  };

  const handleAddOil = () => {
    onAddOil(totalOil);
    setTotalOil(0);
    setShowOverlayScreen(false);
  };

  const handlePickSeed = (seed: CropSeedName) => {
    setSelectedSeed(seed);
    setTotalSeeds(0);
  };

  const selectedPack = queue[selectedPackIndex];
  const stackedQueue: (CropMachineQueueItem | null)[] = [
    ...queue,
    ...new Array(Math.max(0, MAX_QUEUE_SIZE(state) - queue.length)).fill(null),
  ];

  const allowedSeeds = ALLOWED_SEEDS(state.bumpkin, inventory);

  const getInitialCounter = () => {
    const cropName = selectedPack?.crop;
    if (!cropName) return 0;
    const cropHarvested = farmActivity[`${cropName} Harvested`] ?? 0;
    // Look for earlier harvest of the same crop in packed queue if it hasn't been harvested yet

    const readySameCrop = queue.filter(
      (item) => item?.crop === cropName && item?.readyAt && item.readyAt < now,
    );

    const selectedIndexInReady = readySameCrop.findIndex(
      (item) => item === selectedPack,
    );
    if (selectedIndexInReady < 0) return cropHarvested;

    const sumOfSeeds = readySameCrop
      .slice(0, selectedIndexInReady)
      .reduce((acc, item) => acc + item.seeds, 0);

    return cropHarvested + sumOfSeeds;
  };

  const initialCounter = getInitialCounter();

  const cropYield = selectedPack
    ? (selectedPack.amount ??
      getPackYieldAmount({
        state,
        pack: selectedPack,
        createdAt: now,
        prngArgs: { farmId, initialCounter },
      }).amount)
    : 0;

  return (
    <CloseButtonPanel
      tabs={[
        {
          id: "cropMachine",
          icon: SUNNYSIDE.icons.seedling,
          name: t("cropMachine.name"),
        },
      ]}
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
                  {paused && (
                    <Label type="default">{t("cropMachine.paused")}</Label>
                  )}
                </div>
              )}
              <div className="flex">
                <Box image={ITEM_DETAILS[selectedPack.crop].image} />
                <div className="flex flex-col justify-center space-y-1">
                  <span className="text-xs capitalize">
                    {`${t("growing")} `}
                    {selectedPack.crop === "Potato"
                      ? `${selectedPack.crop}es`
                      : `${selectedPack.crop}s`}
                  </span>
                  {show && (
                    <PackGrowthProgressBar
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
          {selectedPack && isCropPackReady(selectedPack, now) && (
            <div className="flex flex-col w-full">
              <div className="flex justify-between ml-2.5 mr-0.5 mt-1 mb-0.5">
                <Label type="success" icon={SUNNYSIDE.icons.confirm}>
                  {t("cropMachine.readyToHarvest")}
                </Label>
                {cropYield > selectedPack.seeds && (
                  <Label type="vibrant" icon={lightning}>
                    {t("cropMachine.boosted")}
                  </Label>
                )}
              </div>
              <div className="flex w-full">
                <Box image={ITEM_DETAILS[selectedPack.crop].image}></Box>
                <div className="flex flex-col justify-center space-y-1">
                  <span className="text-xs">
                    {t("cropMachine.totalSeeds", {
                      total: selectedPack.seeds,
                    })}
                  </span>
                  <span className="text-xs">
                    {t("cropMachine.totalCrops", {
                      cropName: selectedPack.crop.toLocaleLowerCase(),
                      total: formatNumber(cropYield),
                    })}
                  </span>
                </div>
              </div>
              <Button className="w-full" onClick={handleHarvestCropPack}>
                {t("cropMachine.harvestCropPack")}
              </Button>
            </div>
          )}
          {/* Add seeds */}
          {selectedPack === undefined && (
            <div className="flex flex-col w-full">
              {!selectedSeed ? (
                allowedSeeds.length > 0 ? (
                  <>
                    <Label type="default" icon={add} className="ml-2.5 my-1">
                      {t("cropMachine.pickSeed")}
                    </Label>
                    <div className="flex flex-wrap justify-start gap-1">
                      {allowedSeeds.map((seed, index) => (
                        <Box
                          key={`${seed}-${index}`}
                          image={ITEM_DETAILS[seed].image}
                          isSelected={selectedSeed === seed}
                          count={inventory[seed] ?? new Decimal(0)}
                          onClick={() => handlePickSeed(seed)}
                          secondaryImage={
                            CROP_SEEDS[seed].yield
                              ? ITEM_DETAILS[CROP_SEEDS[seed].yield].image
                              : undefined
                          }
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <Label type="warning" className="ml-2.5 my-1">
                    {t("cropMachine.noSeeds")}
                  </Label>
                )
              ) : (
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-1">
                    <img
                      src={SUNNYSIDE.icons.arrow_left}
                      className="h-6 w-6 ml-1 cursor-pointer"
                      onClick={() => setSelectedSeed(undefined)}
                    />
                    <div className="flex justify-between w-full my-1">
                      <Label type="default">
                        {t("cropMachine.addSeeds", {
                          seedType: selectedSeed.toLocaleLowerCase(),
                        })}
                      </Label>
                      <Label
                        type={
                          (inventory[selectedSeed]?.toNumber() ?? 0) < 1
                            ? "danger"
                            : "info"
                        }
                      >
                        {t("cropMachine.availableInventory", {
                          amount:
                            (inventory[selectedSeed]?.toNumber() ?? 0) -
                            totalSeeds,
                        })}
                      </Label>
                    </div>
                  </div>
                  <div className="flex w-full">
                    <Box image={ITEM_DETAILS[selectedSeed].image} />
                    <div className="flex w-full justify-between">
                      <div className="flex flex-col justify-center space-y-1 text-xs">
                        <span>
                          {t("cropMachine.seeds", { amount: totalSeeds })}
                        </span>
                        <span>
                          {t("cropMachine.growTime", {
                            time: secondsToString(
                              calculateCropTime(
                                {
                                  type: selectedSeed,
                                  amount: totalSeeds,
                                },
                                state,
                              ).milliSeconds / 1000,
                              {
                                length: "medium",
                                isShortFormat: true,
                                removeTrailingZeros: true,
                              },
                            ),
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          disabled={totalSeeds === 0}
                          onClick={() =>
                            decrementSeeds(CROP_MACHINE_PLOTS(state))
                          }
                          className="sm:px-2"
                        >
                          <span className="text-xs sm:text-sm">
                            {`-${CROP_MACHINE_PLOTS(state)}`}
                          </span>
                        </Button>
                        <Button
                          onClick={() =>
                            incrementSeeds(CROP_MACHINE_PLOTS(state))
                          }
                          disabled={!canIncrementSeeds()}
                          className="sm:px-2"
                        >
                          <span className="text-xs sm:text-sm">
                            {`+${CROP_MACHINE_PLOTS(state)}`}
                          </span>
                        </Button>
                        <Button
                          onClick={() =>
                            incrementSeeds(
                              (inventory[selectedSeed]?.toNumber() ?? 0) -
                                totalSeeds,
                            )
                          }
                          disabled={!canIncrementSeeds()}
                          className={`px-2 w-auto min-w-min`}
                        >
                          <span className="text-xs sm:text-sm">
                            {t("cropMachine.all")}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button disabled={totalSeeds === 0} onClick={handleAddSeeds}>
                    {t("cropMachine.addSeedPack")}
                  </Button>
                </div>
              )}
            </div>
          )}
          {/* Not started */}
          {!!selectedPack &&
            selectedPackIndex !== growingCropPackIndex &&
            !isCropPackReady(selectedPack, now) && (
              <div className="flex flex-col">
                <Label type="warning" className="my-1 ml-0.5">
                  {t("cropMachine.notStartedYet")}
                </Label>
                <div className="flex">
                  <Box
                    image={ITEM_DETAILS[`${selectedPack.crop} Seed`].image}
                  />
                  <div className="flex flex-col justify-center text-xs space-y-1">
                    <span>
                      {t("cropMachine.seeds", { amount: selectedPack.seeds })}
                    </span>
                    <span>
                      {t("cropMachine.growTime", {
                        time: secondsToString(
                          calculateCropTime(
                            {
                              type: `${selectedPack.crop} Seed`,
                              amount: selectedPack.seeds,
                            },
                            state,
                          ).milliSeconds / 1000,
                          {
                            length: "medium",
                            isShortFormat: true,
                            removeTrailingZeros: true,
                          },
                        ),
                      })}
                    </span>
                  </div>
                </div>
                {hasFeatureAccess(state, "CROP_MACHINE_PACK_REMOVAL") &&
                  (selectedPack.startTime === undefined ||
                    selectedPack.startTime > now) && (
                    <Button
                      className="mt-2"
                      onClick={() => onRemovePack(selectedPackIndex)}
                    >
                      {t("cropMachine.removePack")}
                    </Button>
                  )}
              </div>
            )}
        </OuterPanel>
        {/* Queued packs */}
        <div className="flex flex-col">
          <Label
            type="default"
            className="ml-1.5 mt-2 mb-1"
            icon={SUNNYSIDE.icons.seedling}
          >
            {t("cropMachine.seedPacks")}
          </Label>
          <div className="mt-1 flex flex-wrap gap-2 justify-start">
            {stackedQueue.map((item, index) => {
              return (
                <PackBox
                  key={index}
                  item={item}
                  index={index}
                  growingCropPackIndex={growingCropPackIndex}
                  paused={paused}
                  selectedPackIndex={selectedPackIndex}
                  setSelectedPackIndex={setSelectedPackIndex}
                />
              );
            })}
          </div>
          {show && (
            <OilTank
              state={state}
              stopped={paused || idle}
              queue={queue}
              unallocatedOilTime={unallocatedOilTime}
              onAddOil={() => {
                // Reset Oil Before showing Overlay to Prevent accidental adding
                setTotalOil(0);
                setShowOverlayScreen(true);
              }}
            />
          )}
        </div>
      </div>
      <ModalOverlay
        show={showOverlayScreen}
        className="top-11"
        onBackdropClick={() => setShowOverlayScreen(false)}
      >
        <InnerPanel>
          <div className="flex flex-col space-y-1.5">
            <div className="flex justify-between">
              <div className="flex space-x-2">
                <Label
                  type="default"
                  icon={ITEM_DETAILS.Oil.image}
                  className="m-1.5"
                >
                  {t("cropMachine.addOil")}
                </Label>
              </div>
              <img
                src={SUNNYSIDE.icons.close}
                className="cursor-pointer m-0.5"
                onClick={() => setShowOverlayScreen(false)}
                style={{
                  width: `${PIXEL_SCALE * 9}px`,
                  height: `${PIXEL_SCALE * 9}px`,
                }}
              />
            </div>
            <span className="px-2 text-xs pb-1">
              {t("cropMachine.oil.description")}
            </span>
            <div className="flex justify-between items-center">
              <Label
                type={(inventory.Oil?.toNumber() ?? 0) < 1 ? "danger" : "info"}
                className="mx-1.5 mt-2"
              >
                {t("cropMachine.availableInventory", {
                  amount: formatNumber(
                    (inventory.Oil?.toNumber() ?? 0) - totalOil,
                  ),
                })}
              </Label>
              <Label
                type={!canAddOneHourOfOil() ? "danger" : "info"}
                className="mx-1.5 mt-2"
              >
                {t("cropMachine.maxRuntime", {
                  time: millisecondsToString(
                    MAX_OIL_CAPACITY_IN_MILLIS(state),
                    {
                      length: "short",
                      isShortFormat: true,
                      removeTrailingZeros: true,
                    },
                  ),
                })}
              </Label>
            </div>
            <div className="flex ml-1">
              <Box image={oilBarrel} />
              <div className="flex w-full justify-between">
                <div className="flex flex-col justify-center text-xs space-y-1">
                  <span>
                    {t("cropMachine.oilToAdd", {
                      amount: formatNumber(totalOil),
                    })}
                  </span>
                  <span>
                    {t("cropMachine.totalRuntime", {
                      time: secondsToString(
                        getOilTimeInMillis(totalOil, state) / 1000,
                        {
                          length: "medium",
                          isShortFormat: true,
                          removeTrailingZeros: true,
                        },
                      ),
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-1 mr-2">
                  <Button
                    className="w-auto"
                    disabled={totalOil === 0}
                    onClick={decrementOil}
                  >
                    {`-${setPrecision(OIL_PER_HOUR_CONSUMPTION(state))}`}
                  </Button>
                  <Button
                    className="w-auto ml-1"
                    onClick={incrementOil}
                    disabled={!canIncrementOil()}
                  >
                    {`+${setPrecision(OIL_PER_HOUR_CONSUMPTION(state))}`}
                  </Button>
                  <Button
                    className="w-auto ml-1"
                    onClick={incrementMaxOil}
                    disabled={!canIncrementOil()}
                  >
                    {t("max")}
                  </Button>
                </div>
              </div>
            </div>
            <Button disabled={totalOil === 0} onClick={handleAddOil}>
              {t("cropMachine.addOil")}
            </Button>
          </div>
        </InnerPanel>
      </ModalOverlay>
    </CloseButtonPanel>
  );
};

export const CropMachineModal: React.FC<Props> = ({
  show,
  queue,
  service,
  unallocatedOilTime,
  onClose,
  onAddSeeds,
  onHarvestPack: onHarvestPack,
  onRemovePack,
  onAddOil,
}) => (
  <Modal show={show} onHide={onClose}>
    <CropMachineModalContent
      show={show}
      queue={queue}
      unallocatedOilTime={unallocatedOilTime}
      service={service}
      onClose={onClose}
      onAddSeeds={onAddSeeds}
      onHarvestPack={onHarvestPack}
      onRemovePack={onRemovePack}
      onAddOil={onAddOil}
    />
  </Modal>
);

const PackBox: React.FC<{
  item: CropMachineQueueItem | null;
  index: number;
  growingCropPackIndex?: number;
  paused: boolean;
  selectedPackIndex: number;
  setSelectedPackIndex: (index: number) => void;
}> = ({
  item,
  index,
  growingCropPackIndex,
  paused,
  selectedPackIndex,
  setSelectedPackIndex,
}) => {
  const now = useNow({ live: true, autoEndAt: item?.readyAt });
  const getQueueItemCountLabelType = (
    packIndex: number,
    itemReady: boolean,
  ) => {
    if (itemReady) return "success";

    if (packIndex === growingCropPackIndex && paused) {
      return "danger";
    }

    if (packIndex === growingCropPackIndex) return "info";

    return "default";
  };

  if (item === null)
    return (
      <Box
        key={index}
        image={add}
        onClick={() => setSelectedPackIndex(index)}
        isSelected={index === selectedPackIndex}
      />
    );

  const isReady = item.readyAt && item.readyAt < now;

  return (
    <Box
      key={`${item.startTime}-${index}`}
      isSelected={index === selectedPackIndex}
      image={ITEM_DETAILS[`${item.crop} Seed`].image}
      count={!isReady ? new Decimal(item.seeds) : undefined}
      countLabelType={getQueueItemCountLabelType(index, !!isReady)}
      overlayIcon={
        <img
          src={SUNNYSIDE.icons.confirm}
          alt="confirm"
          className="object-contain absolute z-10"
          style={{
            width: `${PIXEL_SCALE * 8}px`,
            bottom: `${0.5}px`,
            right: `${0.5}px`,
          }}
        />
      }
      showOverlay={!!isReady}
      onClick={() => setSelectedPackIndex(index)}
    />
  );
};
