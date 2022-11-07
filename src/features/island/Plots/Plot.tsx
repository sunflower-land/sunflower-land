import React, { useContext, useEffect, useRef, useState } from "react";
import { useActor } from "@xstate/react";
import classNames from "classnames";

import selectBox from "assets/ui/select/select_box.png";
import cancel from "assets/icons/cancel.png";
import soilNotFertile from "assets/land/soil_not_fertile.png";
import well from "assets/buildings/well1.png";
import close from "assets/icons/close.png";

import { Context } from "features/game/GameProvider";
import {
  CropReward as Reward,
  FERTILISERS,
  PlantedCrop,
} from "features/game/types/game";
import { CropName, CROPS } from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  GRID_WIDTH_PX,
  PIXEL_SCALE,
  POPOVER_TIME_MS,
} from "features/game/lib/constants";
import { ToastContext } from "features/game/toast/ToastQueueProvider";
import { Soil } from "features/farming/crops/components/Soil";
import { harvestAudio, plantAudio } from "lib/utils/sfx";
import { HealthBar } from "components/ui/HealthBar";
import { CropReward } from "features/farming/crops/components/CropReward";
import { isPlotFertile } from "features/game/events/landExpansion/plant";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import Spritesheet from "components/animation/SpriteAnimator";
import { HARVEST_PROC_ANIMATION } from "features/farming/crops/lib/plant";
import { isReadyToHarvest } from "features/game/events/landExpansion/harvest";

interface Props {
  plotIndex: number;
  expansionIndex: number;
  className?: string;
  onboarding?: boolean;
}

const REMOVE_CROP_TIMEOUT = 5000; // 5 seconds

export const Plot: React.FC<Props> = ({
  className,
  plotIndex,
  expansionIndex,
}) => {
  const { gameService, selectedItem } = useContext(Context);
  const [game] = useActor(gameService);
  const [showPopover, setShowPopover] = useState(false);
  const [popover, setPopover] = useState<JSX.Element | null>();
  const [showCropDetails, setShowCropDetails] = useState(false);
  const [isFertileModalOpen, setIsFertileModalOpen] = useState(false);
  const [procAnimation, setProcAnimation] = useState<JSX.Element | null>();
  const { setToast } = useContext(ToastContext);
  const [touchCount, setTouchCount] = useState(0);
  const [reward, setReward] = useState<Reward | null>(null);
  const clickedAt = useRef<number>(0);
  const [isRemoving, setIsRemoving] = useState(false);

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
      gameService.send("crop.harvested", {
        index: plotIndex,
        expansionIndex,
      });

      harvestAudio.play();

      // firework animation
      if (crop.amount && crop.amount >= 10) {
        setProcAnimation(
          <Spritesheet
            className="absolute pointer-events-none bottom-[4px] -left-[26px]"
            style={{
              width: `${HARVEST_PROC_ANIMATION.size * PIXEL_SCALE}px`,
              imageRendering: "pixelated",
            }}
            image={HARVEST_PROC_ANIMATION.sprites[crop.name]}
            widthFrame={HARVEST_PROC_ANIMATION.size}
            heightFrame={HARVEST_PROC_ANIMATION.size}
            fps={HARVEST_PROC_ANIMATION.fps}
            steps={HARVEST_PROC_ANIMATION.steps}
            hiddenWhenPaused={true}
          />
        );
      }

      setToast({
        icon: ITEM_DETAILS[crop.name].image,
        content: `+${crop.amount || 1}`,
      });
    } catch (e: any) {
      // TODO - catch more elaborate errors
      displayPopover();
    }
  };

  const removeCrop = () => {
    if (!isRemoving) {
      setIsRemoving(true);
      return;
    }
    gameService.send("crop.removed", {
      item: selectedItem,
      index: plotIndex,
      expansionIndex,
    });
    setIsRemoving(false);
  };

  const onCollectReward = (success: boolean) => {
    setReward(null);
    setTouchCount(0);

    if (success && crop) {
      harvestCrop(crop);
    }
  };

  const handleMouseHover = () => {
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
  };

  const onClick = (analytics: boolean | undefined = undefined) => {
    // Small buffer to prevent accidental double clicks
    const now = Date.now();
    if (now - clickedAt.current < 100) {
      return;
    }

    clickedAt.current = now;

    // Already looking at a reward
    if (reward) {
      return;
    }

    if (crop?.reward && isReadyToHarvest(now, crop, CROPS()[crop.name])) {
      if (touchCount < 1) {
        // Add to touch count for reward pickup
        setTouchCount((count) => count + 1);
        return;
      }

      // They have touched enough!
      setReward(crop.reward);

      return;
    }

    // Plant
    if (!crop) {
      try {
        gameService.send("seed.planted", {
          index: plotIndex,
          expansionIndex,
          item: selectedItem,
          analytics,
        });

        plantAudio.play();

        setToast({
          icon: ITEM_DETAILS[selectedItem as CropName].image,
          content: `-1`,
        });
      } catch (e: any) {
        // TODO - catch more elaborate errors
        displayPopover();
      }

      return;
    }

    // Remove crop
    if (
      selectedItem === "Shovel" &&
      !isReadyToHarvest(now, crop, CROPS()[crop.name])
    ) {
      removeCrop();
      return;
    }

    if (selectedItem && selectedItem in FERTILISERS) {
      try {
        gameService.send("crop.fertilised", {
          index: plotIndex,
          expansionIndex,
          fertiliser: selectedItem,
        });

        return;
        // TODO - sound effects
      } catch {
        displayPopover();
      }
    }

    try {
      harvestCrop(crop);
    } catch (e: any) {
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
          <Panel className="relative">
            <img
              src={close}
              className="absolute w-6 top-4 right-4 cursor-pointer z-20"
              onClick={notFertileCallback}
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
        <div
          className={classNames("relative group", className)}
          style={{
            width: `${GRID_WIDTH_PX}px`,
            height: `${GRID_WIDTH_PX}px`,
          }}
        >
          <img
            src={soilNotFertile}
            alt="soil image"
            className="w-full cursor-pointer hover:img-highlight absolute bottom-1"
            onClick={notFertileCallback}
          />
        </div>
      </>
    );
  }

  return (
    <div
      onMouseEnter={handleMouseHover}
      onMouseLeave={handleMouseLeave}
      className={classNames("relative group", className)}
      style={{
        width: `${GRID_WIDTH_PX}px`,
        height: `${GRID_WIDTH_PX}px`,
      }}
    >
      <div className="absolute bottom-1 w-full h-full">
        <Soil
          className="absolute bottom-0 pointer-events-none"
          plantedCrop={crop}
          showCropDetails={showCropDetails}
          isRemoving={isRemoving}
        />

        <div
          className={classNames(
            "transition-opacity pointer-events-none absolute -bottom-2 left-1",
            {
              "opacity-100": touchCount > 0,
              "opacity-0": touchCount === 0,
            }
          )}
        >
          <HealthBar percentage={100 - touchCount * 50} />
        </div>
        <div
          className={classNames(
            "transition-opacity absolute -bottom-2 w-full z-20 pointer-events-none flex justify-center",
            {
              "opacity-100": showPopover,
              "opacity-0": !showPopover,
            }
          )}
        >
          <img className="w-5" src={cancel} />
        </div>
        <img
          src={selectBox}
          style={{
            opacity: 0.1,
            visibility: "hidden",
          }}
          className="absolute inset-0 w-full opacity-0 sm:group-hover:opacity-100 sm:hover:!opacity-100 z-20 cursor-pointer"
          onClick={() => onClick(true)}
        />
        {playing && (
          <img
            src={selectBox}
            style={{
              opacity: 0.1,
            }}
            className="absolute block inset-0 w-full opacity-0 sm:group-hover:opacity-100 sm:hover:!opacity-100 z-30 cursor-pointer"
            onClick={() => onClick()}
          />
        )}
        <CropReward
          reward={reward}
          onCollected={onCollectReward}
          fieldIndex={plotIndex}
        />
      </div>
      {procAnimation}
    </div>
  );
};
