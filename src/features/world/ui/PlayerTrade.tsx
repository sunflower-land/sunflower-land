import { Box } from "components/ui/Box";
import Decimal from "decimal.js-light";
import { loadGameStateForVisit } from "features/game/actions/loadGameStateForVisit";
import { getKeys } from "features/game/types/craftables";
import { TradeListing } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import { useActor } from "@xstate/react";
import { InnerPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import * as AuthProvider from "features/auth/lib/Provider";
import { hasMaxItems } from "features/game/lib/processEvent";
import { Label } from "components/ui/Label";
import { getBumpkinLevel } from "features/game/lib/level";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { makeListingType } from "lib/utils/makeTradeListingType";
import { Loading } from "features/auth/components";
import token from "assets/icons/sfl.webp";

interface Props {
  farmId: number;
  onClose: () => void;
}
export const PlayerTrade: React.FC<Props> = ({ farmId, onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const [warning, setWarning] = useState<"pendingTransaction" | "hoarding">();
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState<
    Record<string, TradeListing> | undefined
  >();
  const [showConfirmId, setShowConfirmId] = useState("");

  const { t } = useAppTranslation();

  useEffect(() => {
    const load = async () => {
      const farm = await loadGameStateForVisit(
        farmId,
        authState.context.user.rawToken,
      );

      const listings = farm.state.trades?.listings;
      setListings(listings);

      setIsLoading(false);
    };

    load();
  }, []);

  const level = getBumpkinLevel(
    gameState.context.state.bumpkin?.experience ?? 0,
  );

  if (level < 10) {
    return (
      <div className="relative">
        <Label type="info" className="absolute top-2 right-2">
          {t("beta")}
        </Label>
        <div className="p-1 flex flex-col items-center">
          <img
            src={SUNNYSIDE.icons.lock}
            className="w-1/5 mx-auto my-2 img-highlight-heavy"
          />
          <p className="text-sm">{t("bumpkinTrade.minLevel")}</p>
          <p className="text-xs mb-2">{t("statements.lvlUp")}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  if (!listings || getKeys(listings).length === 0)
    return (
      <div className="p-2">
        <img src={SUNNYSIDE.icons.sad} className="mx-auto w-1/5 my-2" />
        <p className="text-sm mb-2 text-center">{t("playerTrade.no.trade")}</p>
      </div>
    );

  if (warning === "hoarding") {
    return (
      <div className="p-1 flex flex-col items-center">
        <img src={SUNNYSIDE.icons.lock} className="w-1/5 mb-2" />
        <p className="text-sm mb-1 text-center">{t("playerTrade.max.item")}</p>
        <p className="text-xs mb-1 text-center">{t("playerTrade.Progress")}</p>
      </div>
    );
  }

  if (warning === "pendingTransaction") {
    return (
      <div className="p-1 flex flex-col items-center">
        <img src={SUNNYSIDE.icons.timer} className="w-1/6 mb-2" />
        <p className="text-sm mb-1 text-center">
          {t("playerTrade.transaction")}
        </p>
        <p className="text-xs mb-1 text-center">{t("playerTrade.Please")}</p>
      </div>
    );
  }

  const confirm = (listingId: string) => {
    // Check hoard
    const inventory = gameState.context.state.inventory;
    const updatedInventory = getKeys(listings[listingId].items).reduce(
      (acc, name) => ({
        ...acc,
        [name]: (inventory[name] ?? new Decimal(0)).add(
          listings[listingId].items[name] ?? 0,
        ),
      }),
      inventory,
    );

    const hasMaxedOut = hasMaxItems({
      current: updatedInventory,
      old: gameState.context.state.previousInventory,
    });

    if (hasMaxedOut) {
      setWarning("hoarding");
      return;
    }

    if (
      gameState.context.transaction &&
      gameState.context.transaction.expiresAt > Date.now()
    ) {
      setWarning("pendingTransaction");
      return;
    }

    setShowConfirmId(listingId);
  };
  const onConfirm = async (listingId: string) => {
    gameService.send("FULFILL_TRADE_LISTING", {
      sellerId: farmId,
      listingId: listingId,
      listingType: makeListingType(listings[listingId].items),
    });

    onClose();
  };

  const Action = (listingId: string) => {
    if (listings[listingId].boughtAt) {
      return (
        <div className="flex items-center justify-end">
          <img src={SUNNYSIDE.icons.neutral} className="h-4 mr-1"></img>

          <span className="text-xs">{t("playerTrade.sold")}</span>
        </div>
      );
    }

    if (showConfirmId === listingId) {
      return (
        <Button onClick={() => onConfirm(listingId)}>
          <div className="flex items-center">
            <img src={SUNNYSIDE.icons.confirm} className="h-4 mr-1" />
            <span className="text-xs">{t("confirm")}</span>
          </div>
        </Button>
      );
    }

    const hasSFL = gameState.context.state.balance.gte(listings[listingId].sfl);
    const disabled = !hasSFL;

    return (
      <Button
        disabled={disabled}
        onClick={() => {
          confirm(listingId);
        }}
      >
        {t("buy")}
      </Button>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <p className="text-xs mb-1 ml-0.5">{t("playerTrade.sale")}</p>
        <Label type="info">{t("beta")}</Label>
      </div>
      {getKeys(listings)
        .filter((id) => {
          const listing = listings[id];

          return getKeys(listing.items).every(
            (name) =>
              ![
                "Bumpkin Emblem",
                "Goblin Emblem",
                "Nightshade Emblem",
                "Sunflorian Emblem",
              ].includes(name),
          );
        })
        .map((listingId, index) => {
          if (listingId.length < 38)
            return (
              <div className="p-2">
                <img src={SUNNYSIDE.icons.sad} className="mx-auto w-1/5 my-2" />
                <p className="text-sm mb-2 text-center">
                  {t("playerTrade.no.trade")}
                </p>
              </div>
            );

          return (
            <InnerPanel className="mb-2" key={index}>
              <div className="flex justify-between">
                <div className="flex flex-wrap">
                  {getKeys(listings[listingId].items).map((name) => (
                    <Box
                      image={ITEM_DETAILS[name].image}
                      count={new Decimal(listings[listingId].items[name] ?? 0)}
                      disabled
                      key={name}
                    />
                  ))}
                </div>
                <div className="w-28">
                  {Action(listingId)}

                  <div className="flex items-center mt-1  justify-end mr-0.5">
                    <p className="font-secondary">{`${listings[listingId].sfl} SFL`}</p>
                    <img src={token} className="h-6 ml-1" />
                  </div>
                </div>
              </div>
            </InnerPanel>
          );
        })}
    </div>
  );
};
