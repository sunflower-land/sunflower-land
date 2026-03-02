import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";

import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { Decimal } from "decimal.js-light";

import { SplitScreenView } from "components/ui/SplitScreenView";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { BumpkinItem } from "features/game/types/bumpkin";
import { InventoryItemName } from "features/game/types/game";
import { isCollectible } from "features/game/events/landExpansion/garbageSold";
import { CLUTTER, ClutterName } from "features/game/types/clutter";
import { ShopSellDetails } from "components/ui/layouts/ShopSellDetails";
import { getWearableImage } from "features/game/lib/getWearableImage";

const BULK_BURN_AMOUNT = 10;

export const Incinerator: React.FC = () => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const clutter = getKeys(CLUTTER).sort(
    (a, b) => CLUTTER[b].sellUnit - CLUTTER[a].sellUnit,
  );

  const [selectedName, setSelectedName] = useState<ClutterName>(clutter[0]);

  const burn = (amount = 1) => {
    gameService.send({ type: "clutter.burned", item: selectedName, amount });
  };

  return (
    <SplitScreenView
      panel={
        <ShopSellDetails
          details={{
            item: selectedName,
          }}
          properties={{
            clutterItem: selectedName,
            cheer: 1,
          }}
          actionView={
            <Action
              owned={state.inventory[selectedName]?.toNumber() ?? 0}
              item={selectedName}
              burn={burn}
            />
          }
        />
      }
      content={
        <>
          {clutter.map((name: ClutterName) => {
            const image = !isCollectible(name)
              ? getWearableImage(name as BumpkinItem)
              : ITEM_DETAILS[name as InventoryItemName].image;
            return (
              <Box
                isSelected={selectedName === name}
                key={name}
                onClick={() => setSelectedName(name)}
                image={image}
                count={state.inventory[name] ?? new Decimal(0)}
              />
            );
          })}
        </>
      }
    />
  );
};

const Action: React.FC<{
  owned: number;
  item: ClutterName;
  burn: (amount: number) => void;
}> = ({ owned, item, burn }) => {
  const { t } = useAppTranslation();
  const sellUnit = CLUTTER[item].sellUnit;

  return (
    <div className="flex space-x-1 w-full sm:flex-col sm:space-x-0 sm:space-y-1">
      <Button disabled={owned < sellUnit} onClick={() => burn(sellUnit)}>
        {t("incinerator.burn", {
          number: sellUnit,
        })}
      </Button>
      <Button
        disabled={owned < sellUnit * BULK_BURN_AMOUNT}
        onClick={() => burn(sellUnit * BULK_BURN_AMOUNT)}
      >
        {t("incinerator.burn", {
          number: sellUnit * BULK_BURN_AMOUNT,
        })}
      </Button>
    </div>
  );
};
