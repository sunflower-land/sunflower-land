import { OuterPanel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { RESOURCE_NODE_PRICES } from "features/game/events/landExpansion/buyResource";
import { useGame } from "features/game/GameProvider";
import { getKeys } from "features/game/types/decorations";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { SUNNYSIDE } from "assets/sunnyside";
import { Buy } from "./tabs/Buy";
import { Forge } from "./tabs/Forge";

export const SolarForge: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [tab, setTab] = useState<"Buy" | "Upgrade">("Buy");
  const { gameState } = useGame();

  const state = gameState.context.state;

  const hasBoughtResource = getKeys(RESOURCE_NODE_PRICES).some(
    (resource) => !!state.farmActivity[`${resource} Bought`],
  );

  const [showIntro, setShowIntro] = useState(!hasBoughtResource);

  const { t } = useAppTranslation();

  if (showIntro) {
    return (
      <SpeakingModal
        bumpkinParts={NPC_WEARABLES.gunter}
        message={[
          {
            text: t("solarForge.intro.greeting"),
          },
          {
            text: t("solarForge.intro.gunter"),
          },
          {
            text: t("solarForge.intro.forge"),
          },
          {
            text: t("solarForge.intro.forgeStrength"),
          },
        ]}
        onClose={() => setShowIntro(false)}
      />
    );
  }

  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES.gunter}
      container={OuterPanel}
      onClose={onClose}
      tabs={[
        { icon: ITEM_DETAILS.Tree.image, name: t("buy"), id: "Buy" },
        {
          icon: SUNNYSIDE.icons.hammer,
          name: t("upgrade"),
          id: "Upgrade",
        },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
    >
      {tab === "Buy" && <Buy game={state} />}
      {tab === "Upgrade" && <Forge />}
    </CloseButtonPanel>
  );
};
