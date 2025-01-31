import React from "react";
import { TicketsLeaderboard } from "./TicketsLeaderboard";
import { TicketLeaderboard } from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { InnerPanel } from "components/ui/Panel";
import {
  CHAPTER_TICKET_NAME,
  ChapterName,
  secondsLeftInChapter,
} from "features/game/types/chapters";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";

import chores from "assets/icons/chores.webp";
import lock from "assets/icons/lock.png";

import { ChapterAuctions } from "../components/ChapterAuctions";
import classNames from "classnames";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ChapterStore } from "features/world/ui/megastore/ChapterStore";
import { ITEM_DETAILS } from "features/game/types/images";
import { FlowerBountiesModal } from "features/world/ui/flowerShop/FlowerBounties";
import { BertObsession } from "features/world/ui/npcs/Bert";
import { GameState } from "features/game/types/game";
import { ChapterMutants } from "../components/ChapterMutants";

const CHAPTER_GRAPHICS: Record<ChapterName, string> = {
  "Solar Flare": "?",
  "Dawn Breaker": "?",
  "Witches' Eve": "?",
  "Catch the Kraken": "?",
  "Spring Blossom": "?",
  "Clash of Factions": "?",
  "Pharaoh's Treasure": SUNNYSIDE.announcement.desertSeason,
  "Bull Run": SUNNYSIDE.announcement.bullRunSeason,
  "Winds of Change": "",
};

interface Props {
  id: string;
  isLoading: boolean;
  data: TicketLeaderboard | null;
  chapter: ChapterName;
  state: GameState;
  farmId: number;
}

export const Chapter: React.FC<Props> = ({
  id,
  isLoading,
  data,
  chapter,
  state,
  farmId,
}) => {
  const { t } = useAppTranslation();
  const { bertObsession: currentObsession, npcs, inventory, wardrobe } = state;
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
              {`${secondsToString(secondsLeftInChapter(), { length: "short" })} left`}
            </Label>
          </div>
          <p className="text-xs">
            {t("chapter.codex.intro", { ticket: CHAPTER_TICKET_NAME[chapter] })}
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
              {t("chapter.codex.howToEarn", {
                ticket: CHAPTER_TICKET_NAME[chapter],
              })}
            </Label>

            {Date.now() < new Date("2024-11-06").getTime() && (
              <Label icon={lock} type="danger">
                {t("coming.soon")}
              </Label>
            )}
          </div>
          {Date.now() < new Date("2024-11-06").getTime() && (
            <div className="mb-2">
              <span className="text-xs">
                {t("chapter.codex.howToEarn.comingSoon")}
              </span>
            </div>
          )}
          <NoticeboardItems
            iconWidth={8}
            items={[
              {
                text: t("chapter.codex.howToEarn.one"),
                icon: SUNNYSIDE.icons.player,
              },
              {
                text: t("chapter.codex.howToEarn.two"),
                icon: chores,
              },
              {
                text: t("chapter.codex.howToEarn.three"),
                icon: ITEM_DETAILS["White Pansy"].image,
              },
            ]}
          />
        </div>
      </InnerPanel>
      <InnerPanel className="mb-1">
        <FlowerBountiesModal readonly state={state} />
      </InnerPanel>
      <InnerPanel className="mb-1">
        <BertObsession
          readonly
          currentObsession={currentObsession}
          npcs={npcs}
          inventory={inventory}
          wardrobe={wardrobe}
        />
      </InnerPanel>
      <InnerPanel className="mb-1">
        <ChapterStore readonly state={state} />
      </InnerPanel>
      <ChapterAuctions gameState={state} farmId={farmId} chapter={chapter} />
      <ChapterMutants chapter={chapter} />
      <InnerPanel className="mb-1">
        <TicketsLeaderboard id={id} isLoading={isLoading} data={data} />
      </InnerPanel>
    </div>
  );
};
