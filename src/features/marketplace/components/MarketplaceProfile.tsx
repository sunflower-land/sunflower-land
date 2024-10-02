import { Label } from "components/ui/Label";
import { InnerPanel, Panel } from "components/ui/Panel";
import React, { useContext, useState } from "react";

import lock from "assets/icons/lock.png";
import trade from "assets/icons/trade.png";
import chest from "assets/icons/chest.png";

import * as Auth from "features/auth/lib/Provider";

import { Context } from "features/game/GameProvider";
import { useActor, useSelector } from "@xstate/react";
import { getKeys } from "features/game/types/decorations";
import { getCollectionName, getTradeableDisplay } from "../lib/tradeables";
import { getOfferItem, getTradeType } from "../lib/offers";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { KNOWN_IDS } from "features/game/types";
import { ListViewCard } from "./ListViewCard";
import Decimal from "decimal.js-light";
import { useNavigate } from "react-router-dom";
import { CollectionName } from "features/game/types/marketplace";
import { TRADE_LIMITS } from "features/game/actions/tradeLimits";
import {
  BUMPKIN_WITHDRAWABLES,
  WITHDRAWABLES,
} from "features/game/types/withdrawables";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";
import { availableWardrobe } from "features/game/events/landExpansion/equip";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Modal } from "components/ui/Modal";
import { RemoveOffer } from "./RemoveOffer";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { NPC_WEARABLES } from "lib/npcs";
import { SUNNYSIDE } from "assets/sunnyside";
import { TextInput } from "components/ui/TextInput";
import { InventoryItemName } from "features/game/types/game";
import { AuthMachineState } from "features/auth/lib/authMachine";

export const MarketplaceProfile: React.FC = () => {
  return (
    <div className="overflow-y-scroll scrollable pr-1 h-full">
      <MyListings />
      <MyOffers />
      <MyCollection />
    </div>
  );
};

const MyListings: React.FC = () => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { trades } = gameState.context.state;
  const listings = trades.listings ?? {};

  const navigate = useNavigate();

  return (
    <InnerPanel className="mb-2">
      <div className="p-2">
        <Label className="mb-2" type="default" icon={trade}>
          {t("marketplace.myListings")}
        </Label>
        <div className="flex flex-wrap">
          {getKeys(listings).length === 0 && (
            <p className="text-sm">{t("marketplace.noMyListings")}</p>
          )}
          {getKeys(listings).map((id) => {
            const listing = listings[id];

            // TODO - more listed types. Only resources currently support
            const itemName = getKeys(
              listing.items ?? {},
            )[0] as InventoryItemName;
            const itemId = KNOWN_IDS[itemName];
            const collection = getCollectionName(itemName);
            const details = getTradeableDisplay({
              id: itemId,
              type: collection,
            });

            return (
              <div
                className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 pr-1 pb-1"
                key={id}
              >
                <ListViewCard
                  name={details.name}
                  hasBoost={!!details.buff}
                  price={new Decimal(listing.sfl)}
                  image={details.image}
                  supply={0}
                  type={details.type}
                  id={itemId}
                  onClick={() => {
                    navigate(`/marketplace/${details.type}/${itemId}`);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </InnerPanel>
  );
};

const _authToken = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

const MyOffers: React.FC = () => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const { authService } = useContext(Auth.Context);
  const [gameState] = useActor(gameService);

  const [claimId, setClaimId] = useState<string>();
  const [removeId, setRemoveId] = useState<string>();

  const authToken = useSelector(authService, _authToken);

  const { trades } = gameState.context.state;
  const offers = trades.offers ?? {};

  const navigate = useNavigate();

  const escrowedSFL = getKeys(offers).reduce(
    (total, id) => total + offers[id].sfl,
    0,
  );

  const claim = () => {
    const offer = offers[claimId as string];

    gameService.send("offer.claimed", {
      tradeId: claimId,
    });

    // For on chain items let's fire a refresh
    const itemId = getOfferItem({ offer });
    if (
      getTradeType({ collection: offer.collection, id: itemId }) === "onchain"
    ) {
      gameService.send("RESET");
    }

    setClaimId(undefined);
  };

  return (
    <>
      <Modal show={!!claimId} onHide={() => setClaimId(undefined)}>
        <Panel bumpkinParts={NPC_WEARABLES["hammerin harry"]}>
          <ClaimReward
            onClaim={claim}
            onClose={() => setClaimId(undefined)}
            reward={{
              createdAt: Date.now(),
              id: "offer-claimed",
              items:
                offers[claimId as string]?.collection === "collectibles"
                  ? offers[claimId as string].items
                  : {},
              wearables:
                offers[claimId as string]?.collection === "wearables"
                  ? offers[claimId as string].items
                  : {},
              sfl: 0,
              coins: 0,
              message: t("marketplace.offerClaimed"),
            }}
          />
        </Panel>
      </Modal>

      <Modal show={!!removeId} onHide={() => setRemoveId(undefined)}>
        <RemoveOffer
          authToken={authToken}
          id={removeId as string}
          offer={offers[removeId as string]}
          onClose={() => setRemoveId(undefined)}
        />
      </Modal>

      <InnerPanel className="mb-2">
        <div className="p-2">
          <div className="flex justify-between items-center">
            <Label className="mb-2" type="default" icon={trade}>
              {t("marketplace.myOffers")}
            </Label>
            <Label className="mb-2" type="formula" icon={lock}>
              {t("marketplace.sflEscrowed", { sfl: escrowedSFL })}
            </Label>
          </div>
          <div className="flex flex-wrap">
            {getKeys(offers).length === 0 && (
              <p className="text-sm">{t("marketplace.noMyOffers")}</p>
            )}
            {getKeys(offers).map((id) => {
              const offer = offers[id];

              const itemId = getOfferItem({ offer });
              const details = getTradeableDisplay({
                id: itemId,
                type: offer.collection,
              });

              return (
                <div
                  className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 pr-1 pb-1"
                  key={id}
                >
                  <ListViewCard
                    name={details.name}
                    hasBoost={!!details.buff}
                    price={new Decimal(offer.sfl)}
                    image={details.image}
                    supply={0}
                    type={details.type}
                    id={itemId}
                    isSold={!!offer.fulfilledAt}
                    onClick={
                      offer.fulfilledAt
                        ? () => setClaimId(id)
                        : () => {
                            navigate(`/marketplace/${details.type}/${itemId}`);
                          }
                    }
                    onRemove={
                      offer.fulfilledAt
                        ? undefined
                        : () => {
                            setRemoveId(id);
                          }
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InnerPanel>
    </>
  );
};

type CollectionItem = {
  id: number;
  collection: CollectionName;
  count: number;
};
const MyCollection: React.FC = () => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [search, setSearch] = useState("");
  const { buds } = gameState.context.state;

  const navigate = useNavigate();

  let items: CollectionItem[] = [];

  const inventory = getChestItems(gameState.context.state);
  getKeys(inventory).forEach((name) => {
    if (name in TRADE_LIMITS) {
      items.push({
        id: KNOWN_IDS[name],
        collection: "resources",
        count: inventory[name]?.toNumber() ?? 0,
      });
    }

    if (!(name in TRADE_LIMITS) && WITHDRAWABLES[name]()) {
      items.push({
        id: KNOWN_IDS[name],
        collection: "collectibles",
        count: inventory[name]?.toNumber() ?? 0,
      });
    }
  });

  const wardrobe = availableWardrobe(gameState.context.state);
  getKeys(wardrobe).forEach((name) => {
    if (BUMPKIN_WITHDRAWABLES[name]()) {
      items.push({
        id: ITEM_IDS[name],
        collection: "wearables",
        count: wardrobe[name] ?? 0,
      });
    }
  });

  getKeys(buds ?? {}).forEach((id) => {
    if (!buds?.[id].coordinates) {
      items.push({
        id,
        collection: "buds",
        count: 1,
      });
    }
  });

  items = items.filter((item) => {
    const details = getTradeableDisplay({
      id: item.id,
      type: item.collection,
    });

    return details.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <>
      <InnerPanel className="h-auto  w-full mb-1">
        <Label className="mb-2 ml-2" type="default" icon={chest}>
          {t("marketplace.myCollection")}
        </Label>
        <div className="flex items-center">
          <TextInput
            icon={SUNNYSIDE.icons.search}
            value={search}
            onValueChange={setSearch}
          />
        </div>
        <div className="p-2">
          <div className="flex flex-wrap">
            {getKeys(items).length === 0 && (
              <p className="text-sm">{t("marketplace.noCollection")}</p>
            )}
            {items.map((item) => {
              const details = getTradeableDisplay({
                id: item.id,
                type: item.collection,
              });

              return (
                <div
                  className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 pr-1 pb-1"
                  key={`${item.id}-${item.collection}`}
                >
                  <ListViewCard
                    name={details.name}
                    hasBoost={!!details.buff}
                    image={details.image}
                    supply={0}
                    type={details.type}
                    id={item.id}
                    onClick={() => {
                      navigate(`/marketplace/${details.type}/${item.id}`);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InnerPanel>
    </>
  );
};
