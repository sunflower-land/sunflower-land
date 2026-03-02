import React, { useContext, useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { useTranslation } from "react-i18next";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { CraftingBoxModalContent } from "./components/CraftingBoxModalContent";
import { ProgressBar } from "components/ui/ProgressBar";
import { useCountdown } from "lib/utils/hooks/useCountdown";

import craftingBoxAnimation from "assets/buildings/crafting_box_animation.webp";
import { useNow } from "lib/utils/hooks/useNow";

interface CraftingTimerProps {
  readyAt: number;
  startedAt: number;
}

const CraftingTimer: React.FC<CraftingTimerProps> = ({
  readyAt,
  startedAt,
}) => {
  const { totalSeconds: secondsLeft } = useCountdown(readyAt);
  const totalRunningSeconds = Math.max((readyAt - startedAt) / 1000, 1);
  const elapsedSeconds = Math.max(totalRunningSeconds - secondsLeft, 0);
  const percentage = Math.min(
    (elapsedSeconds / totalRunningSeconds) * 100,
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
        seconds={secondsLeft}
        style={{
          width: `${PIXEL_SCALE * 14}px`,
        }}
      />
    </div>
  );
};

const _craftingStatus = (state: MachineState) =>
  state.context.state.craftingBox.status;
const _craftingReadyAt = (state: MachineState) =>
  state.context.state.craftingBox.readyAt;
const _craftingStartedAt = (state: MachineState) =>
  state.context.state.craftingBox.startedAt;

export const CraftingBox: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const { t } = useTranslation();

  const { gameService, showTimers } = useContext(Context);

  const craftingStatus = useSelector(gameService, _craftingStatus);
  const craftingReadyAt = useSelector(gameService, _craftingReadyAt);
  const craftingStartedAt = useSelector(gameService, _craftingStartedAt);
  const now = useNow({ live: true, autoEndAt: craftingReadyAt });

  const isCrafting =
    craftingStatus === "crafting" && craftingReadyAt && craftingReadyAt > now;
  const isReady =
    craftingStatus === "crafting" && craftingReadyAt && craftingReadyAt <= now;

  const handleOpen = () => {
    gameService.send({ type: "SAVE" });
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
              craftingStatus === "crafting" && !isReady
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
          {showTimers && isCrafting && craftingReadyAt && craftingStartedAt && (
            <CraftingTimer
              readyAt={craftingReadyAt}
              startedAt={craftingStartedAt}
            />
          )}
        </div>
        {isReady && (
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
