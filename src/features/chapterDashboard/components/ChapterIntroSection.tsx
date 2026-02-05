import React, { useEffect, useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { pixelGrayBorderStyle } from "features/game/lib/style";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import { getSystemMessage } from "features/auth/actions/systemMessage";
import banner from "assets/ui/banner.png";
import milestone from "assets/icons/medal_side_grey.webp";
import { Label } from "components/ui/Label";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";
import { ITEM_DETAILS } from "features/game/types/images";
import { Bar } from "components/ui/ProgressBar";
export const ChapterIntroSection: React.FC = () => {
  const { t } = useAppTranslation();

  return (
    <div className="flex">
      <div
        className={classNames(`w-full md:w-1/3 text-xs mt-1 relative mb-1`)}
        style={{
          background: "#c0cbdc",
          color: "#181425",
          ...pixelGrayBorderStyle,
        }}
      >
        <div className="flex flex-col  w-full relative">
          <img src={SUNNYSIDE.tutorial.cooking} className="w-full" />
          <Label
            type="warning"
            icon={ITEM_DETAILS.Floater.image}
            className="absolute top-1 right-1"
          >
            24
          </Label>
          <p className="text-xs px-1 mt-1">
            Complete deliveries, chores & tasks to earn Floaters. Spend Floaters
            at the Shop, Auctions & Raffles.
          </p>
          <p className="text-xxs underline p-1">Read more</p>
        </div>
      </div>

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
          <img src={SUNNYSIDE.tutorial.cooking} className="w-full" />
          <div className="absolute top-1 right-1">
            <Bar percentage={50} type="progress" />
          </div>
          <p className="text-xs px-1 mt-1">
            Collect the 24 exclusive NFTs and fill your collection before the
            Chapter ends.
          </p>
          <p className="text-xxs underline p-1">View progress</p>
        </div>
      </div>

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
          <img src={SUNNYSIDE.tutorial.cooking} className="w-full" />
          <div className="absolute top-1 right-1">
            <img src={milestone} className="h-8" />
          </div>
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
