import React, { useContext, useMemo, useState } from "react";
import { Modal } from "components/ui/Modal";
import {
  CloseButtonPanel,
  type PanelTabs,
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
import { ITEM_DETAILS } from "features/game/types/images";
import { useNow } from "lib/utils/hooks/useNow";
import { getReadyAgingShedTabs, type AgingShedTab } from "./agingShedTabs";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AgingShedModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useAppTranslation();
  const [currentTab, setCurrentTab] = useState<AgingShedTab>("agingRack");
  const [showUpgradeTab, setShowUpgradeTab] = useState(false);
  const { gameService } = useContext(Context);
  const agingShedLevel = useSelector(
    gameService,
    (state) => state.context.state.agingShed.level,
  );
  const agingShedRacks = useSelector(
    gameService,
    (state) => state.context.state.agingShed.racks,
  );

  const { aging, fermentation, spice } = agingShedRacks;
  const readyAts = [
    ...aging.map((slot) => slot.readyAt),
    ...fermentation.map((slot) => slot.readyAt),
    ...spice.map((slot) => slot.readyAt),
  ];
  const latestReadyAt = readyAts.length ? Math.max(...readyAts) : undefined;

  const now = useNow({ live: true, autoEndAt: latestReadyAt });

  const readyTabs = useMemo(
    () => getReadyAgingShedTabs(agingShedRacks, now),
    [agingShedRacks, now],
  );
  const isMaxedLevel = agingShedLevel >= 6;

  const tabs: PanelTabs<AgingShedTab>[] = [
    {
      id: "agingRack",
      name: t("agingShed.agingRack"),
      icon: ITEM_DETAILS["Aged Anchovy"].image,
      alert: readyTabs.includes("agingRack"),
    },
    {
      id: "fermentationRack",
      name: t("agingShed.fermentationRack"),
      icon: ITEM_DETAILS["Pickled Broccoli"].image,
      alert: readyTabs.includes("fermentationRack"),
    },
    {
      id: "spiceRack",
      name: t("agingShed.spiceRack"),
      icon: ITEM_DETAILS["Refined Salt"].image,
      alert: readyTabs.includes("spiceRack"),
    },
  ];

  const upgradeTab: PanelTabs<AgingShedTab>[] = [
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

  const selectReadyTab = () => {
    // Read a fresh timestamp on every opening, even if the shed clock stopped.
    const ready = getReadyAgingShedTabs(
      gameService.getSnapshot().context.state.agingShed.racks,
      Date.now(),
    );
    setCurrentTab(ready[0] ?? "agingRack");
  };

  return (
    <Modal show={isOpen} onHide={closeUpgradeTab} onShow={selectReadyTab}>
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
      <CloseButtonPanel<AgingShedTab>
        onClose={closeUpgradeTab}
        tabs={showUpgradeTab ? upgradeTab : tabs}
        currentTab={showUpgradeTab ? "upgrade" : currentTab}
        setCurrentTab={showUpgradeTab ? undefined : setCurrentTab}
        container={isMaxedLevel && showUpgradeTab ? undefined : OuterPanel}
      >
        <AgedShedPanel
          agingShedLevel={agingShedLevel}
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
  setShowUpgradeTab: React.Dispatch<React.SetStateAction<boolean>>;
  closeUpgradeTab: () => void;
  showUpgradeTab: boolean;
  currentTab: AgingShedTab;
}> = ({
  agingShedLevel,
  setShowUpgradeTab,
  closeUpgradeTab,
  showUpgradeTab,
  currentTab,
}) => {
  const nextAgingShedLevel = agingShedLevel + 1;

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
