import React, { useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";

import tradeIcon from "assets/icons/trade.png";
import sflIcon from "assets/icons/sfl.webp";
import giftIcon from "assets/icons/gift.png";
import { Label } from "components/ui/Label";

function acknowledgeIntro() {
  localStorage.setItem("marketplaceIntro", "acknowledged");
}

function isIntroAcknowledged() {
  return localStorage.getItem("marketplaceIntro") === "acknowledged";
}

export const MarketplaceIntroduction: React.FC = () => {
  const { t } = useAppTranslation();
  const [page, setPage] = useState(0);
  const [show, setShow] = useState(!isIntroAcknowledged());

  return (
    <Modal show={show}>
      {page === 0 && (
        <SpeakingModal
          onClose={() => setPage(1)}
          bumpkinParts={NPC_WEARABLES["hammerin harry"]}
          message={[
            {
              text: t("marketplace.welcome.one"),
            },
            {
              text: t("marketplace.welcome.two"),
            },
            {
              text: t("marketplace.welcome.three"),
            },
          ]}
        />
      )}

      {page === 1 && (
        <Panel>
          <Label type="default" className="mb-1">
            {t("marketplace.welcome.title")}
          </Label>
          <img
            src={SUNNYSIDE.announcement.marketplaceLight}
            className="w-full rounded-md mb-1"
          />
          <NoticeboardItems
            items={[
              {
                text: t("marketplace.welcome.four"),
                icon: tradeIcon,
              },
              {
                text: t("marketplace.welcome.five"),
                icon: sflIcon,
              },
              {
                text: t("marketplace.welcome.six"),
                icon: giftIcon,
              },
              {
                text: t("marketplace.welcome.seven"),
                icon: SUNNYSIDE.icons.search,
              },
            ]}
          />
          <p className="text-xs underline my-2 text-center">
            <a
              href="https://docs.sunflower-land.com/support/terms-of-service#id-8-in-game-trading"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center"
            >
              {t("rules.termsOfService")}
            </a>
          </p>

          <Button
            onClick={() => {
              acknowledgeIntro();
              setShow(false);
            }}
          >
            {t("marketplace.welcome.gotIt")}
          </Button>
        </Panel>
      )}
    </Modal>
  );
};
