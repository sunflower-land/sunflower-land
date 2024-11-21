import React from "react";
import Decimal from "decimal.js-light";
import { ButtonPanel } from "components/ui/Panel";
import sfl from "assets/icons/sfl.webp";
import lightning from "assets/icons/lightning.png";
import { BuffLabel } from "features/game/types";
import { CollectionName } from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { formatNumber } from "lib/utils/formatNumber";

type Props = {
  name: string;
  image: string;
  type: CollectionName;
  price?: Decimal;
  onClick?: () => void;
  buff?: BuffLabel;
};

export const ListViewCard: React.FC<Props> = ({
  name,
  buff,
  image,
  type,
  price,
  onClick,
}) => {
  const { t } = useAppTranslation();
  const isResources = type === "resources";

  return (
    <div className="relative cursor-pointer h-full">
      <ButtonPanel
        onClick={onClick}
        variant="card"
        className="h-full flex flex-col"
      >
        <div className="flex flex-col items-center h-20 p-2 pt-4">
          <img src={image} className="h-full" />
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
