import React, { useContext, useRef, useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getKeys } from "features/game/types/craftables";
import {
  BeachBountyTreasure,
  SELLABLE_TREASURES,
} from "features/game/types/treasure";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { getSellPrice } from "features/game/events/landExpansion/treasureSold";
import Decimal from "decimal.js-light";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { ShopSellDetails } from "components/ui/layouts/ShopSellDetails";
import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { NPC_WEARABLES } from "lib/npcs";
import { BulkSellModal } from "components/ui/BulkSellModal";
import { CHAPTER_ARTEFACT } from "features/game/types/desert";
import { getCurrentChapter } from "features/game/types/chapters";
import { useNow } from "lib/utils/hooks/useNow";

export const TreasureShopSell: React.FC = () => {
  const { t } = useAppTranslation();
  const now = useNow();
  const currentChapter = getCurrentChapter(now);
  const currentSeasonalArtefact = CHAPTER_ARTEFACT[currentChapter];
  const beachBountyTreasure = getKeys(SELLABLE_TREASURES).sort(
    (a, b) => SELLABLE_TREASURES[a].sellPrice - SELLABLE_TREASURES[b].sellPrice,
  );

  const [selectedName, setSelectedName] = useState<BeachBountyTreasure>(
    beachBountyTreasure[0],
  );
  const [confirmationModal, showConfirmationModal] = useState(false);
  const [bulkSellModal, showBulkSellModal] = useState(false);
  const [customAmount, setCustomAmount] = useState(new Decimal(0));

  const selected = SELLABLE_TREASURES[selectedName];
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const divRef = useRef<HTMLDivElement>(null);

  const inventory = state.inventory;

  const { price } = getSellPrice(selected, state);
  const amount = inventory[selectedName] || new Decimal(0);
  const coinAmount = price * customAmount.toNumber();

  const sell = (amount = 1) => {
    gameService.send({ type: "treasure.sold", item: selectedName, amount });
  };
  const isValuable = selectedName === currentSeasonalArtefact || price > 1000;
  const handleSellOne = () => {
    if (isValuable) {
      showConfirmationModal(true);
    } else {
      sell();
    }
  };

  const handleSellTenOrLess = () => {
    if (amount.greaterThanOrEqualTo(10)) {
      sell(10);
    } else {
      sell(amount.toNumber());
    }
  };

  const closeBulkSellModal = () => {
    showBulkSellModal(false);
    setCustomAmount(new Decimal(0));
  };

  return (
    <>
      <SplitScreenView
        divRef={divRef}
        panel={
          <ShopSellDetails
            details={{
              item: selectedName,
              from: selected.from,
              to: selected.to,
            }}
            properties={{
              coins: price,
            }}
            actionView={
              <div className="flex flex-col h-full justify-between">
                <div className="flex space-x-1 mb-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full">
                  {amount.greaterThanOrEqualTo(1) && (
                    <Button onClick={handleSellOne}>{t("sell.one")}</Button>
                  )}
                  {amount.gt(1) && !isValuable && (
                    <Button onClick={handleSellTenOrLess}>
                      {t(amount.greaterThan(10) ? "sell.ten" : "sell.amount", {
                        amount,
                      })}
                    </Button>
                  )}
                </div>
                <div>
                  {amount.gt(10) && !isValuable && (
                    <Button onClick={() => showBulkSellModal(true)}>
                      {t("sell.inBulk")}
                    </Button>
                  )}
                </div>
                {amount.lessThanOrEqualTo(0) && (
                  <p className="text-xxs text-center mb-1">
                    {t("desert.noTreasureToSell", { treasure: selectedName })}
                  </p>
                )}
              </div>
            }
          />
        }
        content={
          <>
            {beachBountyTreasure.map((name: BeachBountyTreasure) => (
              <Box
                isSelected={selectedName === name}
                key={name}
                onClick={() => setSelectedName(name)}
                image={ITEM_DETAILS[name].image}
                count={inventory[name] || new Decimal(0)}
              />
            ))}
          </>
        }
      />
      <ConfirmationModal
        show={confirmationModal}
        onHide={() => showConfirmationModal(false)}
        messages={[
          selectedName === currentSeasonalArtefact
            ? t("confirmation.sellSeasonalArtefact")
            : price > 1000
              ? t("confirmation.valuableTreasure")
              : t("confirmation.sell", {
                  amount: customAmount,
                  name: selectedName,
                  coinAmount,
                }),
        ]}
        onCancel={() => {
          showConfirmationModal(false);
          setCustomAmount(new Decimal(0));
        }}
        onConfirm={() => {
          if (isValuable) {
            sell();
          } else {
            sell(customAmount.toNumber());
            showConfirmationModal(false);
          }
        }}
        confirmButtonLabel={t("sell")}
        bumpkinParts={NPC_WEARABLES.jafar}
      />
      <BulkSellModal
        show={bulkSellModal}
        onHide={closeBulkSellModal}
        itemAmount={amount}
        customAmount={customAmount}
        setCustomAmount={setCustomAmount}
        onCancel={closeBulkSellModal}
        onSell={() => {
          showConfirmationModal(true);
          showBulkSellModal(false);
        }}
        bumpkinParts={NPC_WEARABLES.jafar}
        coinAmount={new Decimal(coinAmount)}
        maxDecimalPlaces={0} // It shouldn't allow decimal places
      />
    </>
  );
};
