import React from "react";
import Decimal from "decimal.js-light";
import { ButtonPanel } from "components/ui/Panel";
import sfl from "assets/icons/sfl.webp";
import lightning from "assets/icons/lightning.png";
import wallet from "assets/icons/wallet.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { formatNumber } from "lib/utils/formatNumber";
import { getTradeType } from "../lib/getTradeType";
import { getItemId } from "../lib/offers";
import { TradeableDisplay } from "../lib/tradeables";
import { TRADE_LIMITS } from "features/game/actions/tradeLimits";
import { getKeys } from "features/game/types/craftables";
import { InventoryItemName } from "features/game/types/game";
import { Label } from "components/ui/Label";

type Props = {
  details: TradeableDisplay;
  count?: number;
  price?: Decimal;
  onClick?: () => void;
};

export const ListViewCard: React.FC<Props> = ({
  details,
  price,
  onClick,
  count,
}) => {
  const { type, name, image, buff } = details;
  const { t } = useAppTranslation();
  const isResources = getKeys(TRADE_LIMITS).includes(name as InventoryItemName);

  const itemId = getItemId({ name, collection: type });
  const tradeType = getTradeType({
    collection: type,
    id: itemId,
    trade: { sfl: price?.toNumber() ?? 0 },
  });

  return (
    <div className="relative cursor-pointer h-full">
      <ButtonPanel
        onClick={onClick}
        variant="card"
        className="h-full flex flex-col"
      >
        <div className="flex flex-col items-center h-20 p-2 pt-4">
          <img src={image} className="h-3/4 mt-2" />
        </div>

        <div
          className="bg-white px-2 py-2 flex-1"
          style={{
            background: "#fff0d4",
            borderTop: "1px solid #e4a672",
            margin: "0 -8px",
            marginBottom: "-2.6px",
          }}
        >
          {price && price.gt(0) && (
            <div className="flex items-center absolute top-0 left-0">
              <img src={sfl} className="h-5 mr-1" />
              <p className="text-xs">
                {isResources
                  ? t("marketplace.pricePerUnit", {
                      price: formatNumber(price, {
                        decimalPlaces: 4,
                      }),
                    })
                  : `${formatNumber(price, {
                      decimalPlaces: 4,
                    })}`}
              </p>
            </div>
          )}

          {tradeType === "onchain" && (
            <img src={wallet} className="h-5 mr-1 absolute top-0 -right-1" />
          )}

          {count && (
            <Label type="default" className="absolute top-0 -left-0.5">
              {`x${count}`}
            </Label>
          )}

          <p className="text-xs mb-0.5 text-[#181425]">{name}</p>

          {buff && (
            <div className="flex items-center">
              <img
                src={buff.boostedItemIcon ?? lightning}
                className="h-4 mr-1"
              />
              <p className="text-xs truncate pb-0.5">{buff.shortDescription}</p>
            </div>
          )}
        </div>
      </ButtonPanel>
    </div>
  );
};
