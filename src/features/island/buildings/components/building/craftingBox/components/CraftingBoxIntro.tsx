import React from "react";
import { Panel } from "components/ui/Panel";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onStartCrafting: () => void;
  onViewRecipes: () => void;
  onClose: () => void;
}

export const CraftingBoxIntro: React.FC<Props> = ({
  onStartCrafting,
  onViewRecipes,
  onClose,
}) => {
  const { t } = useAppTranslation();

  return (
    <Panel bumpkinParts={NPC_WEARABLES.blacksmith}>
      <SpeakingText
        message={[
          { text: t("craftingBox.welcome.1") },
          { text: t("craftingBox.welcome.2") },
          {
            text: t("craftingBox.welcome.3"),
            actions: [
              { text: t("craftingBox.startCrafting"), cb: onStartCrafting },
              { text: t("craftingBox.viewRecipes"), cb: onViewRecipes },
            ],
          },
        ]}
        onClose={onClose}
      />
    </Panel>
  );
};
