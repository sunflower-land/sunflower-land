import { Loading } from "features/auth/components";
import {
  Collection as ICollection,
  CollectionName,
} from "features/game/types/marketplace";
import React, { useContext, useEffect, useState } from "react";
import { loadCollection } from "../actions/loadCollection";
import * as Auth from "features/auth/lib/Provider";
import { useActor, useSelector } from "@xstate/react";
import { useNavigate } from "react-router-dom";
import { ListViewCard } from "./ListViewCard";
import Decimal from "decimal.js-light";
import { getTradeableDisplay } from "../lib/tradeables";
import { MarketplacePurpose } from "./MarketplaceHome";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { getListingCollection, getListingItem } from "../lib/listings";
import { Modal } from "components/ui/Modal";
import { RemoveListing } from "./RemoveListing";

const _listings = (state: MachineState) => state.context.state.trades.listings;
interface Props {
  type: CollectionName;
  search: string;
  purpose: MarketplacePurpose;
}

export const Collection: React.FC<Props> = ({ type, search, purpose }) => {
  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(Context);
  const [authState] = useActor(authService);

  const listings = useSelector(gameService, _listings);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [collection, setCollection] = useState<ICollection>();

  const [removeListingIds, setRemoveListingIds] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);

      const data = await loadCollection({
        type,
        token: authState.context.user.rawToken as string,
      });

      setCollection(data);
      setIsLoading(false);
    };

    load();
  }, [type]);

  if (isLoading) {
    return <Loading />;
  }

  const items =
    collection?.items.filter((item) => {
      const display = getTradeableDisplay({ type, id: item.id });

      if (purpose === "boost" && !display.buff) return false;
      if (purpose === "decoration" && display.buff) return false;

      return display.name.toLowerCase().includes(search.toLocaleLowerCase());
    }) ?? [];

  return (
    <div className="flex flex-wrap w-full">
      <Modal
        show={removeListingIds.length > 0}
        onHide={() => setRemoveListingIds([])}
      >
        <RemoveListing
          collection={type}
          listingIds={removeListingIds ?? []}
          authToken={authState.context.user.rawToken as string}
          onClose={() => setRemoveListingIds([])}
        />
      </Modal>

      {items.map((item) => {
        const display = getTradeableDisplay({ type, id: item.id });

        const listingIds = Object.keys(listings ?? {}).filter((listingId) => {
          const listing = listings?.[listingId];
          if (!listing) return false;

          const listingItem = getListingItem({ listing });
          const listingCollection = getListingCollection({ listing });

          return listingCollection === type && listingItem === item.id;
        });

        return (
          <div
            className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 pr-1 pb-1"
            key={item.id}
          >
            <ListViewCard
              name={display.name}
              hasBoost={!!display.buff}
              price={new Decimal(item.floor)}
              image={display.image}
              supply={item.supply}
              type={type}
              id={item.id}
              onClick={() => {
                navigate(`/marketplace/${type}/${item.id}`);
              }}
              onRemove={
                listingIds.length > 0
                  ? () => setRemoveListingIds(listingIds)
                  : undefined
              }
            />
          </div>
        );
      })}
    </div>
  );
};
