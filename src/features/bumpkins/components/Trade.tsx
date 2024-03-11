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
import { getBumpkinLevel } from "features/game/lib/level";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { hasFeatureAccess } from "lib/flags";
import { makeListingType } from "lib/utils/makeTradeListingType";

const VALID_NUMBER = new RegExp(/^\d*\.?\d*$/);
const INPUT_MAX_CHAR = 10;

const MAX_SFL = 150;

type Items = Partial<Record<InventoryItemName, number>>;
const ListTrade: React.FC<{
  inventory: Inventory;
  onList: (items: Items, sfl: number) => void;
  onCancel: () => void;
  hasFeatureAccess: boolean;
  isSaving: boolean;
}> = ({ inventory, onList, onCancel, hasFeatureAccess, isSaving }) => {
  const { t } = useAppTranslation();
  const [selected, setSelected] = useState<Items>({});
  const [sfl, setSFL] = useState(1);

  const select = (name: InventoryItemName) => {
    if (!hasFeatureAccess) {
      setSelected((prev) => ({
        ...prev,
        [name]: 1,
      }));
    } else {
      setSelected({ [name]: 1 });
    }
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
          <p className="text-sm ml-2">{t("bumpkinTrade.askPrice")} </p>
          <div className="flex items-center relative">
            <span className="text-xxs absolute right-[10px] top-[-5px]">{`${t(
              "max"
            )} : ${MAX_SFL}`}</span>
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
          {hasFeatureAccess && (
            <>
              <p className="text-xxs ml-2 mb-2">
                {t("trading.you.receive")} {(sfl * 0.9).toFixed(2)}
              </p>
              <p className="text-xxs ml-2 mb-2">
                {(sfl * 0.1).toFixed(2)} {t("trading.burned")}
              </p>
            </>
          )}
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
            isSaving ||
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
  isOldListing: boolean;
  onCancel: () => void;
  onClaim: () => void;
}> = ({ trade, onCancel, onClaim, isOldListing }) => {
  const { t } = useAppTranslation();
  if (trade.boughtAt) {
    return (
      <div>
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

  const text = "Cancel Old";
  return (
    <>
      <OuterPanel>
        <div className="flex justify-between ">
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
              {isOldListing ? text : t("cancel")}
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

  const hasAccess = hasFeatureAccess(gameState.context.state, "TRADING_REVAMP");

  // Show listings
  const trades = gameState.context.state.trades?.listings ?? {};
  const { t } = useAppTranslation();
  const level = getBumpkinLevel(
    gameState.context.state.bumpkin?.experience ?? 0
  );

  const onList = (items: Items, sfl: number) => {
    if (hasAccess) {
      gameService.send("LIST_TRADE", {
        sellerId: gameState.context.farmId,
        items,
        sfl,
      });
    } else {
      gameService.send("trade.listed", { items, sfl });
      gameService.send("SAVE");
    }

    setShowListing(false);
  };

  const onCancel = (listingId: string, listingType: string) => {
    if (listingId.length < 27) {
      gameService.send("trade.cancelled", { tradeId: listingId });
      gameService.send("SAVE");
    } else
      gameService.send("DELETE_TRADE_LISTING", {
        sellerId: gameState.context.farmId,
        listingId,
        listingType,
      });
  };

  if (level < 10) {
    return (
      <div className="relative">
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
        <div className="p-1 flex flex-col items-center">
          <img
            src={ITEM_DETAILS["Gold Pass"].image}
            className="w-1/5 mx-auto my-2 img-highlight-heavy"
          />
          <p className="text-sm">{t("bumpkinTrade.goldpass.required")}</p>
          <p className="text-xs mb-2">{t("bumpkinTrade.purchase")}</p>
        </div>
      </div>
    );
  }

  if (showListing) {
    return (
      <ListTrade
        inventory={gameState.context.state.inventory}
        onCancel={() => setShowListing(false)}
        onList={onList}
        hasFeatureAccess={hasAccess}
        isSaving={gameState.matches("autosaving")}
      />
    );
  }

  if (getKeys(trades).length === 0) {
    return (
      <div className="relative">
        <div className="p-1 flex flex-col items-center">
          <img src={token} className="w-1/5 mx-auto my-2 img-highlight-heavy" />
          <p className="text-sm">{t("bumpkinTrade.noTradeListed")}</p>
          <p className="text-xs mb-2">{t("bumpkinTrade.sell")}</p>
        </div>
        <Button onClick={() => setShowListing(true)}>{t("list.trade")}</Button>
      </div>
    );
  }

  if (hasAccess) {
    return (
      <div>
        {getKeys(trades).map((listingId, index) => {
          return (
            <div className="mt-2" key={index}>
              <TradeDetails
                onCancel={() =>
                  onCancel(listingId, makeListingType(trades[listingId].items))
                }
                onClaim={() => {
                  gameService.send("trade.received", {
                    tradeId: listingId,
                    beta: hasAccess,
                  });
                  gameService.send("SAVE");
                }}
                trade={trades[listingId]}
                isOldListing={listingId.length < 27}
              />
            </div>
          );
        })}
        {getKeys(trades).length < 3 && (
          <div className="relative">
            <div className="p-1 flex flex-col items-center">
              <img
                src={token}
                className="w-1/5 mx-auto my-2 img-highlight-heavy"
              />
              <p className="text-xs mb-2">{t("bumpkinTrade.sell")}</p>
            </div>
            <Button onClick={() => setShowListing(true)}>
              {t("list.trade")}
            </Button>
          </div>
        )}
      </div>
    );
  }

  const firstTrade = getKeys(trades)[0];
  const trade = trades[firstTrade];

  if (!trade) {
    return null;
  }

  return (
    <div>
      <TradeDetails
        onCancel={() => {
          gameService.send("trade.cancelled", { tradeId: firstTrade });
          gameService.send("SAVE");
        }}
        onClaim={() => {
          gameService.send("trade.received", {
            tradeId: firstTrade,
            beta: hasAccess,
          });
          gameService.send("SAVE");
        }}
        trade={trade}
        isOldListing={firstTrade.length < 27}
      />
    </div>
  );
};
