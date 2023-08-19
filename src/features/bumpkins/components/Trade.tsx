import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { TRADE_LIMITS } from "features/game/events/landExpansion/listTrade";
import { getKeys } from "features/game/types/craftables";
import {
  Inventory,
  InventoryItemName,
  TradeListing,
} from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { ChangeEvent, useContext, useState } from "react";
import token from "assets/icons/token_2.png";
import Decimal from "decimal.js-light";
import { OuterPanel } from "components/ui/Panel";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";

const VALID_NUMBER = new RegExp(/^\d*\.?\d*$/);
const INPUT_MAX_CHAR = 10;

type Items = Partial<Record<InventoryItemName, number>>;
const ListTrade: React.FC<{
  inventory: Inventory;
  onList: (items: Items, sfl: number) => void;
  onCancel: () => void;
}> = ({ inventory, onList, onCancel }) => {
  const [selected, setSelected] = useState<Items>({});
  const [sfl, setSFL] = useState(1);
  const select = (name: InventoryItemName) => {
    setSelected((prev) => ({
      ...prev,
      [name]: 1,
    }));
  };

  return (
    <div>
      <p className="mb-1 p-1 text-sm">What would you like to list?</p>

      <div className="flex flex-wrap">
        {getKeys(TRADE_LIMITS)
          .filter((name) => !!inventory[name]?.gte(1) && !selected[name])
          .map((name) => (
            <Box
              image={ITEM_DETAILS[name].image}
              count={inventory[name]}
              onClick={() => select(name)}
              key={name}
            />
          ))}
      </div>

      {getKeys(selected).length > 0 && (
        <>
          {getKeys(selected).map((item) => (
            <div key={item} className="flex items-center relative">
              <Box
                image={ITEM_DETAILS[item].image}
                count={inventory[item]}
                onClick={() => select(item)}
              />
              <input
                style={{
                  boxShadow: "#b96e50 0px 1px 1px 1px inset",
                  border: "2px solid #ead4aa",
                }}
                type="number"
                value={selected[item]}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (VALID_NUMBER.test(e.target.value)) {
                    const amount = Number(
                      e.target.value.slice(0, INPUT_MAX_CHAR)
                    );
                    setSelected((prev) => ({
                      ...prev,
                      [item]: amount,
                    }));
                  }
                }}
                className={classNames(
                  "text-shadow mr-2 rounded-sm shadow-inner shadow-black bg-brown-200 w-full p-2 h-10",
                  {
                    "text-error": false,
                  }
                )}
              />
              <img
                src={SUNNYSIDE.icons.cancel}
                className="h-6 absolute top-5 right-4 cursor-pointer"
                onClick={() =>
                  setSelected((prev) => {
                    console.log("DEL", item, prev);
                    delete prev[item];
                    console.log("DEL", item, prev);
                    return { ...prev };
                  })
                }
              />
            </div>
          ))}
          <p className="text-sm ml-2">Asking price:</p>

          <div className="flex items-center">
            <Box image={token} />
            <input
              style={{
                boxShadow: "#b96e50 0px 1px 1px 1px inset",
                border: "2px solid #ead4aa",
              }}
              type="number"
              value={sfl}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (VALID_NUMBER.test(e.target.value)) {
                  const amount = Number(
                    e.target.value.slice(0, INPUT_MAX_CHAR)
                  );
                  setSFL(amount);
                }
              }}
              className={classNames(
                "text-shadow mr-2 rounded-sm shadow-inner shadow-black bg-brown-200 w-full p-2 h-10",
                {
                  "text-error": false,
                }
              )}
            />
          </div>

          {/* <div className="flex mb-2 mx-1.5">
            <img src={ITEM_DETAILS["Block Buck"].image} className="h-4 mr-1" />
            <span className="text-xs">A listing requires 1 x Block Buck</span>
          </div> */}
        </>
      )}
      <div className="flex">
        <Button className="mr-1" onClick={() => onCancel()}>
          Cancel
        </Button>
        <Button
          disabled={getKeys(selected).length === 0}
          onClick={() => onList(selected, sfl)}
        >
          List
        </Button>
      </div>
    </div>
  );
};

const TradeDetails: React.FC<{
  trade: TradeListing;
  onCancel: () => void;
  onClaim: () => void;
}> = ({ trade, onCancel, onClaim }) => {
  if (trade.boughtAt) {
    return (
      <div>
        <div className="flex items-center   mb-2 mt-1 mx-1">
          <img src={SUNNYSIDE.icons.heart} className="h-4 mr-1" />
          <p className="text-xs">
            Congratulations, your listing was purchased!
          </p>
        </div>
        <OuterPanel>
          <div className="flex justify-between">
            <div>
              <div className="flex flex-wrap">
                {getKeys(trade.items).map((name) => (
                  <Box
                    image={ITEM_DETAILS[name].image}
                    count={new Decimal(trade.items[name] ?? 0)}
                    disabled
                    key={name}
                  />
                ))}
              </div>
              <div className="flex items-center ml-1 mb-1">
                <img src={SUNNYSIDE.icons.player} className="h-5 mr-1" />
                <p className="text-xs">{`Bought by #${trade.buyerId}`}</p>
              </div>
            </div>
            <div className="flex flex-col justify-between h-full">
              <Button className="mb-1" onClick={onClaim}>
                Claim
              </Button>

              <div className="flex items-center mt-3 mr-0.5">
                <img src={token} className="h-6 mr-1" />
                <p className="text-xs">{`${trade.sfl} SFL`}</p>
              </div>
            </div>
          </div>
        </OuterPanel>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center   mb-2 mt-1 mx-1">
        <img src={CROP_LIFECYCLE.Pumpkin.crop} className="h-4 mr-1" />
        <p className="text-xs">
          Travel to the plaza so players can trade with you
        </p>
      </div>
      <OuterPanel>
        <div className="flex justify-between">
          <div className="flex flex-wrap">
            {getKeys(trade.items).map((name) => (
              <Box
                image={ITEM_DETAILS[name].image}
                count={new Decimal(trade.items[name] ?? 0)}
                disabled
                key={name}
              />
            ))}
          </div>
          <div className="flex flex-col justify-between h-full">
            <Button className="mb-1" onClick={onCancel}>
              Cancel
            </Button>

            <div className="flex items-center">
              <img src={token} className="h-6 mr-2" />
              <p className="text-xs">{`${trade.sfl} SFL`}</p>
            </div>
          </div>
        </div>
      </OuterPanel>
    </>
  );
};
export const Trade: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showListing, setShowListing] = useState(false);

  // Show listings
  const trades = gameState.context.state.trades?.listings ?? {};

  if (gameState.matches("autosaving")) {
    return <p className="m-1 loading">Saving</p>;
  }

  if (showListing) {
    return (
      <ListTrade
        inventory={gameState.context.state.inventory}
        onCancel={() => setShowListing(false)}
        onList={(items, sfl) => {
          gameService.send("trade.listed", { items, sfl });
          gameService.send("SAVE");
          setShowListing(false);
        }}
      />
    );
  }

  if (getKeys(trades).length === 0) {
    return (
      <div>
        <div className="p-1 flex flex-col items-center">
          <img src={token} className="w-1/5 mx-auto my-2 img-highlight-heavy" />
          <p className="text-sm">You have no trades listed.</p>
          <p className="text-xs mb-2">
            Sell your resources to other players for SFL.
          </p>
        </div>
        <Button onClick={() => setShowListing(true)}>List trade</Button>
      </div>
    );
  }

  // Only 1 trade supported at the moment
  const firstTrade = getKeys(trades)[0];
  const trade = trades[firstTrade];

  if (!trade) {
    return null;
  }

  // Cancel Trade
  return (
    <div>
      <TradeDetails
        onCancel={() => {
          gameService.send("trade.cancelled", { tradeId: firstTrade });
          gameService.send("SAVE");
        }}
        onClaim={() => {
          gameService.send("trade.received", { tradeId: firstTrade });
          gameService.send("SAVE");
        }}
        trade={trade}
      />
    </div>
  );
};
