import React from "react";
import { Label } from "components/ui/Label";
import socialPointsIcon from "assets/icons/social_score.webp";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const LeaderboardSkeleton: React.FC = () => {
  const { t } = useAppTranslation();

  return (
    <>
      {/* Header section with title and last updated */}
      <div className="flex flex-col md:flex-row md:items-center justify-between p-1">
        <Label type="default" icon={socialPointsIcon}>
          {t("social.leaderboard")}
        </Label>
        <div className="h-3 mt-1 bg-brown-300 animate-pulse w-24"></div>
      </div>

      {/* Table skeleton */}
      <div className="w-full text-xs table-fixed border-collapse">
        {/* Table header */}
        <div className="flex border border-[#b96f50]">
          <div className="p-1.5 w-1/5 border-r border-[#b96f50]">
            <div className="h-3 bg-brown-300 animate-pulse w-8"></div>
          </div>
          <div className="p-1.5 flex-1 border-r border-[#b96f50]">
            <div className="h-3 bg-brown-300 animate-pulse w-12"></div>
          </div>
          <div className="p-1.5 w-1/5">
            <div className="h-3 bg-brown-300 animate-pulse w-8"></div>
          </div>
        </div>

        {/* Table body - skeleton rows */}
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className={`flex border-l border-r border-b border-[#b96f50] ${
              index % 2 === 0 ? "bg-[#ead4aa]" : ""
            }`}
          >
            <div className="p-1.5 w-1/5 border-r border-[#b96f50]">
              <div className="h-3 bg-brown-300 animate-pulse w-6"></div>
            </div>
            <div className="p-1.5 flex-1 border-r border-[#b96f50] text-left pl-1 relative">
              <div className="h-3 bg-brown-300 animate-pulse w-16"></div>
            </div>
            <div className="p-1.5 w-1/5">
              <div className="h-3 bg-brown-300 animate-pulse w-8"></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
