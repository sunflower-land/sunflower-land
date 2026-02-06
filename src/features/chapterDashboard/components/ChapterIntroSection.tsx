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
import { ColorPanel } from "components/ui/Panel";
import { CHAPTER_COLLECTIONS } from "features/game/types/collections";
import { getCurrentChapter } from "features/game/types/chapters";
import { useNow } from "lib/utils/hooks/useNow";
export const ChapterIntroSection: React.FC = () => {
  const { t } = useAppTranslation();

  const now = useNow();

  const chapter = getCurrentChapter(now);
  const collection = CHAPTER_COLLECTIONS[chapter];
  const collectibles = collection?.collectibles;

  return (
    <div className="flex gap-x-1">
      <ColorPanel type="default" className="w-1/3">
        <div className="flex flex-col  w-full relative ">
          <div className="flex justify-between items-center p-1 pl-2 bg-[#51ac69]">
            <p className="text-xs text-white">Floaters</p>
            <div className="flex  items-center">
              <p className="text-xs text-white">24</p>
              <img src={ITEM_DETAILS.Floater.image} className="h-5" />
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

              <img
                src={ITEM_DETAILS.Floater.image}
                className="h-12 img-highlight-heavy"
              />
            </div>
          </div>

          <p className="text-xs px-2 pb-1 mt-1">
            Complete deliveries, chores & tasks to earn Floaters. Spend Floaters
            at the Shop, Auctions & Raffles.
          </p>
          <p className="text-xxs underline px-2 mb-2">Read more</p>
        </div>
      </ColorPanel>

      <ColorPanel type="default" className="w-1/3">
        <div className="flex flex-col  w-full relative ">
          <div className="flex justify-between items-center p-1 pl-2 bg-[#51ac69]">
            <p className="text-xs text-white">Collection</p>
            <div className="flex  items-center">
              <p className="text-xs text-white">0/24</p>
              <Bar percentage={50} type="progress" />
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
                  <img src={ITEM_DETAILS[collectible].image} className="h-12" />
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs px-2 pb-1 mt-1">
            Collect the 24 exclusive NFTs and fill your collection before the
            Chapter ends.
          </p>
          <p className="text-xxs underline px-2 mb-2">View progress</p>
        </div>
      </ColorPanel>

      <div
        className={classNames(
          `w-full md:w-1/3 text-xs mt-1 relative mb-1 mx-1`,
        )}
        style={{
          background: "#c0cbdc",
          color: "#181425",
          ...pixelGrayBorderStyle,
        }}
      >
        <div className="flex flex-col  w-full">
          <div className="flex justify-between items-center p-1 pl-2 bg-brown-100">
            <p className="text-xs">Rewards</p>
            <div className="flex  items-center">
              <p className="text-xs yield-text">3</p>
              <img src={giftIcon} className="h-5" />
            </div>
          </div>

          <img src={SUNNYSIDE.tutorial.cooking} className="w-full" />

          <p className="text-xs px-1 mt-1">
            Complete Floater tasks to earn points to unlock free rewards below.
          </p>
          <p className="text-xxs underline p-1">View progress</p>
        </div>
      </div>
    </div>
  );
  // return (
  //   <div
  //     className={classNames(`w-full text-xs p-2 pr-4 mt-1 relative mb-1`)}
  //     style={{
  //       background: "#c0cbdc",
  //       color: "#181425",
  //       ...pixelGrayBorderStyle,
  //     }}
  //   >
  //     <div className="flex flex-col items-center w-full">
  //       <img src={banner} className="h-12 " />
  //       <Label type="info" className="-mt-2">
  //         X Days Left
  //       </Label>
  //     </div>

  //     <div className="flex">
  //       <div className="w-1/3 px-2">
  //         <div className="flex">
  //           <div className="relative w-12 h-12">
  //             <NPCIcon parts={NPC_WEARABLES["Chun Long"]} />
  //           </div>
  //           <p className="text-xs">
  //             Complete deliveries, chores & tasks to earn Floaters.
  //           </p>
  //         </div>
  //       </div>

  //       <div className="w-1/3 px-2">
  //         <div className="flex">
  //           <div className="relative w-12 h-12">
  //             <NPCIcon parts={NPC_WEARABLES["Chun Long"]} />
  //           </div>
  //           <p className="text-xs">
  //             Complete deliveries, chores & tasks to earn Floaters.
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};
