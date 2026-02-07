import React, { useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import milestone from "assets/icons/red_medal.webp";
import giftIcon from "assets/icons/gift.png";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";
import { ITEM_DETAILS } from "features/game/types/images";
import { Bar } from "components/ui/ProgressBar";
import { ColorPanel, OuterPanel } from "components/ui/Panel";
import { getChapterCollectionForDisplay } from "features/game/types/collections";
import {
  getChapterTicket,
  getCurrentChapter,
} from "features/game/types/chapters";
import { useNow } from "lib/utils/hooks/useNow";
import { useGame } from "features/game/GameProvider";
import { getTrackProgress } from "features/world/ui/tracks/ChapterTracks";
import { Modal } from "components/ui/Modal";
import { ChapterCollections } from "features/island/hud/components/codex/pages/ChapterCollections";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ChapterTutorial } from "./ChapterTutorial";
export const ChapterIntroSection: React.FC = () => {
  const { t } = useAppTranslation();

  const { gameState } = useGame();

  const [showGuide, setShowGuide] = useState(false);
  const [showCollection, setShowCollection] = useState(false);

  const now = useNow();

  const chapter = getCurrentChapter(now);

  const ticket = getChapterTicket(now);

  const ticketCount =
    gameState.context.state.inventory[ticket]?.toNumber() ?? 0;

  const { collectibles, wearables } = getChapterCollectionForDisplay(chapter);

  const collectionCount = collectibles.length + wearables.length;
  const ownedCount =
    collectibles.filter(
      (item) => (gameState.context.state.inventory[item]?.toNumber() ?? 0) > 0,
    ).length +
    wearables.filter(
      (item) => (gameState.context.state.wardrobe[item] ?? 0) > 0,
    ).length;

  const trackProgress = getTrackProgress({
    state: gameState.context.state,
    chapter,
  });
  const rewardsClaimed = Math.max(trackProgress.premium, trackProgress.free);

  return (
    <>
      <div className="flex flex-wrap  gap-y-1 mb-2">
        <div className="w-full sm:w-1/3 pr-1">
          <ColorPanel type="default" className="w-full h-full">
            <div className="flex flex-col w-full relative h-full">
              <div className="flex justify-between items-center p-1 pl-2 bg-[#3e8948]">
                <p className="text-xs text-white">
                  {t("chapterDashboard.tickets", { ticket })}
                </p>
                <div className="flex  items-center">
                  <p className="text-xs text-white mr-0.5">{ticketCount}</p>
                  <img src={ITEM_DETAILS[ticket].image} className="h-5" />
                </div>
              </div>
              <div className="h-24 w-full sm:h-32 relative">
                <img
                  src={SUNNYSIDE.announcement.grass_bg}
                  className="h-full w-full sm:object-cover"
                />

                <div className="absolute inset-0 flex justify-around items-center">
                  <div className="h-12 w-20 relative">
                    <div className="absolute top-0 left-0">
                      <NPCIcon parts={NPC_WEARABLES["pumpkin' pete"]} />
                    </div>
                    <div className="absolute top-0 right-0">
                      <NPCIcon parts={NPC_WEARABLES["cornwell"]} />
                    </div>
                    <div className="absolute top-6 left-5">
                      <NPCIcon parts={NPC_WEARABLES["poppy"]} />
                    </div>
                  </div>

                  <img src={SUNNYSIDE.icons.chevron_right} className="h-8" />

                  <img
                    src={ITEM_DETAILS[ticket].image}
                    className="h-12 img-highlight-heavy"
                  />
                </div>
              </div>

              <p className="text-xs px-2 pb-1 mt-1">
                {t("chapterDashboard.earnTicketsDescription", {
                  ticket,
                })}
              </p>
              <p
                className="text-xxs underline px-2 mb-2 mt-auto cursor-pointer"
                onClick={() => setShowGuide(true)}
              >
                {t("chapterDashboard.howToEarnTickets", { ticket })}
              </p>
            </div>
          </ColorPanel>
        </div>
        <div className="w-full sm:w-1/3 pr-1">
          <ColorPanel type="default" className="w-full h-full">
            <div className="flex flex-col w-full relative h-full">
              <div className="flex justify-between items-center p-1 pl-2 bg-[#8a4836]">
                <p className="text-xs text-white">
                  {t("marketplace.collection")}
                </p>
                <div className="flex  items-center">
                  <p className="text-xs text-white mr-0.5">
                    {`${ownedCount}/${collectionCount}`}
                  </p>
                  <Bar
                    percentage={(ownedCount / collectionCount) * 100}
                    type="progress"
                  />
                </div>
              </div>
              <div className="h-24 w-full sm:h-32 relative">
                <img
                  src={SUNNYSIDE.announcement.autumn_bg}
                  className="h-full w-full sm:object-cover"
                />

                <div className="absolute inset-0 overflow-hidden flex flex-wrap gap-x-2 gap-y-2 p-2 justify-around items-center">
                  {collectibles.map((collectible, index) => (
                    <div key={collectible} className="h-10 relative">
                      <img
                        src={ITEM_DETAILS[collectible].image}
                        className={classNames("h-12", {
                          silhouette: index % 2 === 1,
                          "opacity-50": index % 2 === 1,
                        })}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs px-2 pb-1 mt-1">
                {t("chapterDashboard.collectiblesDescription", {
                  count: collectionCount,
                })}
              </p>
              <p
                className="text-xxs underline px-2 mb-2 mt-auto cursor-pointer"
                onClick={() => setShowCollection(true)}
              >
                {t("chapterDashboard.viewProgress")}
              </p>
            </div>
          </ColorPanel>
        </div>
        <div className="w-full sm:w-1/3 pr-1 sm:pr-0 ">
          <ColorPanel type="default" className="w-full h-full">
            <div className="flex flex-col w-full relative h-full">
              <div className="flex justify-between items-center p-1 pl-2 bg-[#3e8948]">
                <p className="text-xs text-white">{t("rewards")}</p>
                <div className="flex  items-center">
                  <p className="text-xs text-white mr-0.5">{rewardsClaimed}</p>
                  <img src={giftIcon} className="h-5" />
                </div>
              </div>
              <div className="h-24 w-full sm:h-32 relative">
                <img
                  src={SUNNYSIDE.announcement.spring_bg}
                  className="h-full w-full sm:object-cover"
                />

                <div className="absolute inset-0 flex justify-center items-center gap-x-2">
                  <img src={giftIcon} className="h-10 " />
                  <img src={milestone} className="h-12" />
                  <img src={giftIcon} className="h-10" />
                </div>
              </div>

              <p className="text-xs px-2 pb-1 mt-1">
                {t("chapterDashboard.earnPointsForTasks", { chapter })}
              </p>
              <p className="text-xxs italic px-2 mb-2 mt-auto">
                {t("chapterDashboard.viewRewardsBelow")}
              </p>
            </div>
          </ColorPanel>
        </div>
      </div>

      <Modal show={showGuide} onHide={() => setShowGuide(false)}>
        <CloseButtonPanel
          tabs={[
            {
              icon: SUNNYSIDE.icons.expression_chat,
              name: t("guide"),
              id: "guide",
            },
          ]}
          onClose={() => setShowGuide(false)}
        >
          <ChapterTutorial />
        </CloseButtonPanel>
      </Modal>

      <Modal show={showCollection} onHide={() => setShowCollection(false)}>
        <OuterPanel>
          <ChapterCollections
            onClose={() => setShowCollection(false)}
            state={gameState.context.state}
            selected={chapter}
          />
        </OuterPanel>
      </Modal>
    </>
  );
};
