import React, { useContext, useState } from "react";
import { waitFor } from "xstate/lib/waitFor.js";

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

import walletIcon from "assets/icons/wallet.png";
import sflIcon from "assets/icons/sfl.webp";
import tradeIcon from "assets/icons/trade.png";
import lockIcon from "assets/icons/lock.png";
import increaseArrow from "assets/icons/increase_arrow.png";
import bg from "assets/ui/3x3_bg.png";

import { TradeTable } from "./TradeTable";
import { Loading } from "features/auth/components";
import { Modal } from "components/ui/Modal";
import { NumberInput } from "components/ui/NumberInput";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { GameWallet } from "features/wallet/Wallet";
import { getOfferItem, TradeableDisplay } from "../lib/tradeables";
import confetti from "canvas-confetti";
import { signTypedData } from "@wagmi/core";
import { config } from "features/wallet/WalletProvider";
import { getKeys } from "features/game/types/decorations";
import { RemoveOffer } from "./RemoveOffer";
import { TradeOffer } from "features/game/types/game";
import {
  getChestBuds,
  getChestItems,
} from "features/island/hud/components/inventory/utils/inventory";
import { KNOWN_IDS, KNOWN_ITEMS } from "features/game/types";
import { ITEM_NAMES } from "features/game/types/bumpkin";
import { availableWardrobe } from "features/game/events/landExpansion/equip";

// TODO - move make offer here, signing state + submitting state
export const TradeableSummary: React.FC<{
  display: TradeableDisplay;
  sfl: number;
}> = ({ display, sfl }) => {
  return (
    <div className="flex">
      <div className="h-12 w-12 mr-2 relative">
        <img src={bg} className="w-full rounded-sm" />
        <img
          src={display.image}
          className="w-1/2 absolute"
          style={{
            left: "50%",
            transform: "translate(-50%, 50%)",
            bottom: "50%",
          }}
        />
      </div>
      <div>
        <span className="text-sm">{`1 x ${display.name}`}</span>
        <div className="flex items-center">
          <span className="text-sm">{`${sfl} SFL`}</span>
          <img src={sflIcon} className="h-6 ml-1" />
        </div>
      </div>
    </div>
  );
};

const MakeOffer: React.FC<{
  onClose: () => void;
  tradeable?: TradeableDetails;
  display: TradeableDisplay;
  id: number;
  onOfferMade: () => void;
}> = ({ onClose, tradeable, display, id, onOfferMade }) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { balance } = gameState.context.state;

  const [offer, setOffer] = useState(0);
  const [isSigning, setIsSigning] = useState(false);
  const [isOffering, setIsOffering] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const sign = async () => {
    const signature = await signTypedData(config, {
      primaryType: "Offer",
      types: {
        Offer: [
          { name: "item", type: "string" },
          { name: "collection", type: "string" },
          { name: "quantity", type: "uint256" },
          { name: "SFL", type: "uint256" },
        ],
      },
      message: {
        item: display.name,
        quantity: BigInt(1),
        SFL: BigInt(offer),
        collection: display.type,
      },
      domain: {
        name: "Sunflower Land",
      },
    });

    confirm({ signature });

    setIsSigning(false);
  };

  const submitOffer = () => {
    if (tradeable?.type === "onchain") {
      setIsSigning(true);
      return;
    }

    setShowConfirmation(true);
  };

  const confirm = async ({ signature }: { signature?: string }) => {
    setIsOffering(true);

    // Show confirmation modal

    // Await async action

    // Show error modal
    // Show success

    try {
      gameService.send("POST_EFFECT", {
        effect: {
          type: "marketplace.offerMade",
          id,
          collection: display.type,
          signature,
          sfl: offer,
        },
      });

      await waitFor(
        gameService,
        (state) => {
          if (state.matches("error")) throw new Error("Insert failed");
          return state.matches("playing");
        },
        { timeout: 60 * 1000 },
      );
    } finally {
      setIsOffering(false);
    }

    confetti();
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <>
        <div className="p-2">
          <Label type="success" className="mb-2">
            {t("success")}
          </Label>
          <p className="text-sm mb-2">{t("marketplace.offerSuccess")}</p>
        </div>
        <Button
          onClick={() => {
            onOfferMade();
          }}
        >
          {t("continue")}
        </Button>
      </>
    );
  }

  if (isOffering) {
    return <Loading />;
  }

  if (showConfirmation) {
    return (
      <>
        <div className="p-2">
          <Label type="danger" className="-ml-1 mb-2">
            {t("are.you.sure")}
          </Label>
          <p className="text-xs mb-2">{t("marketplace.confirmDetails")}</p>
          <TradeableSummary display={display} sfl={offer} />
        </div>

        <div className="flex">
          <Button onClick={() => setShowConfirmation(false)} className="mr-1">
            {t("cancel")}
          </Button>
          <Button onClick={() => confirm({})}>{t("confirm")}</Button>
        </div>
      </>
    );
  }

  if (isSigning) {
    return (
      <GameWallet action="marketplace">
        <>
          <div className="p-2">
            <Label type="danger" className="-ml-1 mb-2">
              {t("are.you.sure")}
            </Label>
            <p className="text-xs mb-2">{t("marketplace.signOffer")}</p>
            <TradeableSummary display={display} sfl={offer} />
          </div>

          <div className="flex">
            <Button onClick={() => setIsSigning(false)} className="mr-1">
              {t("cancel")}
            </Button>
            <Button onClick={sign}>{t("marketplace.signAndOffer")}</Button>
          </div>
        </>
      </GameWallet>
    );
  }

  /* TODO only use game wallet when required */
  return (
    <>
      <div className="p-2">
        <div className="flex justify-between">
          <Label type="default" className="-ml-1">
            {t("marketplace.makeOffer")}
          </Label>
          {tradeable?.type === "onchain" && (
            <Label type="formula" icon={walletIcon} className="-mr-1">
              {t("marketplace.walletRequired")}
            </Label>
          )}
        </div>
        <p className="text-sm">{t("marketplace.howMuch")}</p>
        <div className="my-2 -mx-2">
          <NumberInput
            value={offer}
            onValueChange={(decimal) => setOffer(decimal.toNumber())}
            maxDecimalPlaces={2}
            isOutOfRange={balance.lt(offer)}
            icon={sflIcon}
          />
        </div>

        <Label type="default" className="-ml-1 mb-1" icon={lockIcon}>
          {t("marketplace.sflLocked")}
        </Label>
        <p className="text-xs mb-2">{t("marketplace.sflLocked.description")}</p>
      </div>

      <div className="flex">
        <Button className="mr-1" onClick={() => onClose()}>
          {t("cancel")}
        </Button>
        <Button
          disabled={!offer || balance.lt(offer)}
          onClick={submitOffer}
          className="relative"
        >
          <span>{t("confirm")}</span>
          {tradeable?.type === "onchain" && (
            <img src={walletIcon} className="absolute right-1 top-0.5 h-7" />
          )}
        </Button>
      </div>
    </>
  );
};

const AcceptOffer: React.FC<{
  onClose: () => void;
  tradeable?: TradeableDetails;
  display: TradeableDisplay;
  offer: Offer;
  id: number;
  onOfferAccepted: () => void;
}> = ({ onClose, tradeable, display, id, offer, onOfferAccepted }) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [isAccepting, setIsAccepting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const confirm = async () => {
    setIsAccepting(true);

    if (tradeable?.type === "instant") {
      try {
        gameService.send("POST_EFFECT", {
          effect: {
            type: "marketplace.offerAccepted",
            id: offer.tradeId,
          },
        });

        await waitFor(
          gameService,
          (state) => {
            if (state.matches("error")) throw new Error("Insert failed");
            return state.matches("playing");
          },
          { timeout: 60 * 1000 },
        );

        confetti();
        setShowSuccess(true);
      } finally {
        setIsAccepting(false);
      }
    }

    // On chain offer
    console.log("Accept on chain");
  };

  if (showSuccess) {
    return (
      <>
        <div className="p-2">
          <Label type="success" className="mb-2">
            {t("success")}
          </Label>
          <p className="text-sm mb-2">{t("marketplace.offerSuccess")}</p>
        </div>
        <Button
          onClick={() => {
            onOfferAccepted();
          }}
        >
          {t("continue")}
        </Button>
      </>
    );
  }

  if (isAccepting) {
    return <Loading />;
  }

  const game = gameState.context.state;

  let hasItem = false;

  if (display.type === "collectibles") {
    const name = KNOWN_ITEMS[tradeable?.id as number];
    hasItem = !!getChestItems(game)[name]?.gte(1);
  }

  if (display.type === "wearables") {
    const name = ITEM_NAMES[tradeable?.id as number];
    hasItem = !!availableWardrobe(game)[name];
  }

  if (display.type === "buds") {
    hasItem = !!getChestBuds(game)[tradeable?.id as number];
  }

  return (
    <>
      <div className="p-2">
        <div className="flex justify-between mb-2">
          <Label type="default" className="-ml-1">
            {t("marketplace.acceptOffer")}
          </Label>
          {tradeable?.type === "onchain" && (
            <Label type="formula" icon={walletIcon} className="-mr-1">
              {t("marketplace.walletRequired")}
            </Label>
          )}
        </div>
        <TradeableSummary display={display} sfl={offer.sfl} />
      </div>

      {!hasItem && (
        <Label
          type="danger"
          className="my-2"
        >{`You do not have ${display.name}`}</Label>
      )}

      <div className="flex">
        <Button className="mr-1" onClick={() => onClose()}>
          {t("cancel")}
        </Button>
        <Button
          disabled={!hasItem}
          onClick={() => confirm()}
          className="relative"
        >
          <span>{t("confirm")}</span>
          {tradeable?.type === "onchain" && (
            <img src={walletIcon} className="absolute right-1 top-0.5 h-7" />
          )}
        </Button>
      </div>
    </>
  );
};

export const TradeableOffers: React.FC<{
  tradeable?: TradeableDetails;
  farmId: number;
  display: TradeableDisplay;
  id: number;
  onOfferMade: () => void;
}> = ({ tradeable, farmId, display, id, onOfferMade }) => {
  const { gameService } = useContext(Context);

  const { t } = useAppTranslation();

  const [showMakeOffer, setShowMakeOffer] = useState(false);
  const [acceptOffer, setAcceptOffer] = useState<Offer>();

  const topOffer = tradeable?.offers.reduce((highest, listing) => {
    return listing.sfl > highest.sfl ? listing : highest;
  }, tradeable?.offers?.[0]);

  return (
    <>
      <Modal show={showMakeOffer} onHide={() => setShowMakeOffer(false)}>
        <Panel>
          <MakeOffer
            id={id}
            tradeable={tradeable}
            display={display}
            onClose={() => setShowMakeOffer(false)}
            onOfferMade={() => {
              setShowMakeOffer(false);
              onOfferMade();
            }}
          />
        </Panel>
      </Modal>
      <Modal show={!!acceptOffer} onHide={() => setAcceptOffer(undefined)}>
        <Panel>
          <AcceptOffer
            id={id}
            tradeable={tradeable}
            display={display}
            offer={acceptOffer as Offer}
            onClose={() => setAcceptOffer(undefined)}
            onOfferAccepted={() => {
              setAcceptOffer(undefined);
              onOfferMade();
            }}
          />
        </Panel>
      </Modal>
      {topOffer && (
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
                onClick={() => setAcceptOffer(topOffer)}
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
            {!tradeable && <Loading />}
            {tradeable?.offers.length === 0 && (
              <p className="text-sm">{t("marketplace.noOffers")}</p>
            )}
            {!!tradeable?.offers.length && (
              <TradeTable
                items={tradeable.offers.map((offer) => ({
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
            )}
          </div>
          <div className="w-full justify-end flex">
            <Button
              className="w-full sm:w-fit"
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

export const YourOffer: React.FC<{
  onOfferRemoved: () => void;
  collection: CollectionName;
  id: number;
}> = ({ onOfferRemoved, collection, id }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [showRemove, setShowRemove] = useState(false);
  const { t } = useAppTranslation();

  const { trades } = gameState.context.state;
  const offers = trades.offers ?? {};

  const offerIds = getKeys(offers).filter((offerId) => {
    const offer = offers[offerId];
    const itemId = getOfferItem({ offer });

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

  return (
    <>
      <Modal show={!!showRemove} onHide={() => setShowRemove(false)}>
        <RemoveOffer
          id={myOfferId as string}
          offer={offer}
          onClose={() => setShowRemove(false)}
          onDone={() => {
            onOfferRemoved();
            setShowRemove(false);
          }}
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
