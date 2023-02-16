import React, { useContext, useEffect, useRef, useState } from "react";
import { useActor } from "@xstate/react";
import classNames from "classnames";
import { v4 as uuidv4 } from "uuid";

import selectBox from "assets/ui/select/select_box.png";
import well from "assets/buildings/well1.png";

import { Context } from "features/game/GameProvider";
import {
  Reward,
  FERTILISERS,
  PlantedCrop,
  InventoryItemName,
} from "features/game/types/game";
import { CropName, CROPS } from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE, POPOVER_TIME_MS } from "features/game/lib/constants";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { Soil } from "features/island/plots/components/Soil";
import { harvestAudio, plantAudio } from "lib/utils/sfx";
import { isPlotFertile } from "features/game/events/landExpansion/plant";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import Spritesheet from "components/animation/SpriteAnimator";
import { HARVEST_PROC_ANIMATION } from "features/island/plots/lib/plant";
import { isReadyToHarvest } from "features/game/events/landExpansion/harvest";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";
import { Bar } from "components/ui/ProgressBar";
import { ChestReward } from "features/island/common/chest-reward/ChestReward";
import { GoldenCropModal } from "features/island/plots/components/GoldenCropModal";
import golden_crop_sheet from "assets/events/golden_crop/golden_crop_sheet.png";
import { SUNNYSIDE } from "assets/sunnyside";
interface Props {
  plotIndex: number;
  expansionIndex: number;
  onboarding?: boolean;
}

const REMOVE_CROP_TIMEOUT = 5000; // 5 seconds

export const Plot: React.FC<Props> = ({ plotIndex, expansionIndex }) => {
  const { gameService, selectedItem, showTimers } = useContext(Context);
  const [game] = useActor(gameService);
  const [showPopover, setShowPopover] = useState(false);
  const [showSelectBox, setShowSelectBox] = useState(false);
  const [showCropDetails, setShowCropDetails] = useState(false);
  const [isFertileModalOpen, setIsFertileModalOpen] = useState(false);
  const [procAnimation, setProcAnimation] = useState<JSX.Element | null>();
  const { setToast } = useContext(ToastContext);
  const [touchCount, setTouchCount] = useState(0);
  const [reward, setReward] = useState<Reward | null>(null);
  const clickedAt = useRef<number>(0);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isMobile] = useIsMobile();
  //Golden Crop event
  const [showGoldenCropModal, setShowGoldenCropModal] = useState(false);
  const expansion = game.context.state.expansions[expansionIndex];
  const plot = expansion.plots?.[plotIndex];

  const crop = plot && plot.crop;

  const isFertile = isPlotFertile({
    plotIndex,
    expansionIndex,
    gameState: game.context.state,
  });

  const playing = game.matches("playing") || game.matches("autosaving");

  // If selected item changes, then stop removing crops
  useEffect(() => setIsRemoving(false), [selectedItem]);

  // If enough time has passed, then stop removing crops
  useEffect(() => {
    if (!isRemoving) return;
    const timer = setTimeout(() => setIsRemoving(false), REMOVE_CROP_TIMEOUT);
    return () => clearTimeout(timer);
  }, [isRemoving]);

  const displayPopover = async () => {
    setShowPopover(true);
    await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
    setShowPopover(false);
  };

  const harvestCrop = (crop: PlantedCrop) => {
    try {
      const newState = gameService.send("crop.harvested", {
        index: plotIndex,
        expansionIndex,
      });

      if (!newState.matches("hoarding")) {
        harvestAudio.play();

        // firework animation
        if (crop.amount && crop.amount >= 10) {
          setProcAnimation(
            <Spritesheet
              className="absolute pointer-events-none"
              style={{
                top: `${PIXEL_SCALE * -23}px`,
                left: `${PIXEL_SCALE * -10}px`,
                width: `${PIXEL_SCALE * HARVEST_PROC_ANIMATION.size}px`,
                imageRendering: "pixelated",
              }}
              image={HARVEST_PROC_ANIMATION.sprites[crop.name]}
              widthFrame={HARVEST_PROC_ANIMATION.size}
              heightFrame={HARVEST_PROC_ANIMATION.size}
              fps={HARVEST_PROC_ANIMATION.fps}
              steps={HARVEST_PROC_ANIMATION.steps}
              onPause={() => setProcAnimation(<></>)}
            />
          );
        }
        // golden crop event animation
        const rewardName = crop?.reward?.items?.[0].name;
        if (rewardName === "Golden Crop") {
          setProcAnimation(
            <Spritesheet
              className="absolute pointer-events-none"
              style={{
                top: `${PIXEL_SCALE * -23}px`,
                left: `${PIXEL_SCALE * -10}px`,
                width: `${PIXEL_SCALE * HARVEST_PROC_ANIMATION.size}px`,
                imageRendering: "pixelated",
              }}
              image={golden_crop_sheet}
              widthFrame={HARVEST_PROC_ANIMATION.size}
              heightFrame={HARVEST_PROC_ANIMATION.size}
              fps={6}
              steps={HARVEST_PROC_ANIMATION.steps}
              onPause={() => setProcAnimation(<></>)}
            />
          );
        }

        setToast({
          icon: ITEM_DETAILS[crop.name].image,
          content: `+${crop.amount || 1}`,
        });
      }
    } catch (e) {
      // TODO - catch more elaborate errors
      displayPopover();
    }
  };

  // Temp shovel disable
  // const removeCrop = () => {
  //   if (!isRemoving) {
  //     setIsRemoving(true);
  //     return;
  //   }
  //   gameService.send("crop.removed", {
  //     item: selectedItem,
  //     index: plotIndex,
  //     expansionIndex,
  //   });
  //   setIsRemoving(false);
  // };

  const onCollectReward = (success: boolean) => {
    setReward(null);
    setTouchCount(0);
    setShowGoldenCropModal(false);

    if (success && crop) {
      const rewardItemName = reward?.items?.[0].name;
      const rewardItemAmount = reward?.items?.[0].amount;
      setToast({
        icon: ITEM_DETAILS[rewardItemName as InventoryItemName].image,
        content: `+${rewardItemAmount}`,
      });
      harvestCrop(crop);
    }
  };

  const handleMouseHover = () => {
    setShowSelectBox(!isMobile);

    if (!crop) {
      return;
    }

    const now = Date.now();
    const isReady = isReadyToHarvest(now, crop, CROPS()[crop.name]);
    const isJustPlanted = now - crop.plantedAt < 1000;

    // show details if field is NOT ready and NOT just planted
    if (!isReady && !isJustPlanted) {
      // set state to show details
      setShowCropDetails(true);
    }
  };

  const handleMouseLeave = () => {
    // set state to hide details
    setShowCropDetails(false);
    setShowSelectBox(false);
  };

  const onClick = (analytics: boolean | undefined = undefined) => {
    // small buffer to prevent accidental double clicks
    const now = Date.now();
    if (now - clickedAt.current < 100) {
      return;
    }

    clickedAt.current = now;

    // already looking at a reward
    if (reward) {
      return;
    }

    // increase touch count if there is a reward
    if (crop?.reward && isReadyToHarvest(now, crop, CROPS()[crop.name])) {
      if (touchCount < 1) {
        // Add to touch count for reward pickup
        setTouchCount((count) => count + 1);
        return;
      }

      if (crop?.reward?.items?.[0].name === "Golden Crop") {
        console.log("golden crop");
        setShowGoldenCropModal(true);
      }
      // They have touched enough!
      setReward(crop.reward);

      return;
    }

    // plant
    if (!crop) {
      try {
        gameService.send("seed.planted", {
          index: plotIndex,
          expansionIndex,
          item: selectedItem,
          analytics,
          cropId: uuidv4(),
        });

        plantAudio.play();

        setToast({
          icon: ITEM_DETAILS[selectedItem as CropName].image,
          content: `-1`,
        });
      } catch (e) {
        // TODO - catch more elaborate errors
        displayPopover();
      }

      return;
    }

    // Temp shovel disable
    // remove crop
    // if (
    //   selectedItem === "Shovel" &&
    //   !isReadyToHarvest(now, crop, CROPS()[crop.name])
    // ) {
    //   removeCrop();
    //   return;
    // }

    // apply fertilisers
    if (selectedItem && selectedItem in FERTILISERS) {
      try {
        gameService.send("crop.fertilised", {
          plotIndex,
          expansionIndex,
          fertiliser: selectedItem,
        });

        return;
        // TODO - sound effects
      } catch {
        displayPopover();
      }
    }

    // harvest crop
    try {
      harvestCrop(crop);
    } catch (e) {
      // TODO - catch more elaborate errors
      displayPopover();
    }

    setTouchCount(0);
  };

  const notFertileCallback = () => setIsFertileModalOpen(!isFertileModalOpen);

  if (!isFertile) {
    return (
      <>
        <Modal centered show={isFertileModalOpen} onHide={notFertileCallback}>
          <Panel>
            <img
              src={SUNNYSIDE.icons.close}
              className="absolute cursor-pointer z-20"
              onClick={notFertileCallback}
              style={{
                top: `${PIXEL_SCALE * 6}px`,
                right: `${PIXEL_SCALE * 6}px`,
                width: `${PIXEL_SCALE * 11}px`,
              }}
            />
            <p className="text-center">These crops need water!</p>
            <p className="text-center mt-4">
              In order to support more crops, build a well.
              <span>
                <img
                  src={well}
                  alt="well image"
                  className="mx-auto w-16 my-4"
                />
              </span>
            </p>
          </Panel>
        </Modal>
        <div className="w-full h-full relative cursor-pointer hover:img-highlight">
          <img
            src={SUNNYSIDE.soil.soil_dry}
            alt="soil image"
            className="absolute"
            style={{
              top: `${PIXEL_SCALE * 2}px`,
              width: `${PIXEL_SCALE * 16}px`,
            }}
            onClick={notFertileCallback}
          />
        </div>
      </>
    );
  }

  // onMouseUp is needed for PC to prevent lingering issues if clicking the crop results in showing the crop reward modal
  const onMouseUpProps = isMobile
    ? {}
    : { onMouseUp: () => handleMouseLeave() };

  return (
    <div
      onMouseEnter={handleMouseHover}
      onMouseLeave={handleMouseLeave}
      {...onMouseUpProps}
      className="w-full h-full relative"
    >
      {/* Crop base image */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
        }}
      >
        <Soil
          showTimers={showTimers}
          plantedCrop={crop}
          showCropDetails={showCropDetails}
          isRemoving={isRemoving}
        />
      </div>

      {/* Health bar for collecting rewards */}
      <div
        className={classNames(
          "transition-opacity pointer-events-none absolute",
          {
            "opacity-100": touchCount > 0,
            "opacity-0": touchCount === 0,
          }
        )}
        style={{
          top: `${PIXEL_SCALE * 9}px`,
          width: `${PIXEL_SCALE * 15}px`,
        }}
      >
        <Bar percentage={100 - touchCount * 50} type="health" />
      </div>

      {/* Popover */}
      <div
        className={classNames(
          "transition-opacity absolute top-6 w-full z-40 pointer-events-none flex justify-center",
          {
            "opacity-100": showPopover,
            "opacity-0": !showPopover,
          }
        )}
      >
        <img className="w-5" src={SUNNYSIDE.icons.cancel} />
      </div>

      {/* Firework animation */}
      {procAnimation}

      {/* Select box */}
      {playing && (
        <img
          src={selectBox}
          className={classNames("absolute z-40 cursor-pointer", {
            "opacity-100": showSelectBox,
            "opacity-0": !showSelectBox,
          })}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
          }}
          onClick={() => onClick()}
        />
      )}

      {/* Golden Crop Event */}
      {showGoldenCropModal && (
        <GoldenCropModal
          show={showGoldenCropModal}
          onContinue={() => onCollectReward(true)}
        />
      )}

      {/* Crop reward */}
      {!showGoldenCropModal && (
        <ChestReward
          reward={reward}
          onCollected={onCollectReward}
          onOpen={() =>
            gameService.send("cropReward.collected", {
              plotIndex,
              expansionIndex,
            })
          }
        />
      )}
    </div>
  );
};
