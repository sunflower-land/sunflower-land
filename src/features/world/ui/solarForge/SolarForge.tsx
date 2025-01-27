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
            text: "Wow, I'm surpirsed you've made it this far!",
          },
          {
            text: "I'm Gunter, the blacksmith of Volcaro.",
          },
          {
            text: "I've been working on a new type of forge that can help you craft resources with the power of the sun.",
          },
          {
            text: "The strength of the forge is limited, each time you use it will require more Sunstones!",
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
                <Button
                  disabled={(state.inventory.Sunstone ?? new Decimal(0)).lte(
                    price,
                  )}
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
            {getKeys(RESOURCE_NODE_PRICES).map((resourceName) => {
              return (
                <Box
                  isSelected={selected === resourceName}
                  key={resourceName}
                  onClick={() => setSelected(resourceName)}
                  image={ITEM_DETAILS[resourceName].image}
                  count={state.inventory[resourceName]}
                />
              );
            })}
          </>
        }
      />
    </CloseButtonPanel>
  );
};
