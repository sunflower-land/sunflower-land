import React, { useContext, useState } from "react";
import { Modal } from "components/ui/Modal";
import {
  CloseButtonPanel,
  PanelTabs,
} from "features/game/components/CloseablePanel";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { UpgradeBuildingContent } from "features/game/expansion/components/UpgradeBuildingModal";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { FermentationRackPanel } from "./fermentationRack/FermentationRackPanel";
import { AgingRackPanel } from "./agingRack/AgingRackPanel";
import { OuterPanel } from "components/ui/Panel";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type AgingShedTabs = "agingRack" | "fermentationRack" | "spiceRack" | "upgrade";

export const AgingShedModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useAppTranslation();
  const [currentTab, setCurrentTab] = useState<AgingShedTabs>("agingRack");
  const [showUpgradeTab, setShowUpgradeTab] = useState(false);
  const { gameService } = useContext(Context);
  const agingShedLevel = useSelector(
    gameService,
    (state) => state.context.state.agingShed.level,
  );

  const nextAgingShedLevel = agingShedLevel + 1;

  const tabs: PanelTabs<AgingShedTabs>[] = [
    {
      id: "agingRack",
      name: t("agingShed.agingRack"),
      icon: SUNNYSIDE.icons.expression_confused,
    },
    {
      id: "fermentationRack",
      name: t("agingShed.fermentationRack"),
      icon: SUNNYSIDE.icons.expression_confused,
    },
    {
      id: "spiceRack",
      name: t("agingShed.spiceRack"),
      icon: SUNNYSIDE.icons.expression_confused,
    },
  ];

  const closeUpgradeTab = () => {
    setShowUpgradeTab(false);
    onClose();
  };

  return (
    <Modal show={isOpen} onHide={closeUpgradeTab}>
      <img
        src={SUNNYSIDE.icons.upgrade_disc}
        alt="Upgrade Building"
        className="absolute cursor-pointer z-10"
        style={{
          width: `${PIXEL_SCALE * 18}px`,
          left: `${0 * PIXEL_SCALE}px`,
          top: `${-20 * PIXEL_SCALE}px`,
        }}
        onClick={() => setShowUpgradeTab(true)}
      />
      <CloseButtonPanel
        onClose={closeUpgradeTab}
        tabs={showUpgradeTab ? undefined : tabs}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        container={
          showUpgradeTab
            ? undefined
            : currentTab === "fermentationRack" || currentTab === "agingRack"
              ? OuterPanel
              : undefined
        }
      >
        {showUpgradeTab ? (
          <UpgradeBuildingContent
            onClose={closeUpgradeTab}
            buildingName={"Aging Shed"}
            currentLevel={agingShedLevel}
            nextLevel={nextAgingShedLevel}
            onBack={() => setShowUpgradeTab(false)}
          />
        ) : currentTab === "agingRack" ? (
          <AgingRackPanel />
        ) : currentTab === "fermentationRack" ? (
          <FermentationRackPanel />
        ) : (
          <div className="p-2">
            <p className="text-sm">{t("coming.soon")}</p>
          </div>
        )}
      </CloseButtonPanel>
    </Modal>
  );
};
