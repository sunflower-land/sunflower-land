import React from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { GiveawayBoardContent } from "features/giveaway/ui/GiveawayBoardContent";
import type { ContentComponentProps } from "../types";

/**
 * Community Games experiment: browse the mini-games running during the weekly
 * streams (race, log chop, egg catch), join whatever's live, or view recent
 * results. Reuses the same board body shown in the town-hall streamer modal —
 * joining navigates into the event, which unmounts this settings panel.
 */
export const CommunityGamesExperimentSettings: React.FC<
  ContentComponentProps
> = () => {
  const { t } = useAppTranslation();

  return (
    <div className="flex flex-col gap-2 m-1 min-h-[200px] content-start">
      <p className="text-sm text-start opacity-90">
        {t("gameOptions.experiments.communityGamesDescription")}
      </p>
      <GiveawayBoardContent />
    </div>
  );
};
