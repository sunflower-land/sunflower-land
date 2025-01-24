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

export const SolarForge: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [selected, setSelected] = useState<ResourceName>("Crop Plot");
  const { gameState, gameService } = useGame();
  const [bought, setBought] = useState<ResourceName>();

  const { t } = useAppTranslation();

  const state = gameState.context.state;

  const price = getResourcePrice({ gameState: state, resourceName: selected });

  const buy = async () => {
    gameService.send("resource.bought", {
      name: selected,
    });

    setBought(selected);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setBought(undefined);
  };
  return (
    <CloseButtonPanel container={OuterPanel} onClose={onClose}>
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
