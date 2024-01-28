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
import lock from "assets/skills/lock.png";
import Decimal from "decimal.js-light";
import { OuterPanel } from "components/ui/Panel";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { Label } from "components/ui/Label";
import { getBumpkinLevel } from "features/game/lib/level";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const VALID_NUMBER = new RegExp(/^\d*\.?\d*$/);
const INPUT_MAX_CHAR = 10;

const MAX_SFL = 150;

type Items = Partial<Record<InventoryItemName, number>>;
const ListTrade: React.FC<{
  inventory: Inventory;
  onList: (items: Items, sfl: number) => void;
  onCancel: () => void;
}> = ({ inventory, onList, onCancel }) => {
  const { t } = useAppTranslation();
  const [selected, setSelected] = useState<Items>({});
  const [sfl, setSFL] = useState(1);
  const select = (name: InventoryItemName) => {
    setSelected((prev) => ({
      ...prev,
      [name]: 1,
    }));
  };

  const hasResources = getKeys(selected).every((name) =>
    inventory[name]?.gte(selected[name] ?? 0)
  );

  const exceedsMax = getKeys(selected).some(
    (name) => (selected[name] ?? 0) > (TRADE_LIMITS[name] ?? 0)
  );

  const maxSFL = sfl > MAX_SFL;
  const allListedAmtGreaterThanZero = getKeys(selected).every((name) => {
    return selected[name] ?? 0 > 0;
  });

  return (
    <div>
      <p className="mb-1 p-1 text-sm">{t("bumpkinTrade.like.list")}</p>

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
              <span className="text-xxs absolute right-[10px] top-[-5px]">{`Max: ${
                TRADE_LIMITS[item] ?? 0
              }`}</span>
              <input
                style={{
                  boxShadow: "#b96e50 0px 1px 1px 1px inset",
                  border: "2px solid #ead4aa",
                }}
                type="number"
                min={1}
                value={selected[item]}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  // Strip the leading zero from numbers
                  if (
                    /^0+(?!\.)/.test(e.target.value) &&
                    e.target.value.length > 1
                  ) {
                    e.target.value = e.target.value.replace(/^0/, "");
                  }
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
                    "text-error":
                      inventory[item]?.lt(selected[item] ?? 0) ||
                      (selected[item] ?? 0) > (TRADE_LIMITS[item] ?? 0) ||
                      !allListedAmtGreaterThanZero,
                  }
                )}
              />
              <img
                src={SUNNYSIDE.icons.cancel}
                className="h-6 absolute top-5 right-4 cursor-pointer"
                onClick={() =>
                  setSelected((prev) => {
                    delete prev[item];
                    return { ...prev };
                  })
                }
              />
            </div>
          ))}
          <p className="text-sm ml-2">{t("bumpkinTrade.askPrice")}: </p>

          <div className="flex items-center relative">
            <span className="text-xxs absolute right-[10px] top-[-5px]">{`Max: ${MAX_SFL}`}</span>
            <Box image={token} />
            <input
              style={{
                boxShadow: "#b96e50 0px 1px 1px 1px inset",
                border: "2px solid #ead4aa",
              }}
              type="number"
              value={sfl}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                // Strip the leading zero from numbers
                if (
                  /^0+(?!\.)/.test(e.target.value) &&
                  e.target.value.length > 1
                ) {
                  e.target.value = e.target.value.replace(/^0/, "");
                }

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
                  "text-error": maxSFL || sfl === 0,
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
          {t("cancel")}
        </Button>
        <Button
          disabled={
            maxSFL ||
            exceedsMax ||
            getKeys(selected).length === 0 ||
            !hasResources ||
            !allListedAmtGreaterThanZero ||
            sfl === 0
          }
          onClick={() => onList(selected, sfl)}
        >
          {t("list")}
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
  const { t } = useAppTranslation();
  if (trade.boughtAt) {
    return (
      <div>
        <div className="flex items-center   mb-2 mt-1 mx-1">
          <img src={SUNNYSIDE.icons.heart} className="h-4 mr-1" />
          <p className="text-xs">{t("bumpkinTrade.listingPurchased")}</p>
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
                {t("claim")}
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
        <p className="text-xs">{t("bumpkinTrade.travelPlaza")}</p>
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
              {t("cancel")}
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
  const { t } = useAppTranslation();
  const level = getBumpkinLevel(
    gameState.context.state.bumpkin?.experience ?? 0
  );

  if (level < 10) {
    return (
      <div className="relative">
        <Label type="info" className="absolute top-2 right-2">
          {t("beta")}
        </Label>
        <div className="p-1 flex flex-col items-center">
          <img src={lock} className="w-1/5 mx-auto my-2 img-highlight-heavy" />
          <p className="text-sm">{t("bumpkinTrade.minLevel")}</p>
          <p className="text-xs mb-2">{t("statements.lvlUp")}</p>
        </div>
      </div>
    );
  }

  if (!gameState.context.state.inventory["Gold Pass"]) {
    return (
      <div className="relative">
        <Label type="info" className="absolute top-2 right-2">
          Beta
        </Label>
        <div className="p-1 flex flex-col items-center">
          <img
            src={ITEM_DETAILS["Gold Pass"].image}
            className="w-1/5 mx-auto my-2 img-highlight-heavy"
          />
          <p className="text-sm">Gold Pass is required</p>
          <p className="text-xs mb-2">Purchase at Goblin Retreat</p>
        </div>
      </div>
    );
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
      <div className="relative">
        <Label type="info" className="absolute top-2 right-2">
          {t("beta")}
        </Label>
        <div className="p-1 flex flex-col items-center">
          <img src={token} className="w-1/5 mx-auto my-2 img-highlight-heavy" />
          <p className="text-sm">{t("bumpkinTrade.noTradeListed")}</p>
          <p className="text-xs mb-2">{t("bumpkinTrade.sell")}</p>
        </div>
        <Button onClick={() => setShowListing(true)}>
          {t("bumpkinTrade.list")}
        </Button>
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
