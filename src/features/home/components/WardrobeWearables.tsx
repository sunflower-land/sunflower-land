import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { SplitScreenView } from "components/ui/SplitScreenView";
import Decimal from "decimal.js-light";
import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFLDiscount } from "features/game/lib/SFLDiscount";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { getKeys } from "features/game/types/decorations";
import { GameState } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { getSeasonalTicket } from "features/game/types/seasons";
import {
  STYLIST_WEARABLES,
  StylistWearable,
} from "features/game/types/stylist";
import { gameAnalytics } from "lib/gameAnalytics";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getImageUrl } from "lib/utils/getImageURLS";
import React, { useState, useContext } from "react";

function isNotReady(name: BumpkinItem, state: GameState) {
  const wearable = STYLIST_WEARABLES[name] as StylistWearable;

  if (wearable.hoursPlayed) {
    const hoursPlayed = (Date.now() - state.createdAt) / 1000 / 60 / 60;

    if (hoursPlayed < wearable.hoursPlayed) {
      return true;
    }
  }

  return (
    wearable.from &&
    wearable.to &&
    (wearable.from.getTime() > Date.now() || wearable.to.getTime() < Date.now())
  );
}

export const WardrobeWearables: React.FC = () => {
  const [selected, setSelected] = useState<BumpkinItem>(
    getKeys(STYLIST_WEARABLES)[0],
  );
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);
  const { inventory, coins, wardrobe } = state;

  const wearable = STYLIST_WEARABLES[selected] as StylistWearable; // Add type assertion to StylistWearable

  const price = SFLDiscount(state, new Decimal(wearable.coins)).toNumber();

  const lessFunds = () => {
    if (!price) return false;

    return coins < price;
  };

  const lessIngredients = () =>
    getKeys(wearable.ingredients).some((name) =>
      (inventory[name] || new Decimal(0))?.lt(wearable.ingredients[name] ?? 0),
    );

  const buy = () => {
    gameService.send("wearable.bought", {
      name: selected,
    });

    if (wearable.ingredients["Gem"]) {
      gameAnalytics.trackSink({
        currency: "Gem",
        amount: wearable.ingredients["Gem"].toNumber() ?? 1,
        item: selected,
        type: "Wearable",
      });
    }

    if (wearable.ingredients[getSeasonalTicket()]) {
      gameAnalytics.trackSink({
        currency: "Seasonal Ticket",
        amount: wearable.ingredients[getSeasonalTicket()]?.toNumber() ?? 1,
        item: selected,
        type: "Wearable",
      });
    }
  };

  const [isConfirmBuyModalOpen, showConfirmBuyModal] = useState(false);
  const openConfirmationModal = () => {
    showConfirmBuyModal(true);
  };
  const closeConfirmationModal = () => {
    showConfirmBuyModal(false);
  };
  const handleBuy = () => {
    buy();
    showConfirmBuyModal(false);
  };

  const { t } = useAppTranslation();
  const Action = () => {
    if (wearable.requiresItem && !inventory[wearable.requiresItem]) {
      return (
        <div className="flex items-center justify-center">
          <img
            src={ITEM_DETAILS[wearable.requiresItem].image}
            className="h-6 mr-1 img-highlight"
          />
          <span className="text-center text-xs">
            {t("requires")}
            {wearable.requiresItem}
          </span>
        </div>
      );
    }

    return (
      <>
        <Button
          disabled={
            isNotReady(selected, state) || lessFunds() || lessIngredients()
          }
          onClick={openConfirmationModal}
        >
          {t("buy")}
        </Button>
        <ConfirmationModal
          show={isConfirmBuyModalOpen}
          onHide={closeConfirmationModal}
          messages={[t("statements.sure.buy", { item: selected })]}
          onCancel={closeConfirmationModal}
          onConfirm={handleBuy}
          confirmButtonLabel={t("buy")}
          disabled={
            isNotReady(selected, state) || lessFunds() || lessIngredients()
          }
        />
      </>
    );
  };

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          details={{
            wearable: selected,
            from: wearable.from,
            to: wearable.to,
          }}
          // boost={selectedItem.boost}
          requirements={{
            resources: wearable.ingredients,
            coins: price,
          }}
          actionView={Action()}
        />
      }
      content={
        <>
          <div className="flex flex-wrap">
            {getKeys(STYLIST_WEARABLES).map((item) => {
              const timeLimited = isNotReady(item, state);

              return (
                <Box
                  isSelected={selected === item}
                  key={item}
                  onClick={() => setSelected(item)}
                  image={getImageUrl(ITEM_IDS[item])}
                  count={new Decimal(wardrobe[item] ?? 0)}
                  showOverlay={timeLimited}
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
            })}
          </div>
        </>
      }
    />
  );
};
