import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";

import { Button } from "components/ui/Button";
import {
  HeliosBlacksmithItem,
  HELIOS_BLACKSMITH_ITEMS,
  CraftableCollectible,
} from "features/game/types/collectibles";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { gameAnalytics } from "lib/gameAnalytics";
import { getSeasonalTicket } from "features/game/types/seasons";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ConfirmationModal } from "components/ui/ConfirmationModal";

function isNotReady(collectible: CraftableCollectible) {
  return (
    collectible.from &&
    collectible.to &&
    (collectible.from.getTime() > Date.now() ||
      collectible.to.getTime() < Date.now())
  );
}
export const HeliosBlacksmithItems: React.FC = () => {
  const [selectedName, setSelectedName] =
    useState<HeliosBlacksmithItem>("Basic Scarecrow");
  const { gameService, shortcutItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  const { t } = useAppTranslation();

  const selectedItem = HELIOS_BLACKSMITH_ITEMS(state)[selectedName]!;
  const isAlreadyCrafted = inventory[selectedName]?.greaterThanOrEqualTo(1);

  const lessIngredients = () =>
    getKeys(selectedItem.ingredients).some((name) =>
      selectedItem.ingredients[name]?.greaterThan(inventory[name] || 0),
    );

  const craft = () => {
    gameService.send("collectible.crafted", {
      name: selectedName,
    });

    const count = state.inventory[selectedName]?.toNumber() ?? 1;
    gameAnalytics.trackMilestone({
      event: `Crafting:Collectible:${selectedName}${count}`,
    });

    if (selectedItem.ingredients["Block Buck"]) {
      gameAnalytics.trackSink({
        currency: "Block Buck",
        amount: selectedItem.ingredients["Block Buck"].toNumber() ?? 1,
        item: selectedName,
        type: "Collectible",
      });
    }

    if (selectedItem.ingredients[getSeasonalTicket()]) {
      gameAnalytics.trackSink({
        currency: "Seasonal Ticket",
        amount: selectedItem.ingredients[getSeasonalTicket()]?.toNumber() ?? 1,
        item: selectedName,
        type: "Collectible",
      });
    }

    shortcutItem(selectedName);
  };

  const [isConfirmBuyModalOpen, showConfirmBuyModal] = useState(false);
  const openConfirmationModal = () => {
    showConfirmBuyModal(true);
  };
  const closeConfirmationModal = () => {
    showConfirmBuyModal(false);
  };
  const handleBuy = () => {
    craft();
    showConfirmBuyModal(false);
  };

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          details={{
            item: selectedName,
            from: selectedItem.from,
            to: selectedItem.to,
          }}
          boost={selectedItem.boost}
          requirements={{
            resources: selectedItem.ingredients,
            coins: selectedItem.coins,
          }}
          actionView={
            isAlreadyCrafted ? (
              <p className="text-xxs text-center mb-2 font-secondary">
                {t("alr.crafted")}
              </p>
            ) : (
              <>
                <Button
                  disabled={lessIngredients() || isNotReady(selectedItem)}
                  onClick={openConfirmationModal}
                >
                  {t("craft")}
                </Button>
                <ConfirmationModal
                  show={isConfirmBuyModalOpen}
                  onHide={closeConfirmationModal}
                  messages={[t("confirmation.craft", { item: selectedName })]}
                  onCancel={closeConfirmationModal}
                  onConfirm={handleBuy}
                  confirmButtonLabel={t("craft")}
                  disabled={lessIngredients() || isNotReady(selectedItem)}
                />
              </>
            )
          }
        />
      }
      content={
        <>
          {getKeys(HELIOS_BLACKSMITH_ITEMS(state)).map(
            (name: HeliosBlacksmithItem) => {
              const isTimeLimited = isNotReady(
                HELIOS_BLACKSMITH_ITEMS(state)[name] as CraftableCollectible,
              );

              return (
                <Box
                  isSelected={selectedName === name}
                  key={name}
                  onClick={() => setSelectedName(name)}
                  image={ITEM_DETAILS[name].image}
                  count={inventory[name]}
                  showOverlay={isTimeLimited}
                  overlayIcon={
                    <img
                      src={SUNNYSIDE.icons.stopwatch}
                      id="confirm"
                      alt="confirm"
                      className="object-contain absolute"
                      style={{
                        width: `${PIXEL_SCALE * 8}px`,
                        top: `${PIXEL_SCALE * -4}px`,
                        right: `${PIXEL_SCALE * -4}px`,
                      }}
                    />
                  }
                />
              );
            },
          )}
        </>
      }
    />
  );
};
