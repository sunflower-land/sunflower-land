import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { Decoration, DecorationName } from "features/game/types/decorations";
import { Button } from "components/ui/Button";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { gameAnalytics } from "lib/gameAnalytics";
import { getSeasonalTicket } from "features/game/types/seasons";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ConfirmationModal } from "components/ui/ConfirmationModal";

const ADVANCED_DECORATIONS: DecorationName[] = [
  "Fence",
  "Dirt Path",
  "Bush",
  "Shrub",
  "Pine Tree",
  "Stone Fence",
  "Field Maple",
  "Red Maple",
  "Golden Maple",
];

interface Props {
  items: Partial<Record<DecorationName, Decoration>>;
}
export const DecorationItems: React.FC<Props> = ({ items }) => {
  const { t } = useAppTranslation();
  const [selected, setSelected] = useState<Decoration>(
    items[getKeys(items)[0]] as Decoration
  );
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  const price = selected.coins;

  const lessFunds = () => {
    if (!price) return false;

    return state.coins < price;
  };

  const lessIngredients = () =>
    getKeys(selected.ingredients).some((name) =>
      selected.ingredients[name]?.greaterThan(inventory[name] || 0)
    );

  const buy = () => {
    gameService.send("decoration.bought", {
      name: selected.name,
    });

    if (selected.ingredients["Block Buck"]) {
      gameAnalytics.trackSink({
        currency: "Block Buck",
        amount: selected.ingredients["Block Buck"].toNumber() ?? 1,
        item: selected.name,
        type: "Collectible",
      });
    }

    if (selected.ingredients[getSeasonalTicket()]) {
      gameAnalytics.trackSink({
        currency: "Seasonal Ticket",
        amount: selected.ingredients[getSeasonalTicket()]?.toNumber() ?? 1,
        item: selected.name,
        type: "Collectible",
      });
    }

    shortcutItem(selected.name);
  };

  const [isConfirmBuyModalOpen, showConfirmBuyModal] = useState(false);

  const openConfirmModal = () => {
    showConfirmBuyModal(true);
  };

  const handleBuy = () => {
    buy();
    showConfirmBuyModal(false);
  };

  const closeConfirmationModal = () => {
    showConfirmBuyModal(false);
  };

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          details={{
            item: selected.name,
          }}
          requirements={{
            resources: selected.ingredients,
            coins: price,
          }}
          actionView={
            <>
              <Button
                disabled={lessFunds() || lessIngredients()}
                onClick={openConfirmModal}
              >
                {t("buy")}
              </Button>
              <ConfirmationModal
                show={isConfirmBuyModalOpen}
                onHide={closeConfirmationModal}
                messages={[t("statements.sure.buy", { item: selected.name })]}
                onCancel={closeConfirmationModal}
                onConfirm={handleBuy}
                confirmButtonLabel={t("buy")}
                disabled={lessFunds() || lessIngredients()}
              />
            </>
          }
        />
      }
      content={
        <>
          {Object.values(items)
            .filter((item) => !ADVANCED_DECORATIONS.includes(item.name))
            .map((item: Decoration) => {
              return (
                <Box
                  isSelected={selected.name === item.name}
                  key={item.name}
                  onClick={() => setSelected(item)}
                  image={ITEM_DETAILS[item.name].image}
                  count={inventory[item.name]}
                />
              );
            })}
        </>
      }
    />
  );
};
