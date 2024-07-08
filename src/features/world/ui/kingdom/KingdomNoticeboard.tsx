import { Panel } from "components/ui/Panel";
import React from "react";

import trophy from "assets/icons/trophy.png";
import gift from "assets/icons/gift.png";
import shop from "assets/icons/shop.png";
import factions from "assets/icons/factions.webp";
import graphic from "assets/announcements/factions.png";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface NoticeboardItemProps {
  items: { text: string; icon: string }[];
}
export const NoticeboardItems: React.FC<NoticeboardItemProps> = ({ items }) => {
  return (
    <>
      {items.map((item, index) => (
        <div className="flex mb-2" key={index}>
          <div className="w-12 flex justify-center">
            <img src={item.icon} className="h-6 mr-2 object-contain" />
          </div>
          <p className="text-xs  flex-1">{item.text}</p>
        </div>
      ))}
    </>
  );
};

export function hasReadKingdomNotice() {
  return !!localStorage.getItem("kingdom.notice");
}

function acknowledgeIntro() {
  return localStorage.setItem("kingdom.notice", new Date().toISOString());
}

interface Props {
  onClose: () => void;
}
export const KingdomNoticeboard: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();

  return (
    <Panel>
      <img src={graphic} className="w-full mb-2" />
      <NoticeboardItems
        items={[
          {
            text: "Welcome to the Kingdom - It is time to join a faction and compete for Glory!",
            icon: factions,
          },
          {
            text: "Play mini-games, complete faction tasks, climb the leaderboard & earn marks",
            icon: trophy,
          },
          {
            text: "Each week the top players can claim a prize!",
            icon: gift,
          },
          {
            text: "Visit the Kingdom shop to claim rewards & collectibles",
            icon: shop,
          },
        ]}
      />
      <Button
        onClick={() => {
          onClose();
          acknowledgeIntro();
        }}
      >
        {t("ok")}
      </Button>
    </Panel>
  );
};
