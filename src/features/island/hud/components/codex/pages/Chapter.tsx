import React from "react";
import { TicketsLeaderboard } from "./TicketsLeaderboard";
import { TicketLeaderboard } from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { InnerPanel } from "components/ui/Panel";
import {
  CHAPTER_TICKET_NAME,
  ChapterName,
  CHAPTERS,
  secondsLeftInChapter,
} from "features/game/types/chapters";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";

import chores from "assets/icons/chores.webp";

import { ChapterAuctions } from "../components/ChapterAuctions";
import classNames from "classnames";
import { ChapterMutants } from "../components/ChapterMutants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ChapterStore } from "features/world/ui/megastore/ChapterStore";
import { ITEM_DETAILS } from "features/game/types/images";
import { GameState } from "features/game/types/game";
import { MegaBountyBoardContent } from "features/world/ui/flowerShop/MegaBountyBoard";
import { useNow } from "lib/utils/hooks/useNow";

export const CHAPTER_GRAPHICS: Record<ChapterName, string> = {
  "Solar Flare": "?",
  "Dawn Breaker": "?",
  "Witches' Eve": "?",
  "Catch the Kraken": "?",
  "Spring Blossom": "?",
  "Clash of Factions": "?",
  "Pharaoh's Treasure": SUNNYSIDE.announcement.desertSeason,
  "Bull Run": SUNNYSIDE.announcement.bullRunSeason,
  "Winds of Change": SUNNYSIDE.announcement.windsOfChangeSeason,
  "Great Bloom": "",
  "Better Together": SUNNYSIDE.announcement.betterTogetherSeason,
  "Paw Prints": SUNNYSIDE.announcement.pawPrintsSeason,
};

const CHORES_DELIVERIES_START_DATE: Record<ChapterName, string> = {
  "Solar Flare": "?",
  "Dawn Breaker": "?",
  "Witches' Eve": "?",
  "Catch the Kraken": "?",
  "Spring Blossom": "?",
  "Clash of Factions": "?",
  "Pharaoh's Treasure": "?",
  "Bull Run": "Nov 11th",
  "Winds of Change": "Feb 10th",
  "Great Bloom": "May 5th",
  "Better Together": "Aug 4th",
  "Paw Prints": "Nov 10th",
};

interface Props {
  isLoading: boolean;
  data: TicketLeaderboard | null;
  chapter: ChapterName;
  state: GameState;
  farmId: number;
}

export const Chapter: React.FC<Props> = ({
  isLoading,
  data,
  chapter,
  state,
  farmId,
}) => {
  const { t } = useAppTranslation();
  const now = useNow({
    live: true,
    autoEndAt: CHAPTERS[chapter].endDate.getTime(),
  });

  return (
    <div
      className={classNames(
        "flex flex-col h-full overflow-hidden overflow-y-auto scrollable",
      )}
    >
      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex justify-between mb-1 flex-wrap">
            <Label className="-ml-1 mb-1" type="default">
              {chapter}
            </Label>
            <Label
              type="info"
              className="mb-1"
              icon={SUNNYSIDE.icons.stopwatch}
            >
              {`${secondsToString(secondsLeftInChapter(now), { length: "short" })} left`}
            </Label>
          </div>
          <p className="text-xs">
            {t("season.codex.intro", { ticket: CHAPTER_TICKET_NAME[chapter] })}
          </p>
        </div>
      </InnerPanel>
      <InnerPanel className="mb-1">
        <div
          style={{
            backgroundImage: `url(${CHAPTER_GRAPHICS[chapter]})`,
            imageRendering: "pixelated",
            height: "125px",
            backgroundSize: "600px",
            backgroundPosition: "center",
            margin: "-3px",
          }}
        ></div>
      </InnerPanel>
      <InnerPanel className="mb-1">
        <div className="p-1">
          <div className="flex justify-between mb-2">
            <Label className="-ml-1" type="default">
              {t("season.codex.howToEarn", {
                ticket: CHAPTER_TICKET_NAME[chapter],
              })}
            </Label>
          </div>
          <NoticeboardItems
            iconWidth={8}
            items={[
              {
                text: t("season.codex.howToEarn.one"),
                icon: SUNNYSIDE.icons.player,
              },
              {
                text: t("season.codex.howToEarn.two", {
                  date: CHORES_DELIVERIES_START_DATE[chapter],
                }),
                icon: chores,
              },
              {
                text: t("season.codex.howToEarn.three", {
                  date: CHORES_DELIVERIES_START_DATE[chapter],
                }),
                icon: ITEM_DETAILS["White Pansy"].image,
              },
            ]}
          />
        </div>
      </InnerPanel>
      <MegaBountyBoardContent readonly />
      <InnerPanel className="mb-1">
        <ChapterStore readonly state={state} />
      </InnerPanel>
      <ChapterAuctions gameState={state} farmId={farmId} chapter={chapter} />
      <ChapterMutants chapter={chapter} />
      <InnerPanel className="mb-1">
        <TicketsLeaderboard isLoading={isLoading} data={data} />
      </InnerPanel>
    </div>
  );
};
