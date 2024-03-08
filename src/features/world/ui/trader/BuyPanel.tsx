import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";

import { Button } from "components/ui/Button";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { OuterPanel } from "components/ui/Panel";
import { Box } from "components/ui/Box";
import Decimal from "decimal.js-light";
import token from "assets/icons/token_2.png";
import { TRADE_LIMITS } from "features/game/events/landExpansion/listTrade";
import { getKeys } from "features/game/types/craftables";
import { InventoryItemName } from "features/game/types/game";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import {
  Listing,
  getTradeListings,
} from "features/game/actions/getTradeListings";
import { hasFeatureAccess } from "lib/flags";
import { Context as AuthContext } from "features/auth/lib/Provider";

export const BuyPanel: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthContext);
  const [authState] = useActor(authService);
  const [view, setView] = useState<"search" | "list">("search");
  const [search, setSearch] = useState<Partial<InventoryItemName[]>>([]);
  const [data, setData] = useState<Listing[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  const hasAccess = hasFeatureAccess(state, "TRADING_REVAMP");

  const toggleItemInSearch = (itemName: InventoryItemName) => {
    setSearch((currentSearch) => {
      if (currentSearch.includes(itemName)) {
        return currentSearch.filter((item) => item !== itemName);
      } else {
        return [...currentSearch, itemName];
      }
    });
  };
  const searchView = () => {
    return (
      <div className="p-2">
        <p className="text-xs mt-2">{t("trading.select.resources")}</p>

        <div className="flex flex-wrap mt-2">
          {getKeys(TRADE_LIMITS).map((name) => (
            <Box
              image={ITEM_DETAILS[name].image}
              onClick={() => toggleItemInSearch(name)}
              key={name}
              isSelected={search.includes(name)}
            />
          ))}
        </div>

        <Button
          disabled={search.length === 0}
          onClick={() => {
            onSearch(search);
          }}
        >
          {t("search")}
        </Button>
      </div>
    );
  };

  const onBack = () => {
    setView("search");
    setSearch([]);
  };

  const listView = (data: Listing[]) => {
    if (data.length === 0) {
      return (
        <div className="p-2">
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className="absolute self-start cursor-pointer"
            style={{
              top: `${PIXEL_SCALE * 2}px`,
              left: `${PIXEL_SCALE * 2}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
            alt="back"
            onClick={() => onBack()}
          />
          <p className="mt-6">{t("trading.no.listings")}</p>
        </div>
      );
    }

    return (
      <div>
        <img
          src={SUNNYSIDE.icons.arrow_left}
          className="absolute self-start cursor-pointer"
          style={{
            top: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 2}px`,
            width: `${PIXEL_SCALE * 11}px`,
          }}
          alt="back"
          onClick={() => onBack()}
        />
        <div className="mt-10">
          {data.map(({ items, sfl }, index) => {
            return (
              <OuterPanel className="p-2 mb-2" key={`data-${index}`}>
                <div className="flex justify-between">
                  <div className="flex flex-wrap w-52">
                    {getKeys(items).map((item) => (
                      <Box
                        image={ITEM_DETAILS[item].image}
                        count={new Decimal(items[item] ?? 0)}
                        disabled
                        key={`items-${index}`}
                      />
                    ))}
                  </div>

                  <div className="w-28">
                    <Button
                      disabled={false}
                      onClick={() => {
                        confirm();
                      }}
                    >
                      {t("buy")}
                    </Button>

                    <div className="flex items-center mt-1  justify-end mr-0.5">
                      <p className="text-xs">{`${sfl} SFL`}</p>
                      <img src={token} className="h-6 ml-1" />
                    </div>
                  </div>
                </div>
              </OuterPanel>
            );
          })}
        </div>
      </div>
    );
  };

  const onSearch = async (resources: Partial<InventoryItemName[]>) => {
    const type = resources.sort().join("-").toLowerCase();
    setIsSearching(true);
    const data = await getTradeListings(type, authState.context.user.rawToken);
    setData(data);
    setIsSearching(false);
    setView("list");
  };

  if (!state.inventory["Gold Pass"]) {
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

  return (
    <div className="h-[400px] overflow-y-auto pr-1 divide-brown-600 scrollable">
      <div className="flex items-start justify-between mb-2">
        {isSearching && <p className="loading">{t("searching")}</p>}
        {!isSearching && (
          <div className="relative w-full mr-4">
            {view === "search" && searchView()}
            {view === "list" && listView(data)}
          </div>
        )}
      </div>
    </div>
  );
};
