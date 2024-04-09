import React, { useState } from "react";
import { Modal } from "components/ui/Modal";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { TabContent } from "./TabContent";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export type Tab = "upcoming-drops" | "collection";

export const ItemsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<Tab>("upcoming-drops");
  const { t } = useAppTranslation();

  return (
    <Modal show={isOpen} onHide={onClose}>
      <Panel className="relative" hasTabs>
        <div
          className="absolute flex"
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            left: `${PIXEL_SCALE * 0}px`,
            right: `${PIXEL_SCALE * 1}px`,
          }}
        >
          <Tab
            isActive={tab === "upcoming-drops"}
            onClick={() => setTab("upcoming-drops")}
          >
            <span className="text-sm ml-1">{t("upcoming")}</span>
          </Tab>
          <Tab
            isActive={tab === "collection"}
            onClick={() => setTab("collection")}
          >
            <span className="text-sm ml-1">{t("collection")}</span>
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

        <div
          style={{
            minHeight: "200px",
          }}
        >
          <TabContent tab={tab} />
        </div>
      </Panel>
    </Modal>
  );
};
