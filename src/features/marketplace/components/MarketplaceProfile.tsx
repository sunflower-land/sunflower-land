import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import React, { useContext } from "react";

import lock from "assets/icons/lock.png";
import trade from "assets/icons/trade.png";
import chest from "assets/icons/chest.png";

import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { getKeys } from "features/game/types/decorations";
import { getOfferItem, getTradeableDisplay } from "../lib/tradeables";
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

export const MarketplaceProfile: React.FC = () => {
  return (
    <div className="overflow-y-scroll scrollable pr-1">
      <MyListings />
      <MyOffers />
      <MyCollection />
    </div>
  );
};

const MyListings: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { trades } = gameState.context.state;
  const listings = trades.listings ?? {};

  const navigate = useNavigate();

  return (
    <InnerPanel className="mb-2">
      <div className="p-2">
        <Label className="mb-2" type="default" icon={trade}>
          My listings
        </Label>
        <div className="flex flex-wrap  gap-2">
          {getKeys(listings).length === 0 && (
            <p className="text-sm">You have not listed any items yet.</p>
          )}
          {getKeys(listings).map((id) => {
            const listing = listings[id];

            // TODO - more listed types. Only resources currently support
            const itemId = KNOWN_IDS[getKeys(listing.items ?? {})[0]];
            const details = getTradeableDisplay({
              id: itemId,
              type: "resources",
            });

            return (
              <ListViewCard
                name={details.name}
                hasBoost={!!details.buff}
                price={new Decimal(listing.sfl)}
                image={details.image}
                supply={0}
                type={details.type}
                id={itemId}
                key={id}
                onClick={() => {
                  navigate(`/marketplace/${details.type}/${itemId}`);
                }}
              />
            );
          })}
        </div>
      </div>
    </InnerPanel>
  );
};

const MyOffers: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { trades } = gameState.context.state;
  const offers = trades.offers ?? {};

  const navigate = useNavigate();

  const escrowedSFL = getKeys(offers).reduce(
    (total, id) => total + offers[id].sfl,
    0,
  );

  return (
    <InnerPanel className="mb-2">
      <div className="p-2">
        <div className="flex justify-between items-center">
          <Label className="mb-2" type="default" icon={trade}>
            My offers
          </Label>
          <Label className="mb-2" type="formula" icon={lock}>
            {`${escrowedSFL} SFL Locked`}
          </Label>
        </div>
        <div className="flex flex-wrap gap-2">
          {getKeys(offers).length === 0 && (
            <p className="text-sm">
              You have not made an offer for another item.
            </p>
          )}
          {getKeys(offers).map((id) => {
            const offer = offers[id];

            const itemId = getOfferItem({ offer });
            const details = getTradeableDisplay({
              id: itemId,
              type: offer.collection,
            });

            return (
              <ListViewCard
                name={details.name}
                hasBoost={!!details.buff}
                price={new Decimal(offer.sfl)}
                image={details.image}
                supply={0}
                type={details.type}
                id={itemId}
                key={id}
                onClick={() => {
                  navigate(`/marketplace/${details.type}/${itemId}`);
                }}
              />
            );
          })}
        </div>
      </div>
    </InnerPanel>
  );
};

type CollectionItem = {
  id: number;
  collection: CollectionName;
  count: number;
};
const MyCollection: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { buds } = gameState.context.state;

  const navigate = useNavigate();

  let items: CollectionItem[] = [];

  let inventory = getChestItems(gameState.context.state);
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

  return (
    <InnerPanel>
      <div className="p-2">
        <Label className="mb-2" type="default" icon={chest}>
          My collection
        </Label>

        <div className="flex flex-wrap gap-2">
          {getKeys(items).length === 0 && (
            <p className="text-sm">
              You do not have any available items in your collection.
            </p>
          )}
          {items.map((item) => {
            const details = getTradeableDisplay({
              id: item.id,
              type: item.collection,
            });

            return (
              <ListViewCard
                name={details.name}
                hasBoost={!!details.buff}
                image={details.image}
                supply={0}
                type={details.type}
                id={item.id}
                key={`${item.id}-${item.collection}`}
                onClick={() => {
                  navigate(`/marketplace/${details.type}/${item.id}`);
                }}
              />
            );
          })}
        </div>
      </div>
    </InnerPanel>
  );
};
