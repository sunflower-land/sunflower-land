import { Loading } from "features/auth/components";
import {
  CollectionName,
  Tradeable as ITradeable,
  TradeableDetails,
} from "features/game/types/marketplace";
import React, { useContext, useEffect, useState } from "react";
import * as Auth from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";
import { useNavigate, useParams } from "react-router-dom";
import { loadTradeable } from "../actions/loadTradeable";
import { InnerPanel } from "components/ui/Panel";
import { getTradeableDisplay, TradeableDisplay } from "../lib/tradeables";

import bg from "assets/ui/3x3_bg.png";
import walletIcon from "assets/icons/wallet.png";
import sflIcon from "assets/icons/sfl.webp";
import tradeIcon from "assets/icons/trade.png";
import increaseArrow from "assets/icons/increase_arrow.png";

import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { PriceHistory } from "./PriceHistory";
import { TradeTable } from "./TradeTable";

export const Tradeable: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  const farmId = 1; // TODO

  // const { gameService } = useContext(Context);
  // const [gameState] = useActor(gameService);
  // const {
  //   context: { state },
  // } = gameState;

  const { collection, id } = useParams<{
    collection: CollectionName;
    id: string;
  }>();
  const navigate = useNavigate();

  const [tradeable, setTradeable] = useState<TradeableDetails | null>();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await loadTradeable({
          type: collection as CollectionName,
          id: Number(id),
          token: authState.context.user.rawToken as string,
        });

        setTradeable(data);
      } catch {
        setTradeable(null);
      }
    };

    load();
  }, []);

  // TODO 404 view
  if (tradeable === null) {
    return <p>{`404`}</p>;
  }

  const onBack = () => {
    navigate(`/marketplace/${collection}`);
  };
  const display = getTradeableDisplay({
    type: collection as CollectionName,
    id: Number(id),
  });

  return (
    <div className="flex sm:flex-row flex-col w-full scrollable overflow-y-auto h-full overflow-x-none pr-1 pb-8">
      <div className="flex flex-col w-full sm:w-1/3 mr-1 mb-1">
        <div className="block sm:hidden">
          <TradeableHeader
            collection={collection as CollectionName}
            onBack={onBack}
            display={display}
            tradeable={tradeable}
          />
        </div>

        <TradeableInfo display={display} tradeable={tradeable} />
      </div>
      <div className="w-full">
        <div className="hidden sm:block">
          <TradeableHeader
            collection={collection as CollectionName}
            onBack={onBack}
            display={display}
            tradeable={tradeable}
          />
        </div>

        <PriceHistory />

        <Listings tradeable={tradeable} farmId={farmId} />

        <Offers tradeable={tradeable} farmId={farmId} />
      </div>
    </div>
  );
};

const TradeableHeader: React.FC<{
  collection: CollectionName;
  onBack: () => void;
  display: TradeableDisplay;
  tradeable?: TradeableDetails;
}> = ({ collection, onBack, display, tradeable }) => {
  let cheapestListing = tradeable?.listings.reduce((cheapest, listing) => {
    return listing.sfl < cheapest.sfl ? listing : cheapest;
  }, tradeable?.listings?.[0]);

  return (
    <InnerPanel className="w-full mb-1">
      <div className="p-2">
        <div className="flex flex-wrap items-center justify-between">
          <div
            className="flex cursor-pointer items-center w-fit mb-2"
            onClick={onBack}
          >
            <img src={SUNNYSIDE.icons.arrow_left} className="h-6 mr-2" />
            <p className="capitalize underline">{collection}</p>
          </div>
          <div className="flex items-center">
            {tradeable?.type === "onchain" && (
              <Label type="formula" className="mr-2" icon={walletIcon}>
                Wallet Required
              </Label>
            )}

            <Label type="default">{`You own: ?`}</Label>
          </div>
        </div>
        <div className="flex">
          <p className="text-lg mr-0.5">{display.name}</p>
        </div>
        <div className="flex items-center justify-between flex-wrap">
          {cheapestListing && (
            <div className="flex items-center mr-2 mb-0.5 -ml-1">
              <>
                <img src={sflIcon} className="h-8 mr-2" />
                <p className="text-base">{`${cheapestListing.sfl} SFL`}</p>
              </>
            </div>
          )}
          <div className="flex items-center justify-end w-full sm:w-auto">
            {cheapestListing && (
              <Button className="mr-1 w-auto">Buy now</Button>
            )}
            <Button disabled className="w-auto">
              List for sale
            </Button>
          </div>
        </div>
      </div>
    </InnerPanel>
  );
};
const TradeableInfo: React.FC<{
  display: TradeableDisplay;
  tradeable?: TradeableDetails;
}> = ({ display, tradeable }) => {
  return (
    <>
      <InnerPanel className="w-full flex relative mb-1">
        {tradeable && (
          <Label
            className="absolute top-2 right-2"
            type="default"
          >{`Supply: ${tradeable.supply}`}</Label>
        )}

        <img src={bg} className="w-full rounded-sm" />
        <img
          src={display.image}
          className="w-1/3 absolute"
          style={{
            left: "50%",
            transform: "translate(-50%, 50%)",
            bottom: "50%",
          }}
        />
      </InnerPanel>
      <InnerPanel>
        <div className="p-2">
          <Label type="default" className="mb-1" icon={SUNNYSIDE.icons.search}>
            Description
          </Label>
          <p className="text-sm mb-2">{display.description}</p>
          {display.buff && (
            <Label
              icon={display.buff.boostTypeIcon}
              type={display.buff.labelType}
              className="mb-2"
            >
              {display.buff.shortDescription}
            </Label>
          )}
        </div>
      </InnerPanel>
    </>
  );
};

const Listings: React.FC<{
  tradeable?: TradeableDetails;
  farmId: number;
}> = ({ tradeable, farmId }) => {
  return (
    <InnerPanel className="mb-1">
      <div className="p-2">
        <Label icon={tradeIcon} type="default" className="mb-2">
          Listings
        </Label>
        <div className="mb-2">
          {!tradeable && <Loading />}
          {tradeable?.listings.length === 0 && (
            <p className="text-sm">No listings available.</p>
          )}
          {!!tradeable?.listings.length && (
            <TradeTable
              items={tradeable.listings.map((listing) => ({
                price: listing.sfl,
                expiresAt: "30 days", // TODO,
                createdById: listing.listedById,
              }))}
              id={farmId}
            />
          )}
        </div>
        <div className="w-full justify-end flex">
          <Button className="w-full sm:w-fit">List for sale</Button>
        </div>
      </div>
    </InnerPanel>
  );
};

const Offers: React.FC<{
  tradeable?: TradeableDetails;
  farmId: number;
}> = ({ tradeable, farmId }) => {
  let topOffer = tradeable?.offers.reduce((highest, listing) => {
    return listing.sfl > highest.sfl ? listing : highest;
  }, tradeable?.offers?.[0]);

  return (
    <>
      {topOffer && (
        <InnerPanel className="mb-1">
          <div className="p-2">
            <div className="flex justify-between mb-2">
              <Label type="default" icon={increaseArrow}>
                Top Offer
              </Label>
              <Label
                type="chill"
                icon={SUNNYSIDE.icons.player}
              >{`#${topOffer.offeredById}`}</Label>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src={sflIcon} className="h-8 mr-2" />
                <p className="text-base">{`${topOffer.sfl} SFL`}</p>
              </div>
              <Button className="w-fit">Accept Offer</Button>
            </div>
          </div>
        </InnerPanel>
      )}

      <InnerPanel className="mb-1">
        <div className="p-2">
          <Label icon={tradeIcon} type="default" className="mb-2">
            Offers
          </Label>
          <div className="mb-2">
            {!tradeable && <Loading />}
            {tradeable?.listings.length === 0 && (
              <p className="text-sm">No offers available.</p>
            )}
            {!!tradeable?.listings.length && (
              <TradeTable
                items={tradeable.offers.map((listing) => ({
                  price: listing.sfl,
                  expiresAt: "30 days", // TODO,
                  createdById: listing.offeredById,
                }))}
                id={farmId}
              />
            )}
          </div>
          <div className="w-full justify-end flex">
            <Button className="w-full sm:w-fit">Make an offer</Button>
          </div>
        </div>
      </InnerPanel>
    </>
  );
};
