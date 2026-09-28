import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { getWeekKey, weekResetsAt } from "features/game/lib/factions";
import {
  CAVE_MERCHANT_OFFERS,
  CAVE_MERCHANT_OFFERS_TIER,
  getCaveMerchantOffers,
  getCaveMerchantOffersLeft,
  type CaveMerchantOfferId,
} from "features/game/types/caveMerchant";
import { ITEM_DETAILS } from "features/game/types/images";
import type { NPCParts } from "features/island/bumpkin/components/NPC";
import { getKeys } from "lib/object";
import { secondsToString } from "lib/utils/time";
import { useNow } from "lib/utils/hooks/useNow";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { InnerPanel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { IngredientsPopover } from "components/ui/IngredientsPopover";

// Placeholder look until the art team draws the Goblin Cave Merchant.
export const CAVE_MERCHANT_PARTS: Partial<NPCParts> = {
  body: "Goblin Potion",
  hair: "Buzz Cut",
  shirt: "SFL T-Shirt",
  pants: "Farmer Pants",
  shoes: "Black Farmer Boots",
  background: "Goblin Retreat Background",
};

const _game = (state: MachineState) => state.context.state;

/**
 * The Goblin Cave Merchant's shop, opened from the stall once the Cave reaches
 * the merchant's tier. Lists every stocked offer with its cost and how many
 * the player has left this week; Cave VIII adds more offers to the same list.
 */
export const CaveMerchantModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const game = useSelector(gameService, _game);
  const now = useNow({ live: true });
  // The offer whose cost items are listed by name (click the cost to toggle).
  const [ingredientsFor, setIngredientsFor] = useState<CaveMerchantOfferId>();

  const tier = game.cave?.tier ?? 0;
  const periodKey = getWeekKey({ date: new Date(now) });
  const resetsIn = Math.max(
    0,
    (weekResetsAt({ date: new Date(now) }) - now) / 1000,
  );

  const trade = (offerId: CaveMerchantOfferId) =>
    gameService.send({ type: "cave.merchantOfferBought", offerId });

  return (
    <Modal show onHide={onClose}>
      <CloseButtonPanel
        onClose={onClose}
        title={t("cave.merchant.title")}
        bumpkinParts={CAVE_MERCHANT_PARTS}
      >
        <div className="flex flex-col p-1 gap-2">
          <span className="text-sm">{t("cave.merchant.description")}</span>
          <Label type="info">
            {t("cave.merchant.resets", {
              time: secondsToString(resetsIn, { length: "medium" }),
            })}
          </Label>

          {getCaveMerchantOffers(tier).map((offerId) => {
            const { cost, reward, limit } = CAVE_MERCHANT_OFFERS[offerId];
            const left = getCaveMerchantOffersLeft({
              merchant: game.cave?.merchant,
              offerId,
              periodKey,
            });
            const coins = cost.coins ?? 0;
            const canAfford =
              game.coins >= coins &&
              getKeys(cost.items).every((item) =>
                (game.inventory[item] ?? new Decimal(0)).gte(
                  cost.items[item] ?? 0,
                ),
              );

            return (
              <InnerPanel key={offerId} className="flex flex-col gap-1">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <div className="flex items-center gap-2">
                    {getKeys(reward).map((item) => (
                      <div key={item} className="flex items-center gap-1">
                        <img
                          src={ITEM_DETAILS[item].image}
                          className="h-6 object-contain"
                        />
                        <span className="text-sm">{`${reward[item]?.toString()} x ${item}`}</span>
                      </div>
                    ))}
                  </div>
                  <Label type={left > 0 ? "default" : "danger"}>
                    {t("cave.merchant.left", { left, limit })}
                  </Label>
                </div>
                <div
                  className="flex flex-wrap items-center gap-1 cursor-pointer relative"
                  onClick={() =>
                    setIngredientsFor(
                      ingredientsFor === offerId ? undefined : offerId,
                    )
                  }
                >
                  <IngredientsPopover
                    show={ingredientsFor === offerId}
                    ingredients={getKeys(cost.items)}
                    onClick={() => setIngredientsFor(undefined)}
                  />
                  {coins > 0 && (
                    <RequirementLabel
                      type="coins"
                      balance={game.coins}
                      requirement={coins}
                    />
                  )}
                  {getKeys(cost.items).map((item) => (
                    <RequirementLabel
                      key={item}
                      type="item"
                      item={item}
                      balance={game.inventory[item] ?? new Decimal(0)}
                      requirement={cost.items[item] ?? new Decimal(0)}
                    />
                  ))}
                </div>
                <Button
                  disabled={left <= 0 || !canAfford}
                  onClick={() => trade(offerId)}
                >
                  {t("cave.merchant.trade")}
                </Button>
              </InnerPanel>
            );
          })}

          {tier < CAVE_MERCHANT_OFFERS_TIER && (
            <Label type="default" className="self-center">
              {t("cave.merchant.moreOffers", {
                tier: CAVE_MERCHANT_OFFERS_TIER,
              })}
            </Label>
          )}
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};
