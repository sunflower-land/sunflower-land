import { SUNNYSIDE } from "assets/sunnyside";
import { Modal } from "components/ui/Modal";
import { OuterPanel } from "components/ui/Panel";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { BASIC_DECORATIONS } from "features/game/types/decorations";
import { InventoryItemName } from "features/game/types/game";
import { DecorationItems } from "features/helios/components/decorations/component/DecorationItems";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useState } from "react";
import { LandscapingDecorations } from "./LandscapingDecorations";

interface Props {
  show: boolean;
  onHide: () => void;
}

export type TabItems = Record<string, { items: object }>;

export type Inventory = Partial<Record<InventoryItemName, Decimal>>;

export const CraftDecorationsModal: React.FC<Props> = ({ show, onHide }) => {
  const { t } = useAppTranslation();
  const [tab, setTab] = useState(0);
  return (
    <Modal size="lg" show={show} onHide={onHide}>
      <CloseButtonPanel
        tabs={[
          { icon: SUNNYSIDE.decorations.bush, name: t("landscaping") },
          { icon: SUNNYSIDE.icons.heart, name: t("decorations") },
        ]}
        setCurrentTab={setTab}
        currentTab={tab}
        onClose={onHide}
        bumpkinParts={NPC_WEARABLES.grimtooth}
        container={OuterPanel}
      >
        {tab === 0 && <LandscapingDecorations onClose={onHide} />}
        {tab === 1 && <DecorationItems items={BASIC_DECORATIONS()} />}
      </CloseButtonPanel>
    </Modal>
  );
};
