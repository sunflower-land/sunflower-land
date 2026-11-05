import React, { useContext, useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { useTranslation } from "react-i18next";
import type { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { CraftingBoxModalContent } from "./components/CraftingBoxModalContent";
import { ProgressBar } from "components/ui/ProgressBar";
import type { CraftingQueueItem } from "features/game/types/game";
import type { BoostWindow } from "features/game/lib/boostWindows";
import { useNodeTimer } from "features/game/lib/useNodeTimer";
import { useCraftingQueue } from "./components/useCraftingQueue";

import craftingBoxAnimation from "assets/buildings/crafting_box_animation.webp";

interface CraftingTimerProps {
  item: CraftingQueueItem;
  startedAt: number | undefined;
  windows: BoostWindow[];
}

const CraftingTimer: React.FC<CraftingTimerProps> = ({
  item,
  startedAt,
  windows,
}) => {
  // One timer for both models. A windowed craft (`baseDurationMs` set) ticks at
  // the boosted rate; a legacy one falls through to the plain countdown on
  // `readyAt`.
  const { workLeftSeconds, countdownSeconds } = useNodeTimer({
    startedAt: startedAt ?? item.readyAt,
    baseDurationMs: item.baseDurationMs,
    windows,
    legacyReadyAt: item.readyAt,
  });

  // How full the bar is tracks remaining WORK, never the displayed reading - the
  // two differ whenever a boost is running.
  const totalSeconds =
    item.baseDurationMs === undefined
      ? Math.max((item.readyAt - (startedAt ?? item.readyAt)) / 1000, 1)
      : Math.max(item.baseDurationMs / 1000, 1);
  const leftSeconds =
    item.baseDurationMs === undefined ? countdownSeconds : workLeftSeconds;

  const percentage = Math.min(
    ((totalSeconds - leftSeconds) / totalSeconds) * 100,
    100,
  );

  return (
    <div
      className="flex justify-center absolute"
      style={{
        bottom: 0,
        width: `${PIXEL_SCALE * 46}px`,
        left: `${PIXEL_SCALE * 0.5}px`,
      }}
    >
      <ProgressBar
        percentage={percentage}
        type="progress"
        formatLength="short"
        seconds={countdownSeconds}
        style={{
          width: `${PIXEL_SCALE * 14}px`,
        }}
      />
    </div>
  );
};

const _craftingBox = (state: MachineState) => state.context.state.craftingBox;

export const CraftingBox: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const { t } = useTranslation();

  const { gameService, showTimers } = useContext(Context);

  const craftingBox = useSelector(gameService, _craftingBox);

  // The island building, the modal and the queue slots all read their timings
  // from this one hook, so they cannot disagree about what is ready.
  const { craftingQueue, timings, windows, inProgress, readyProducts } =
    useCraftingQueue(craftingBox);

  const hasReadyItem = readyProducts.length > 0;
  const hasInProgressItem = inProgress.length > 0;
  const nextInProgress = inProgress[0];
  const nextInProgressIndex = craftingQueue.findIndex(
    (item) => item.id === nextInProgress?.id,
  );

  const handleOpen = () => {
    gameService.send("SAVE");
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);

  return (
    <>
      <BuildingImageWrapper name="Crafting Box" onClick={handleOpen}>
        <div
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 46}px`,
            bottom: `${PIXEL_SCALE * 0}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
        >
          <img
            src={
              hasInProgressItem
                ? craftingBoxAnimation
                : ITEM_DETAILS["Crafting Box"].image
            }
            alt={t("crafting.craftingBox")}
            className={`cursor-pointer hover:img-highlight absolute`}
            style={{
              left: `${PIXEL_SCALE * -1}px`,
              width: `${PIXEL_SCALE * 46}px`,
              bottom: `${PIXEL_SCALE * 0}px`,
            }}
          />
          {showTimers && hasInProgressItem && nextInProgress && (
            <CraftingTimer
              item={nextInProgress}
              startedAt={timings[nextInProgressIndex]?.startedAt}
              windows={windows}
            />
          )}
        </div>
        {hasReadyItem && (
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            className="absolute -top-8 ready -ml-[5px] left-1/2 transform -translate-x-1/2 z-20"
            style={{ width: `${PIXEL_SCALE * 4}px` }}
          />
        )}
      </BuildingImageWrapper>

      <Modal show={showModal} onHide={handleClose}>
        <CraftingBoxModalContent onClose={handleClose} />
      </Modal>
    </>
  );
};
