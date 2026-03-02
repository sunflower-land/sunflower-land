import React, { useState } from "react";
import { Label } from "components/ui/Label";
import { Box } from "components/ui/Box";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { SplitScreenView } from "components/ui/SplitScreenView";
import Decimal from "decimal.js-light";
import {
  getResourcePrice,
  RESOURCE_NODE_PRICES,
} from "features/game/events/landExpansion/buyResource";
import { getKeys } from "features/game/lib/crafting";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { ITEM_DETAILS } from "features/game/types/images";
import { ResourceName } from "features/game/types/resources";
import { GameState } from "features/game/types/game";
import { useGame } from "features/game/GameProvider";
import upIcon from "assets/icons/level_up.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ConfirmButton } from "components/ui/ConfirmButton";

interface Props {
  game: GameState;
}

export const Buy: React.FC<Props> = ({ game }) => {
  const { gameService } = useGame();
  const { t } = useAppTranslation();
  const [selected, setSelected] = useState<ResourceName>("Crop Plot");
  const [bought, setBought] = useState<ResourceName>();

  const island = RESOURCE_NODE_PRICES[selected]?.requiredIsland ?? "basic";
  const hasAccess = hasRequiredIslandExpansion(game.island.type, island);

  const price = getResourcePrice({ gameState: game, resourceName: selected });

  const buy = async () => {
    gameService.send({ type: "resource.bought", name: selected });

    setBought(selected);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setBought(undefined);
  };

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={game}
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
              <ConfirmButton
                onConfirm={buy}
                confirmLabel={t("craft")}
                disabled={
                  !hasAccess ||
                  (game.inventory.Sunstone ?? new Decimal(0)).lt(price)
                }
                className="w-full"
                divClassName="flex-row sm:flex-col"
              >
                {t("craft")}
              </ConfirmButton>
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
              count={game.inventory[resourceName]}
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
  );
};
