import React, { useState } from "react";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SUNNYSIDE } from "assets/sunnyside";

import { GiveawayBoardContent } from "./GiveawayBoardContent";

/** Standalone Community Games panel (opened from the Kingdom portal / widget).
 * The Play / Results tabs sit on the panel itself. */
export const GiveawayBoard: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { t } = useAppTranslation();
  const [tab, setTab] = useState<"play" | "results">("play");

  return (
    <CloseButtonPanel
      currentTab={tab}
      setCurrentTab={setTab}
      tabs={[
        {
          icon: SUNNYSIDE.icons.player,
          name: t("giveaway.play"),
          id: "play",
        },
        {
          icon: SUNNYSIDE.icons.treasure,
          name: t("giveaway.results"),
          id: "results",
        },
      ]}
      onClose={onClose}
    >
      <GiveawayBoardContent tab={tab} />
    </CloseButtonPanel>
  );
};
