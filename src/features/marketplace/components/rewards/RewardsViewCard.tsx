import { ButtonPanel } from "components/ui/Panel";
import { TradeReward } from "features/game/events/landExpansion/redeemTradeReward";
import { ITEM_DETAILS } from "features/game/types/images";
import React from "react";

interface Props {
  onClick: () => void;
  TradeReward: TradeReward;
}
export const RewardsViewCard: React.FC<Props> = ({ onClick, TradeReward }) => {
  const { name, image, ingredients } = TradeReward;
  return (
    <div className="relative cursor-pointer h-full">
      <ButtonPanel
        onClick={onClick}
        variant="card"
        className="h-full flex flex-col"
      >
        <div className="flex flex-col items-center h-20 p-2 pt-4">
          <img src={image} className="object-contain h-[80%] mt-1" />
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
          <div className="flex items-center absolute top-0 right-0">
            <p className="text-xxs sm:text-xs whitespace-nowrap mr-1">
              {`${ingredients["Trade Point"]}`}
            </p>
            <img
              src={ITEM_DETAILS["Trade Point"].image}
              className="h-4 sm:h-5 mr-1"
            />
          </div>
          <p className="text-xs mb-0.5 text-[#181425]">{name}</p>
        </div>
      </ButtonPanel>
    </div>
  );
};
