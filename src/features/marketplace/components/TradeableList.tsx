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
import { TradeableDisplay } from "../lib/tradeables";
import { Button } from "components/ui/Button";

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

  const itemName = KNOWN_ITEMS[id];
  const { inventory } = gameState.context.state;

  // Check inventory count
  const count = inventory[itemName]?.toNumber() ?? 0;
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

  return (
    <div className="flex flex-col">
      <Label type="default" className="my-1 ml-2" icon={tradeIcon}>
        {t("marketplace.listItem", {
          type: `${display.type.slice(0, display.type.length - 1)}`,
        })}
      </Label>
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
      {count < 1 && (
        <>
          <div className="p-2">{`You don't own this item!`}</div>
          <Button onClick={onClose}>{t("close")}</Button>
        </>
      )}
    </div>
  );
};
