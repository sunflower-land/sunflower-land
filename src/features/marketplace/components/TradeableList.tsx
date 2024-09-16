import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import { Box } from "components/ui/Box";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { KNOWN_ITEMS } from "features/game/types";
import { ITEM_DETAILS } from "features/game/types/images";
import { TradeableDetails } from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { signTypedData } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";

import tradeIcon from "assets/icons/trade.png";
import walletIcon from "assets/icons/wallet.png";
import sflIcon from "assets/icons/sfl.webp";
import lockIcon from "assets/icons/lock.png";

import { TradeableDisplay } from "../lib/tradeables";
import { Button } from "components/ui/Button";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";
import { NumberInput } from "components/ui/NumberInput";

export const TradeableListItem: React.FC<{
  tradeable?: TradeableDetails;
  farmId: number;
  display: TradeableDisplay;
  id: number;
  onClose: () => void;
}> = ({ tradeable, farmId, display, id, onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { t } = useAppTranslation();

  const [isSigning, setIsSigning] = useState(false);
  const [price, setPrice] = useState(0);

  const itemName = KNOWN_ITEMS[id];
  const { state } = gameState.context;

  // Check inventory count
  const count = state.inventory[itemName]?.toNumber() ?? 0;
  const available = getChestItems(state)[itemName]?.toNumber() ?? 0;
  const tradeFee = 0.1;
  // If does not have one then show information saying you do not have this item

  // Check chest count
  // If 0 then show information showing that you the item is currently placed and you will need to remove it in order to list it

  // Otherwise show the list item UI

  const onClick = async () => {
    setIsSigning(true);

    const signature = await signTypedData(config, {
      primaryType: "Listing",
      types: {
        Listing: [
          { name: "item", type: "string" },
          { name: "quantity", type: "uint256" },
          { name: "SFL", type: "uint256" },
        ],
      },
      message: {
        item: "Kuebiko",
        quantity: BigInt(1),
        SFL: BigInt(1),
      },
      domain: {
        name: "Sunflower Land",
      },
    });

    gameService.send("POST_EFFECT", {
      effect: {
        type: "marketplace.onChainCollectibleListed",
        item: "Kuebiko",
        signature,
        sfl: 1,
      },
    });

    setIsSigning(false);
  };

  if (count > 0 && available === 0) {
    return (
      <div className="flex flex-col">
        <Label type="danger" className="my-1 ml-2" icon={lockIcon}>
          {t("marketplace.itemInUse")}
        </Label>
        <div className="p-2 mb-1">{t("marketplace.itemInUseWarning")}</div>
        <Button onClick={onClose}>{t("close")}</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <Label type="default" className="my-1 ml-2" icon={tradeIcon}>
          {t("marketplace.listItem", {
            type: `${display.type.slice(0, display.type.length - 1)}`,
          })}
        </Label>
        {tradeable?.type === "onchain" && (
          <Label type="formula" icon={walletIcon} className="my-1 mr-0.5">
            {t("marketplace.walletRequired")}
          </Label>
        )}
      </div>
      <div className="flex justify-between">
        <div className="flex items-center">
          <Box image={ITEM_DETAILS[itemName].image} disabled />
          <span className="text-sm">{itemName}</span>
        </div>
        <div className="flex items-center mr-1">
          <Label type={count < 1 ? "danger" : "default"}>
            {t("marketplace.youOwn", { count })}
          </Label>
        </div>
      </div>
      {count < 1 ? (
        <>
          <div className="p-2">{`You don't own this item!`}</div>
          <Button onClick={onClose}>{t("close")}</Button>
        </>
      ) : (
        <div className="flex flex-col p-2">
          <Label type="default" icon={sflIcon}>
            {t("bumpkinTrade.price")}
          </Label>
          <div className="my-2 -mx-2">
            <NumberInput
              value={price}
              onValueChange={(decimal) => setPrice(decimal.toNumber())}
              maxDecimalPlaces={0}
              icon={sflIcon}
            />
          </div>
          <div
            className="flex justify-between"
            style={{
              borderBottom: "1px solid #ead4aa",
              padding: "5px 5px 5px 2px",
            }}
          >
            <span className="text-xs"> {t("bumpkinTrade.listingPrice")}</span>
            <p className="text-xs font-secondary">{`${price} SFL`}</p>
          </div>
          <div
            className="flex justify-between"
            style={{
              borderBottom: "1px solid #ead4aa",
              padding: "5px 5px 5px 2px",
            }}
          >
            <span className="text-xs"> {t("bumpkinTrade.tradingFee")}</span>
            <p className="text-xs font-secondary">{`${price * tradeFee} SFL`}</p>
          </div>
        </div>
      )}
    </div>
  );
};
