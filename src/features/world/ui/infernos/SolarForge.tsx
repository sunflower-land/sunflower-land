import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { OuterPanel } from "components/ui/Panel";
import { SplitScreenView } from "components/ui/SplitScreenView";
import Decimal from "decimal.js-light";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import {
  getResourcePrice,
  RESOURCE_NODE_PRICES,
} from "features/game/events/landExpansion/buyResource";
import { useGame } from "features/game/GameProvider";
import { getKeys } from "features/game/types/decorations";
import { ITEM_DETAILS } from "features/game/types/images";
import { ResourceName } from "features/game/types/resources";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";
import upIcon from "assets/icons/level_up.png";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { Label } from "components/ui/Label";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";

export const SolarForge: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selected, setSelected] = useState<ResourceName>("Crop Plot");
  const { gameState, gameService } = useGame();

  const state = gameState.context.state;

  const hasBoughtResource = getKeys(RESOURCE_NODE_PRICES).some(
    (resource) => !!state.farmActivity[`${resource} Bought`],
  );

  const [showIntro, setShowIntro] = useState(!hasBoughtResource);
  const [bought, setBought] = useState<ResourceName>();

  const { t } = useAppTranslation();

  const price = getResourcePrice({ gameState: state, resourceName: selected });

  const buy = async () => {
    gameService.send("resource.bought", {
      name: selected,
    });

    setBought(selected);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setBought(undefined);
  };

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

  const island = RESOURCE_NODE_PRICES[selected]?.requiredIsland ?? "basic";
  const hasAccess = hasRequiredIslandExpansion(state.island.type, island);

  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES.gunter}
      container={OuterPanel}
      onClose={onClose}
    >
      <SplitScreenView
        panel={
          <CraftingRequirements
            gameState={state}
            details={{
              item: selected,
            }}
            requirements={{
              resources: {
                Sunstone: new Decimal(price),
              },
            }}
            // actionView={getAction()}
            actionView={
              <div className="relative">
                {bought === selected && (
                  <img src={upIcon} className="absolute w-4 right-0 -top-8 " />
                )}
                {selected === "Flower Bed" && (
                  <Label
                    type="info"
                    icon={ITEM_DETAILS.Beehive.image}
                    className="mb-2 mx-auto"
                  >
                    {`Beehive included`}
                  </Label>
                )}
                {!hasAccess && (
                  <Label type="danger" className="mb-2 mx-auto">
                    {t("island.required", { island })}
                  </Label>
                )}
                <Button
                  disabled={
                    !hasAccess ||
                    (state.inventory.Sunstone ?? new Decimal(0)).lt(price)
                  }
                  onClick={buy}
                  className="w-full"
                >
                  {t("craft")}
                </Button>
              </div>
            }
          />
        }
        content={
          <>
            {getKeys(RESOURCE_NODE_PRICES).map((resourceName) => (
              <Box
                isSelected={selected === resourceName}
                key={resourceName}
                onClick={() => setSelected(resourceName)}
                image={ITEM_DETAILS[resourceName].image}
                count={state.inventory[resourceName]}
                secondaryImage={
                  resourceName === "Flower Bed"
                    ? ITEM_DETAILS.Beehive.image
                    : undefined
                }
              />
            ))}
          </>
        }
      />
    </CloseButtonPanel>
  );
};
