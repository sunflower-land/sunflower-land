import React, { useState } from "react";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { InnerPanel } from "components/ui/Panel";
import { createPortal } from "react-dom";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import sfl from "assets/icons/token_2.png";
import { Modal } from "react-bootstrap";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const HalveningCountdown: React.FC = () => {
  const start = useCountdown(new Date("2023-07-10").getTime());
  const [showModal, setShowModal] = useState(false);

  const { t } = useAppTranslation();

  if (Date.now() > new Date("2023-07-10").getTime()) {
    return null;
  }

  return createPortal(
    <>
      <Modal show={showModal} centered onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          className="text-shadow"
          onClose={() => setShowModal(false)}
          bumpkinParts={NPC_WEARABLES.grimbly}
        >
          <div className="p-2">
            <p className="text-sm mb-2">
              {t("halveningCountdown.approaching")}
            </p>
            <p className="text-sm mb-2">
              {t("halveningCountdown.description")}
            </p>
            <p className="text-sm mb-2">
              {t("halveningCountdown.preparation")}
            </p>
            <a
              href="https://docs.sunflower-land.com/economy/economic-controls/dynamic-supply-and-demand"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-white text-xs"
            >
              {t("read.more")}
            </a>
          </div>
        </CloseButtonPanel>
      </Modal>

      <InnerPanel
        className="fixed bottom-2 left-2 cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div>
          <div className="flex -mb-1">
            <img src={sfl} className="h-5 mr-1" />
            <p className="text-xs underline">{t("halveningCountdown.title")}</p>
            <img src={sfl} className="h-5 ml-1" />
          </div>
          <TimerDisplay time={start} />
        </div>
      </InnerPanel>
    </>,
    document.body
  );
};
