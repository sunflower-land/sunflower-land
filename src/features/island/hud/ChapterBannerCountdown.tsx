import React, { useContext, useState } from "react";
import { ButtonPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";

import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";

import {
  getCurrentChapter,
  getChapterBanner,
  CHAPTERS,
} from "features/game/types/chapters";
import { getChapterWeek } from "lib/utils/getChapterWeek";
import { getBumpkinLevel } from "features/game/lib/level";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { ModalContext } from "features/game/components/modal/ModalProvider";

const _level = (state: MachineState) =>
  getBumpkinLevel(state.context.state.bumpkin.experience);

const _hasBanner = (state: MachineState) =>
  state.context.state.inventory[getChapterBanner()];

export const ChapterBannerCountdown: React.FC = () => {
  const { gameService } = useContext(Context);
  const level = useSelector(gameService, _level);
  const hasBanner = useSelector(gameService, _hasBanner);
  const { openModal } = useContext(ModalContext);

  const chapter = getCurrentChapter();
  const chapterWeek = getChapterWeek();

  const offerEndsAt =
    CHAPTERS[chapter].startDate.getTime() + 7 * 24 * 60 * 60 * 1000;

  const end = useCountdown(offerEndsAt);

  const initialShow =
    // They have not yet got the banner
    !hasBanner &&
    // Don't show for new players
    level >= 10 &&
    // Only show in week 1
    chapterWeek === 1 &&
    Date.now() < offerEndsAt;

  const [isClosed, setIsClosed] = useState(!initialShow);

  if (isClosed) return null;

  return (
    <ButtonPanel
      onClick={() => {
        openModal("VIP_ITEMS");
        setIsClosed(true);
      }}
      className="flex justify-center"
      id="emblem-airdrop"
    >
      <div>
        <div className="h-6 flex justify-between">
          <Label
            type="info"
            className="ml-1 mr-1"
            icon={SUNNYSIDE.icons.stopwatch}
          >
            {`Season offer`}
          </Label>

          <img
            src={SUNNYSIDE.icons.close}
            className="h-5 cursor-pointer"
            onClick={(e) => {
              setIsClosed(true);
              e.stopPropagation();
            }}
          />
        </div>
        <TimerDisplay time={end} />
      </div>
    </ButtonPanel>
  );
};
