import React from "react";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { isMobile } from "mobile-device-detect";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

export const FollowerFeedSkeleton: React.FC = () => {
  const { t } = useTranslation();

  return (
    <InnerPanel
      id="follower-feed"
      className={classNames("flex flex-col", {
        "w-full": isMobile,
        "w-2/5": !isMobile,
      })}
    >
      <div className="flex flex-col max-h-[70%] h-[270px] sm:max-h-none sm:h-auto sm:flex-grow gap-1 overflow-y-auto mb-1">
        <div className="sticky top-0 bg-brown-200 z-10 pb-1">
          <Label type="default">{t("activity")}</Label>
        </div>

        <div className="flex flex-col gap-1">
          {/* Skeleton messages */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-1 p-1">
              <div className="flex gap-1">
                <div className="w-6 h-6 bg-brown-300 animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-2 bg-brown-300 animate-pulse w-20 mb-1"></div>
                  <div className="h-3 bg-brown-300 animate-pulse w-32"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </InnerPanel>
  );
};
