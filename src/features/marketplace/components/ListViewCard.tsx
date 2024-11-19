import React from "react";
import Decimal from "decimal.js-light";
import { ButtonPanel } from "components/ui/Panel";
import { CollectionName } from "features/game/types/marketplace";
import { CONFIG } from "lib/config";

import buds from "lib/buds/buds";
import testnetBuds from "lib/buds/testnet-buds";

import sfl from "assets/icons/sfl.webp";
import lightning from "assets/icons/lightning.png";
// bud backgrounds
import { BuffLabel } from "features/game/types";

type Props = {
  name: string;
  image: string;
  type: CollectionName;
  id: number;
  hasBoost: boolean;
  supply: number;
  price?: Decimal;
  onClick?: () => void;
  onRemove?: () => void;
  isSold?: boolean;
  buff?: BuffLabel;
};

const data = CONFIG.NETWORK === "mainnet" ? buds : testnetBuds;

export const ListViewCard: React.FC<Props> = ({
  name,
  id,
  buff,
  image,
  supply,
  type,
  price,
  onClick,
}) => {
  return (
    <div className="relative cursor-pointer h-full">
      <ButtonPanel
        onClick={onClick}
        variant="card"
        className="h-full flex flex-col"
      >
        <div className="flex flex-col items-center h-20 p-2">
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
          {price && (
            <div className="flex items-center absolute top-0 left-0">
              <img src={sfl} className="h-5 mr-1" />
              <p className="text-xs">{`${price} `}</p>
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
