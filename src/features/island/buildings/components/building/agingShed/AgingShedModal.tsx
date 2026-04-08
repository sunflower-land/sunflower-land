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
import { SpiceRackPanel } from "./spiceRack/SpiceRackPanel";
import { OuterPanel } from "components/ui/Panel";
import { hasFeatureAccess } from "lib/flags";
import { ITEM_DETAILS } from "features/game/types/images";
import { BUILDING_UPGRADES } from "features/game/events/landExpansion/upgradeBuilding";
import { getKeys } from "lib/object";

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
  const hasAgingShedAccess = useSelector(gameService, (state) =>
    hasFeatureAccess(state.context.state, "AGING_SHED"),
  );

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

  const upgradeTab: PanelTabs<AgingShedTabs>[] = [
    {
      id: "upgrade",
      name: t("upgrade"),
      icon: ITEM_DETAILS.Hammer.image,
    },
  ];

  const closeUpgradeTab = () => {
    setShowUpgradeTab(false);
    onClose();
  };

  const isAgingShedMaxLevel =
    agingShedLevel >= getKeys(BUILDING_UPGRADES["Aging Shed"]).length;

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
      <CloseButtonPanel<AgingShedTabs>
        onClose={closeUpgradeTab}
        tabs={
          !hasAgingShedAccess ? undefined : showUpgradeTab ? upgradeTab : tabs
        }
        currentTab={
          showUpgradeTab && hasAgingShedAccess ? "upgrade" : currentTab
        }
        setCurrentTab={showUpgradeTab ? undefined : setCurrentTab}
        container={isAgingShedMaxLevel ? undefined : OuterPanel}
      >
        <AgedShedPanel
          agingShedLevel={agingShedLevel}
          hasAgingShedAccess={hasAgingShedAccess}
          setShowUpgradeTab={setShowUpgradeTab}
          closeUpgradeTab={closeUpgradeTab}
          showUpgradeTab={showUpgradeTab}
          currentTab={currentTab}
        />
      </CloseButtonPanel>
    </Modal>
  );
};

const AgedShedPanel: React.FC<{
  agingShedLevel: number;
  hasAgingShedAccess: boolean;
  setShowUpgradeTab: React.Dispatch<React.SetStateAction<boolean>>;
  closeUpgradeTab: () => void;
  showUpgradeTab: boolean;
  currentTab: AgingShedTabs;
}> = ({
  agingShedLevel,
  hasAgingShedAccess,
  setShowUpgradeTab,
  closeUpgradeTab,
  showUpgradeTab,
  currentTab,
}) => {
  const { t } = useAppTranslation();
  const nextAgingShedLevel = agingShedLevel + 1;

  if (!hasAgingShedAccess) {
    return (
      <div className="p-2">
        <p className="text-sm">{t("coming.soon")}</p>
      </div>
    );
  }

  if (showUpgradeTab) {
    return (
      <UpgradeBuildingContent
        onClose={closeUpgradeTab}
        buildingName="Aging Shed"
        currentLevel={agingShedLevel}
        nextLevel={nextAgingShedLevel}
        onBack={() => setShowUpgradeTab(false)}
      />
    );
  }

  if (currentTab === "agingRack") {
    return <AgingRackPanel />;
  }

  if (currentTab === "fermentationRack") {
    return <FermentationRackPanel />;
  }

  if (currentTab === "spiceRack") {
    return <SpiceRackPanel />;
  }

  return null;
};
