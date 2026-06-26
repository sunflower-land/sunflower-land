import React, {
  type SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from "react";

import { ITEM_DETAILS } from "features/game/types/images";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Tools } from "./Tools";
import { ToolsGuide } from "./ToolsGuide";
import { NPC_WEARABLES } from "lib/npcs";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { OuterPanel } from "components/ui/Panel";
import { Modal } from "components/ui/Modal";
import { SUNNYSIDE } from "assets/sunnyside";
import book from "assets/icons/tier1_book.webp";
import { IslandBlacksmithItems } from "features/helios/components/blacksmith/component/IslandBlacksmithItems";
import { Buildings } from "features/island/hud/components/buildings/Buildings";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import type { MachineState } from "features/game/lib/gameMachine";
import { INITIAL_SUPPORTED_PLOTS } from "features/game/events/landExpansion/plant";
import { getKeys } from "lib/object";

interface Props {
  onClose: (e?: SyntheticEvent) => void;
  show: boolean;
}

type WorkbenchTab = "Tools" | "boosts" | "build" | "guide";

// Mirror the Workbench building helper: only point at the Build tab once the
// player has outgrown the no-well plot limit and crops have become infertile.
const _needsWell = (state: MachineState) => {
  const { buildings, crops, island } = state.context.state;

  const hasWell =
    buildings["Water Well"]?.some((w) => !!w.coordinates) ?? false;
  if (hasWell) return false;

  const placedPlots = getKeys(crops).filter(
    (id) => crops[id].x !== undefined && crops[id].y !== undefined,
  ).length;

  return placedPlots > INITIAL_SUPPORTED_PLOTS(island.type);
};

const _needsScarecrow = (state: MachineState) =>
  !state.context.state.inventory["Basic Scarecrow"] &&
  (state.context.state.farmActivity?.["Sunflower Planted"] ?? 0) >= 6;

export const WorkbenchModal: React.FC<Props> = ({ onClose, show }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const needsWell = useSelector(gameService, _needsWell);
  const needsScarecrow = useSelector(gameService, _needsScarecrow);

  // Point new players towards the relevant tab, matching the onboarding
  // helper shown on the Workbench building.
  const [tab, setTab] = useState<WorkbenchTab>(
    needsWell ? "build" : needsScarecrow ? "boosts" : "Tools",
  );

  // The modal stays mounted while hidden, so the initial tab above is only
  // computed once. Re-evaluate the default tab each time it opens so the
  // onboarding nudge lands on the right tab even when the requirement became
  // true after mount. Keyed only on `show` to avoid yanking the player off a
  // tab they switched to (e.g. once they craft the scarecrow mid-session).
  useEffect(() => {
    if (!show) return;
    setTab(needsWell ? "build" : needsScarecrow ? "boosts" : "Tools");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <CloseButtonPanel
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES.blacksmith}
        currentTab={tab}
        setCurrentTab={setTab}
        tabs={[
          { icon: ITEM_DETAILS.Pickaxe.image, name: t("tools"), id: "Tools" },
          { icon: SUNNYSIDE.icons.lightning, name: t("boosts"), id: "boosts" },
          { icon: SUNNYSIDE.icons.hammer, name: t("build"), id: "build" },
          { icon: book, name: t("guide"), id: "guide" },
        ]}
        container={OuterPanel}
      >
        {tab === "Tools" && <Tools />}
        {tab === "boosts" && <IslandBlacksmithItems onClose={onClose} />}
        {tab === "build" && <Buildings onClose={onClose} />}
        {tab === "guide" && <ToolsGuide />}
      </CloseButtonPanel>
    </Modal>
  );
};
