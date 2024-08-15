import React, { useContext, useRef, useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getKeys } from "features/game/types/craftables";
import {
  BeachBountyTreasure,
  SEASONAL_ARTEFACT,
  SELLABLE_TREASURE,
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

export const TreasureShopSell: React.FC = () => {
  const { t } = useAppTranslation();
  const beachBountyTreasure = getKeys(SELLABLE_TREASURE).sort(
    (a, b) => SELLABLE_TREASURE[a].sellPrice - SELLABLE_TREASURE[b].sellPrice,
  );

  const [selectedName, setSelectedName] = useState<BeachBountyTreasure>(
    beachBountyTreasure[0],
  );
  const [confirmationModal, showConfirmationModal] = useState(false);

  const selected = SELLABLE_TREASURE[selectedName];
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const divRef = useRef<HTMLDivElement>(null);

  const inventory = state.inventory;

  const price = getSellPrice(selected, state);
  const amount = inventory[selectedName] || new Decimal(0);

  const sell = (amount = 1) => {
    gameService.send("treasure.sold", {
      item: selectedName,
      amount,
    });
  };
  const isValuable = selectedName in SEASONAL_ARTEFACT || price > 1000;
  const handleSellOne = () => {
    if (isValuable) {
      showConfirmationModal(true);
    } else {
      sell(1);
    }
  };

  const handleSellTenOrLess = () => {
    if (amount.greaterThanOrEqualTo(10)) {
      sell(10);
    } else {
      sell(amount.toNumber());
    }
  };

  return (
    <>
      <SplitScreenView
        divRef={divRef}
        panel={
          <ShopSellDetails
            details={{
              item: selectedName,
            }}
            properties={{
              coins: price,
            }}
            actionView={
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
          selectedName in SEASONAL_ARTEFACT
            ? t("confirmation.sellSeasonalArtefact")
            : price > 1000
              ? t("confirmation.valuableTreasure")
              : "",
        ]}
        onCancel={() => showConfirmationModal(false)}
        onConfirm={() => sell(1)}
        confirmButtonLabel={t("sell")}
        bumpkinParts={NPC_WEARABLES.jafar}
      />
    </>
  );
};
