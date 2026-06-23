import React, { useState } from "react";

import { Modal } from "components/ui/Modal";
import { ColorPanel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PIXEL_SCALE } from "features/game/lib/constants";

import calendarIcon from "assets/icons/calendar.webp";
import { DiscordRoadmap } from "./DiscordRoadmap";

/**
 * Default color panel shown beneath the mailbox modal on the News tab.
 * A cheers icon on the left and a CTA that opens the roadmap modal on top,
 * which loads and lists the upcoming features.
 */
export const RoadmapWidget: React.FC = () => {
  const { t } = useAppTranslation();
  const [showRoadmap, setShowRoadmap] = useState(false);

  return (
    <>
      <ColorPanel
        type="default"
        onClick={() => setShowRoadmap(true)}
        className="mt-1 flex items-center p-1 py-2 cursor-pointer hover:brightness-95"
      >
        <img
          src={calendarIcon}
          className="mr-3 ml-1"
          style={{ width: `${PIXEL_SCALE * 11}px` }}
        />
        <div>
          <p className="text-xs">{t("roadmap.cta")}</p>
          <p className="text-xxs underline">{t("roadmap.button")}</p>
        </div>
      </ColorPanel>

      <Modal show={showRoadmap} onHide={() => setShowRoadmap(false)} size="lg">
        <CloseButtonPanel
          title={t("roadmap.title")}
          onClose={() => setShowRoadmap(false)}
        >
          <DiscordRoadmap />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
