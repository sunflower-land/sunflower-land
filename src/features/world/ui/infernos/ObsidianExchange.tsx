import { Button } from "components/ui/Button";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useGame } from "features/game/GameProvider";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { OBSIDIAN_PRICE } from "features/game/events/landExpansion/exchangeObsidian";

export const ObsidianExchange: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { gameState, gameService } = useGame();

  const state = gameState.context.state;

  const hasBoughtResource = !!state.farmActivity[`Obsidian Exchanged`];

  const [showIntro, setShowIntro] = useState(!hasBoughtResource);

  const { t } = useAppTranslation();

  const buy = () => gameService.send({ type: "obsidian.exchanged" });

  if (showIntro) {
    return (
      <SpeakingModal
        bumpkinParts={NPC_WEARABLES.gorga}
        message={[
          { text: t("gorga.intro.greeting") },
          { text: t("gorga.intro.two") },
          { text: t("gorga.intro.three") },
        ]}
        onClose={() => setShowIntro(false)}
      />
    );
  }

  return (
    <CloseButtonPanel bumpkinParts={NPC_WEARABLES.gorga} onClose={onClose}>
      <CraftingRequirements
        gameState={state}
        details={{ item: "Sunstone" }}
        requirements={{ resources: { Obsidian: new Decimal(OBSIDIAN_PRICE) } }}
        actionView={
          <div className="relative">
            <Button
              disabled={(state.inventory.Obsidian ?? new Decimal(0)).lt(
                OBSIDIAN_PRICE,
              )}
              onClick={buy}
              className="w-full"
            >
              {t("exchange")}
            </Button>
          </div>
        }
      />
    </CloseButtonPanel>
  );
};
