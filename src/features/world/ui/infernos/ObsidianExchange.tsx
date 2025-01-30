import { Button } from "components/ui/Button";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { RESOURCE_NODE_PRICES } from "features/game/events/landExpansion/buyResource";
import { useGame } from "features/game/GameProvider";
import { getKeys } from "features/game/types/decorations";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";
import upIcon from "assets/icons/level_up.png";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { getObsidianSunstonePrice } from "features/game/events/landExpansion/exchangeObsidian";

export const ObsidianExchange: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { gameState, gameService } = useGame();

  const state = gameState.context.state;

  const hasBoughtResource = getKeys(RESOURCE_NODE_PRICES).some(
    (resource) => !!state.farmActivity[`Obsidian Exchanged`],
  );

  const [showIntro, setShowIntro] = useState(!hasBoughtResource);
  const [showPriceIncrease, setShowPriceIncrease] = useState(false);

  const { t } = useAppTranslation();

  const price = getObsidianSunstonePrice({ gameState: state });

  const buy = async () => {
    const previousPrice = price;
    gameService.send("obsidian.exchanged");

    const newPrice = getObsidianSunstonePrice({
      gameState: gameService.state.context.state,
    });

    if (newPrice > previousPrice) {
      setShowPriceIncrease(true);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowPriceIncrease(false);
    }
  };

  if (showIntro) {
    return (
      <SpeakingModal
        bumpkinParts={NPC_WEARABLES.gorga}
        message={[
          {
            text: t("gorga.intro.greeting"),
          },
          {
            text: t("gorga.intro.two"),
          },
          {
            text: t("gorga.intro.three"),
          },
        ]}
        onClose={() => setShowIntro(false)}
      />
    );
  }

  return (
    <CloseButtonPanel bumpkinParts={NPC_WEARABLES.gorga} onClose={onClose}>
      <CraftingRequirements
        gameState={state}
        details={{
          item: "Sunstone",
        }}
        requirements={{
          resources: {
            Obsidian: new Decimal(price),
          },
        }}
        actionView={
          <div className="relative">
            {showPriceIncrease && (
              <img src={upIcon} className="absolute w-4 right-0 -top-8 " />
            )}
            <Button
              disabled={(state.inventory.Obsidian ?? new Decimal(0)).lt(price)}
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
