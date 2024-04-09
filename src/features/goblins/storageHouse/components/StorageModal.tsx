import React, { useState } from "react";

import player from "assets/npcs/goblin_head.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { Delivery } from "./Delivery";
import { StorageItems } from "./StorageItems";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
interface Props {
  onClose: () => void;
}
export const StorageModal: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState<"storage" | "delivery" | "treasury">(
    "storage"
  );
  const { t } = useAppTranslation();

  return (
    <Panel className="relative" hasTabs>
      <div
        className="absolute flex"
        style={{
          top: `${PIXEL_SCALE * 1}px`,
          left: `${PIXEL_SCALE * 0}px`,
          right: `${PIXEL_SCALE * 1}px`,
        }}
      >
        <Tab isActive={tab === "storage"} onClick={() => setTab("storage")}>
          <img src={SUNNYSIDE.resource.wood} className="h-5 mr-2" />
          <span className="text-sm">{t("storage")}</span>
        </Tab>
        <Tab isActive={tab === "delivery"} onClick={() => setTab("delivery")}>
          <img src={player} className="h-5 mr-2" />
          <span className="text-sm">{t("delivery")}</span>
        </Tab>
        <img
          src={SUNNYSIDE.icons.close}
          className="absolute cursor-pointer z-20"
          onClick={onClose}
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 1}px`,
            width: `${PIXEL_SCALE * 11}px`,
          }}
        />
      </div>
      <div>
        {tab === "storage" && <StorageItems />}
        {tab === "delivery" && <Delivery onWithdraw={onClose} />}
      </div>
    </Panel>
  );
};
