import React, { useEffect, useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { pixelGrayBorderStyle } from "features/game/lib/style";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import { getSystemMessage } from "features/auth/actions/systemMessage";
import banner from "assets/ui/banner.png";
import milestone from "assets/icons/red_medal.webp";
import giftIcon from "assets/icons/gift.png";
import { Label } from "components/ui/Label";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";
import { ITEM_DETAILS } from "features/game/types/images";
import { Bar } from "components/ui/ProgressBar";
import { ColorPanel, OuterPanel } from "components/ui/Panel";
import { CHAPTER_COLLECTIONS } from "features/game/types/collections";
import {
  CHAPTER_BANNER_IMAGES,
  ChapterBanner,
  getChapterBannerImage,
  getChapterTicket,
  getCurrentChapter,
} from "features/game/types/chapters";
import { useNow } from "lib/utils/hooks/useNow";
import { useGame } from "features/game/GameProvider";
import { getKeys } from "features/game/lib/crafting";
import { getTrackProgress } from "features/world/ui/tracks/ChapterTracks";
import { Modal } from "components/ui/Modal";
import { ChapterCollections } from "features/island/hud/components/codex/pages/ChapterCollections";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { BANNERS } from "features/game/types/banners";
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
  const collection = CHAPTER_COLLECTIONS[chapter];
  let collectibles = collection?.collectibles;

  // Shuffle collectibles
  collectibles = collectibles?.sort(() => Math.random() - 0.5);

  let collectionCount =
    (collection?.collectibles ?? []).length +
    (collection?.wearables ?? []).length;
  let ownedCount =
    (collection?.collectibles ?? []).filter(
      (item) => (gameState.context.state.inventory[item]?.toNumber() ?? 0) > 0,
    ).length +
    (collection?.wearables ?? []).filter(
      (item) => (gameState.context.state.wardrobe[item] ?? 0) > 0,
    ).length;

  const trackProgress = getTrackProgress({
    state: gameState.context.state,
    chapter,
  });
  const rewardsClaimed = Math.max(trackProgress.premium, trackProgress.free);

  return (
    <>
      <div className="flex gap-x-1 mb-1">
        <ColorPanel type="default" className="w-1/3">
          <div className="flex flex-col w-full relative h-full">
            <div className="flex justify-between items-center p-1 pl-2 bg-[#3e8948]">
              <p className="text-xs text-white">{ticket}s</p>
              <div className="flex  items-center">
                <p className="text-xs text-white mr-0.5">{ticketCount}</p>
                <img src={ITEM_DETAILS[ticket].image} className="h-5" />
              </div>
            </div>
            <div className="h-32 relative">
              <img
                src={SUNNYSIDE.announcement.grass_bg}
                className="h-full object-cover"
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
                  src={ITEM_DETAILS.Floater.image}
                  className="h-12 img-highlight-heavy"
                />
              </div>
            </div>

            <p className="text-xs px-2 pb-1 mt-1">
              Complete deliveries, chores & bounties to earn the Floater
              currency.
            </p>
            <p
              className="text-xxs underline px-2 mb-2 mt-auto cursor-pointer"
              onClick={() => setShowGuide(true)}
            >
              How to earn {ticket}s?
            </p>
          </div>
        </ColorPanel>

        <ColorPanel type="default" className="w-1/3">
          <div className="flex flex-col w-full relative h-full">
            <div className="flex justify-between items-center p-1 pl-2 bg-[#8a4836]">
              <p className="text-xs text-white">Collection</p>
              <div className="flex  items-center">
                <p className="text-xs text-white mr-0.5">
                  {ownedCount}/{collectionCount}
                </p>
                <Bar
                  percentage={(ownedCount / collectionCount) * 100}
                  type="progress"
                />
              </div>
            </div>
            <div className="h-32 relative">
              <img
                src={SUNNYSIDE.announcement.autumn_bg}
                className="h-full object-cover"
              />

              <div className="absolute inset-0 overflow-hidden flex flex-wrap gap-x-2 gap-y-2 p-2 justify-around items-center">
                {collectibles?.reverse().map((collectible, index) => (
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
              Collect the {collectionCount} exclusive NFTs available this
              chapter.
            </p>
            <p
              className="text-xxs underline px-2 mb-2 mt-auto cursor-pointer"
              onClick={() => setShowCollection(true)}
            >
              View progress
            </p>
          </div>
        </ColorPanel>

        <ColorPanel type="default" className="w-1/3">
          <div className="flex flex-col w-full relative h-full">
            <div className="flex justify-between items-center p-1 pl-2 bg-[#3e8948]">
              <p className="text-xs text-white">Rewards</p>
              <div className="flex  items-center">
                <p className="text-xs text-white mr-0.5">{rewardsClaimed}</p>
                <img src={giftIcon} className="h-5" />
              </div>
            </div>
            <div className="h-32 relative">
              <img
                src={SUNNYSIDE.announcement.spring_bg}
                className="h-full object-cover"
              />

              <div className="absolute inset-0 flex justify-center items-center gap-x-2">
                <img src={giftIcon} className="h-10 " />
                <img src={milestone} className="h-12" />
                <img src={giftIcon} className="h-10" />
              </div>
            </div>

            <p className="text-xs px-2 pb-1 mt-1">
              Earn points each time you complete a Floater task.
            </p>
            <p className="text-xxs italic px-2 mb-2 mt-auto">
              See rewards below
            </p>
          </div>
        </ColorPanel>
      </div>

      <Modal show={showGuide} onHide={() => setShowGuide(false)}>
        <CloseButtonPanel
          tabs={[
            {
              icon: SUNNYSIDE.icons.expression_chat,
              name: "Guide",
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
            state={gameState.context.state}
            selected={chapter}
          />
        </OuterPanel>
      </Modal>
    </>
  );
};
