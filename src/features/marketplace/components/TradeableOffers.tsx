import React, { useContext, useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel, Panel } from "components/ui/Panel";
import {
  CollectionName,
  Offer,
  TradeableDetails,
} from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import sflIcon from "assets/icons/sfl.webp";
import tradeIcon from "assets/icons/trade.png";
import increaseArrow from "assets/icons/increase_arrow.png";

import { TradeTable } from "./TradeTable";
import { Loading } from "features/auth/components";
import { Modal } from "components/ui/Modal";
import { useSelector } from "@xstate/react";
import { TradeableDisplay } from "../lib/tradeables";
import { getItemId } from "../lib/offers";
import { getKeys } from "features/game/types/decorations";
import { RemoveOffer } from "./RemoveOffer";
import {
  BlockchainEvent,
  Context as ContextType,
  MachineState,
} from "features/game/lib/gameMachine";
import { useOnMachineTransition } from "lib/utils/hooks/useOnMachineTransition";
import { Context } from "features/game/GameProvider";
import { MakeOffer } from "./MakeOffer";
import * as Auth from "features/auth/lib/Provider";
import { AcceptOffer } from "./AcceptOffer";
import { AuthMachineState } from "features/auth/lib/authMachine";
import confetti from "canvas-confetti";
import { useParams } from "react-router-dom";
import { ResourceTable } from "./ResourceTable";
import { formatNumber } from "lib/utils/formatNumber";
import { getBasketItems } from "features/island/hud/components/inventory/utils/inventory";
import { KNOWN_ITEMS } from "features/game/types";

// JWT TOKEN

const _hasPendingOfferEffect = (state: MachineState) =>
  state.matches("marketplaceOffering") || state.matches("marketplaceAccepting");
const _authToken = (state: AuthMachineState) =>
  state.context.user.rawToken as string;
const _balance = (state: MachineState) => state.context.state.balance;
const _inventory = (state: MachineState) => state.context.state.inventory;
export const TradeableOffers: React.FC<{
  tradeable?: TradeableDetails;
  farmId: number;
  display: TradeableDisplay;
  itemId: number;
  reload: () => void;
}> = ({ tradeable, farmId, display, itemId, reload }) => {
  const { authService } = useContext(Auth.Context);
  const { gameService, showAnimations } = useContext(Context);
  const { t } = useAppTranslation();
  const params = useParams();

  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplaceOfferingSuccess",
    "playing",
    reload,
  );

  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplaceOffering",
    "marketplaceOfferingSuccess",
    confetti,
  );

  const hasPendingOfferEffect = useSelector(
    gameService,
    _hasPendingOfferEffect,
  );
  const authToken = useSelector(authService, _authToken);
  const balance = useSelector(gameService, _balance);
  const inventory = useSelector(gameService, _inventory);
  const [showMakeOffer, setShowMakeOffer] = useState(false);
  const [showAcceptOffer, setShowAcceptOffer] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer>();

  const topOffer = tradeable?.offers.reduce((highest, offer) => {
    return offer.sfl > highest.sfl ? offer : highest;
  }, tradeable?.offers[0]);

  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplaceOfferCancellingSuccess",
    "playing",
    () => {
      reload();
      if (showAnimations) confetti();
    },
  );

  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplaceAcceptingSuccess",
    "playing",
    reload,
  );

  const handleHide = () => {
    if (hasPendingOfferEffect) return;

    setShowMakeOffer(false);
  };

  const handleSelectOffer = (id: string) => {
    const selectedOffer = tradeable?.offers.find(
      (offer) => offer.tradeId === id,
    ) as Offer;

    setSelectedOffer(selectedOffer);
    setShowAcceptOffer(true);
  };

  const isResource = params.collection === "resources";
  const loading = !tradeable;

  return (
    <>
      <Modal show={showMakeOffer} onHide={handleHide}>
        <Panel>
          <MakeOffer
            itemId={itemId}
            authToken={authToken}
            display={display}
            floorPrice={tradeable?.floor ?? 0}
            onClose={() => setShowMakeOffer(false)}
          />
        </Panel>
      </Modal>
      <Modal show={showAcceptOffer} onHide={handleHide}>
        <Panel>
          <AcceptOffer
            authToken={authToken}
            itemId={itemId}
            display={display}
            offer={(isResource ? selectedOffer : topOffer) as Offer}
            onClose={() => setShowAcceptOffer(false)}
            onOfferAccepted={reload}
          />
        </Panel>
      </Modal>
      {topOffer && !isResource && (
        <InnerPanel className="mb-1">
          <div className="p-2">
            <div className="flex justify-between mb-2">
              <Label type="default" icon={increaseArrow}>
                {t("marketplace.topOffer")}
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
              <Button
                onClick={() => setShowAcceptOffer(true)}
                className="w-fit"
              >
                {t("marketplace.acceptOffer")}
              </Button>
            </div>
          </div>
        </InnerPanel>
      )}

      <InnerPanel className="mb-1">
        <div className="p-2">
          <Label icon={tradeIcon} type="default" className="mb-2">
            {t("marketplace.offers")}
          </Label>
          <div className="mb-2">
            {loading && <Loading />}
            {!loading && tradeable?.offers.length === 0 && (
              <p className="text-sm">{t("marketplace.noOffers")}</p>
            )}
            {!!tradeable?.offers.length &&
              (isResource ? (
                <ResourceTable
                  balance={balance}
                  items={tradeable?.offers.map((offer) => ({
                    id: offer.tradeId,
                    price: offer.sfl,
                    quantity: offer.quantity,
                    pricePerUnit: Number(
                      formatNumber(offer.sfl / offer.quantity, {
                        decimalPlaces: 4,
                      }),
                    ),
                    createdById: offer.offeredById,
                  }))}
                  inventoryCount={
                    getBasketItems(inventory)[
                      KNOWN_ITEMS[itemId]
                    ]?.toNumber() ?? 0
                  }
                  id={farmId}
                  tableType="offers"
                  onClick={(offerId) => {
                    handleSelectOffer(offerId);
                    setShowAcceptOffer(true);
                  }}
                />
              ) : (
                <TradeTable
                  items={tradeable?.offers.map((offer) => ({
                    price: offer.sfl,
                    expiresAt: "30 days", // TODO,
                    createdById: offer.offeredById,
                    icon:
                      offer.offeredById === farmId
                        ? SUNNYSIDE.icons.player
                        : undefined,
                  }))}
                  id={farmId}
                />
              ))}
          </div>
          <div className="w-full justify-end flex">
            <Button
              className="w-full sm:w-fit"
              disabled={!tradeable}
              onClick={() => setShowMakeOffer(true)}
            >
              {t("marketplace.makeOffer")}
            </Button>
          </div>
        </div>
      </InnerPanel>
    </>
  );
};

const _isCancellingOffer = (state: MachineState) =>
  state.matches("marketplaceCancelling");
const _trades = (state: MachineState) => state.context.state.trades;

export const YourOffer: React.FC<{
  onOfferRemoved: () => void;
  collection: CollectionName;
  id: number;
}> = ({ onOfferRemoved, collection, id }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const { authService } = useContext(Auth.Context);

  const isCancellingOffer = useSelector(gameService, _isCancellingOffer);
  const trades = useSelector(gameService, _trades);
  const authToken = useSelector(authService, _authToken);

  const [showRemove, setShowRemove] = useState(false);

  useOnMachineTransition<ContextType, BlockchainEvent>(
    gameService,
    "marketplaceCancellingSuccess",
    "playing",
    onOfferRemoved,
  );

  const offers = trades.offers ?? {};

  const offerIds = getKeys(offers).filter((offerId) => {
    const offer = offers[offerId];
    const itemId = getItemId({ details: offer });

    if (offer.fulfilledAt) return false;

    // Make sure the offer is for this item
    return offer.collection === collection && itemId === id;
  });

  // Get their highest offer for the current item
  const myOfferId = offerIds.reduce((highest, offerId) => {
    const offer = offers[offerId];
    return offer.sfl > offers[highest].sfl ? offerId : highest;
  }, offerIds[0]);

  if (!myOfferId) return null;

  const offer = offers[myOfferId];

  const handleHide = () => {
    if (isCancellingOffer) return;

    setShowRemove(false);
  };

  return (
    <>
      <Modal show={!!showRemove} onHide={handleHide}>
        <RemoveOffer
          id={myOfferId as string}
          offer={offer}
          authToken={authToken}
          onClose={() => setShowRemove(false)}
        />
      </Modal>
      <InnerPanel className="mb-1">
        <div className="p-2">
          <div className="flex justify-between mb-2">
            <Label type="info" icon={increaseArrow}>
              {t("marketplace.yourOffer")}
            </Label>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src={sflIcon} className="h-8 mr-2" />
              <p className="text-base">{`${offer.sfl} SFL`}</p>
            </div>
            <Button className="w-fit" onClick={() => setShowRemove(true)}>
              {t("marketplace.cancelOffer")}
            </Button>
          </div>
        </div>
      </InnerPanel>
    </>
  );
};
