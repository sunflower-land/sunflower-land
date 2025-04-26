import React, { useState } from "react";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { ButtonPanel } from "components/ui/Panel";
import travelIcon from "assets/icons/world_small.png";
import { getActiveFloatingIsland } from "features/game/types/floatingIsland";
import { useGame } from "features/game/GameProvider";
import { Modal } from "components/ui/Modal";
import { HotAirBalloon } from "features/loveIsland/HotAirBalloon";

const Countdown: React.FC<{
  startAt: number;
  endAt: number;
  onHide: () => void;
}> = ({ startAt, endAt, onHide }) => {
  const start = useCountdown(startAt);
  const end = useCountdown(endAt);
  const { t } = useAppTranslation();

  return (
    <div>
      <div className="flex">
        <Label type="default" className="ml-1" icon={travelIcon}>
          <div
            className="sm:max-w-[350px] max-w-[150px]"
            style={{
              // maxWidth: "155px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {t("floatingIsland.isLive")}
          </div>
        </Label>
        <img
          src={SUNNYSIDE.icons.close}
          className="h-5 cursor-pointer ml-2"
          onClick={onHide}
        />
      </div>
      <TimerDisplay time={end} />
    </div>
  );
};

export const FloatingIslandCountdown: React.FC = () => {
  const [hide, setHide] = useState(false);
  const { gameState } = useGame();

  const [showModal, setShowModal] = useState(false);
  const event = getActiveFloatingIsland({
    state: gameState.context.state,
  });

  if (!event || hide) {
    return null;
  }

  return (
    <>
      <ButtonPanel
        className="flex justify-center"
        id="test-stream"
        onClick={() => setShowModal(true)}
      >
        <Countdown
          startAt={event.startAt}
          endAt={event.endAt}
          onHide={() => setHide(true)}
        />
      </ButtonPanel>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <HotAirBalloon onClose={() => setShowModal(false)} />
      </Modal>
    </>
  );
};
