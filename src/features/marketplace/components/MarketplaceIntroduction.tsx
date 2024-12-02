import React, { useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { Modal } from "components/ui/Modal";
import { InnerPanel, Panel } from "components/ui/Panel";
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
    <Modal
      show={show}
      onHide={() => {
        acknowledgeIntro();
        setShow(false);
      }}
    >
      {page === 0 && (
        <SpeakingModal
          onClose={() => setPage(1)}
          bumpkinParts={NPC_WEARABLES["hammerin harry"]}
          message={[
            {
              text: "Howdy there, partner! Welcome to the Marketplace. Your one-stop shop for all things farm-tastic.",
            },
            {
              text: "Here you can trade resources, buy exclusive collectibles & boost your farm.",
            },
            {
              text: "The marketplace exclusively uses $SFL, the currency of Sunflower Land. You can earn SFL in-game or trading with other players.",
            },
          ]}
        />
      )}

      {page === 1 && (
        <Panel>
          <Label type="default" className="mb-1">
            Welcome to the Marketplace
          </Label>
          <img
            src={SUNNYSIDE.announcement.marketplaceLight}
            className="w-full rounded-md mb-1"
          />
          <NoticeboardItems
            items={[
              {
                text: "Trade resources, collectibles & wearables for your farm.",
                icon: tradeIcon,
              },
              {
                text: "Sell resources & items to earn $SFL.",
                icon: sflIcon,
              },
              {
                text: "Earn points on trades and unlock rewards.",
                icon: giftIcon,
              },
              {
                text: "The marketplace items are intended for in-game use, not speculation or investment",
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

          <Button>Got it</Button>
        </Panel>
      )}
    </Modal>
  );
};
