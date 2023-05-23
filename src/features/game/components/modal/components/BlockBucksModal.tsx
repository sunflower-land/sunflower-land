import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useEffect, useState } from "react";
import ticket from "assets/icons/block_buck_detailed.png";
import creditCard from "assets/icons/credit_card.png";
import matic from "assets/icons/polygon-token.png";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { analytics } from "lib/analytics";
import { hasFeatureAccess } from "lib/flags";
import { CONFIG } from "lib/config";
import { wallet } from "lib/blockchain/wallet";

interface Props {
  onClose: () => void;
}

const PRICES: {
  amount: number;
  usd: number;
}[] = [
  {
    amount: 1,
    usd: 0.25, // $0.25 each
  },
  {
    amount: 5,
    usd: 0.99, // $0.198 each
  },
  {
    amount: 10,
    usd: 1.75, // $0.175 each
  },
  {
    amount: 20,
    usd: 2.99, // $0.1495 each
  },
];

const pokoUrl =
  CONFIG.NETWORK === "mumbai"
    ? "https://dev.checkout.pokoapp.xyz/checkout"
    : "https://checkout.pokoapp.xyz/checkout";

const pokoNetwork =
  CONFIG.NETWORK === "mumbai" ? "polygonMumbaiRealUSDC" : "polygonRealUSDC";

export const BlockBucksModal: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showPoko, setShowPoko] = useState(false);
  const [price, setPrice] = useState<
    | {
        amount: number;
        usd: number;
      }
    | undefined
  >(undefined);

  const onMaticBuy = async (amount: number) => {
    if (
      hasFeatureAccess(gameState.context.state.inventory, "DIRECT_CHECKOUT")
    ) {
      gameService.send("BUY_BLOCK_BUCKS", {
        currency: "MATIC",
        amount,
      });
    } else {
      gameService.send("PURCHASE_ITEM", {
        name: "Block Buck",
        amount,
      });
    }

    onClose();
  };

  const onCreditCardBuy = () => {
    setShowPoko(true);
  };

  useEffect(() => {
    // Trigger an autosave in case they have changes so user can sync right away
    gameService.send("SAVE");

    analytics.logEvent("begin_checkout");
  }, []);

  const Content = () => {
    if (gameState.matches("autosaving")) {
      return (
        <div className="flex justify-center">
          <p className="loading text-center">Loading</p>
        </div>
      );
    }

    if (showPoko) {
      return (
        <iframe
          src={`${pokoUrl}?itemName=Block%20Bucks&itemImageURL=${ticket}&network=${pokoNetwork}&apiKey=${CONFIG.POKO_API_KEY}&listingId=${gameState.context.state.id}&type=nft&merchantCode=sunflowerland&receiverId=${wallet.myAccount}&extra=%7B%22farmId%22:${gameState.context.state.id},%22deadline%22:1686969119,%22amount%22:1,%22fee%22:%2210000%22,%22signature%22:%220x368f57ec8e063c4a9aeebe313a9462c24e284d8fcdc6bf1e72d60858df10ab060b8529d71c7e5752edad360911df4c537938aff4cbf104fa349504a055688b411b%22%7D`}
          height="650px"
          className="w-full"
          title="Poko widget"
          allow="accelerometer; autoplay; camera; gyroscope; payment"
        />
      );
    }

    if (price) {
      return (
        <>
          <div className="flex flex-col w-full items-center space-y-1 pb-2 px-2 text-sm">
            <div className="flex items-center">
              <p className="mr-2 mb-1">Item: {price.amount} x</p>
              <img
                src={ticket}
                style={{
                  height: `${PIXEL_SCALE * 13}px`,
                }}
              />
            </div>
            <p className="mr-2 mb-1">{`Total: ${price.usd} USD`}</p>
          </div>
          <div className="flex flex-grow items-stretch justify-around mx-3 space-x-5">
            <OuterPanel className="w-full flex flex-col items-center relative">
              <div className="flex w-full items-center justify-center py-4 px-2">
                <p className="mr-2 mb-1 text-xs">Credit / Debit Card</p>
                <img
                  src={creditCard}
                  style={{
                    height: `${PIXEL_SCALE * 13}px`,
                  }}
                />
              </div>
              <Button onClick={() => onCreditCardBuy()}>Pay with Card</Button>
            </OuterPanel>
            <OuterPanel className="w-full flex flex-col items-center relative">
              <div className="flex w-full h-full items-center justify-center py-4 px-2">
                <p className="mr-2 mb-1 text-xs">Matic</p>
                <img
                  src={matic}
                  style={{
                    height: `${PIXEL_SCALE * 13}px`,
                    imageRendering: "pixelated",
                  }}
                />
              </div>
              <Button onClick={() => onMaticBuy(price.amount)}>
                Pay with Matic
              </Button>
            </OuterPanel>
          </div>

          <p className="text-xs text-center pt-2">
            Game progress will be stored on Blockchain.
          </p>
          <p className="text-xxs italic text-center py-2">
            *Prices exclude Blockchain transaction fees.
          </p>
        </>
      );
    }

    return (
      <>
        <div className="flex flex-wrap">
          {PRICES.map((price) => (
            <div key={price.amount} className="w-1/2 p-1">
              <OuterPanel className="h-full flex flex-col items-center relative">
                <div className="flex w-full items-center justify-center py-2 px-2">
                  <p className="mr-2 mb-1">{`${price.amount} x`}</p>
                  <img
                    src={ticket}
                    style={{
                      width: `${PIXEL_SCALE * 19}px`,
                    }}
                  />
                </div>
                <Button
                  onClick={() => setPrice(price)}
                >{`$${price.usd} USD`}</Button>
              </OuterPanel>
            </div>
          ))}
        </div>

        <div className="flex flex-col">
          <p className="text-xxs italic text-center pt-2">
            *Prices exclude Blockchain transaction fees.
          </p>
          <a
            href="https://docs.sunflower-land.com/fundamentals/blockchain-fundamentals#block-bucks"
            className="mx-auto text-xxs underline text-center pb-2"
            target="_blank"
            rel="noreferrer"
          >
            Read more
          </a>
        </div>
      </>
    );
  };

  return (
    <CloseButtonPanel
      onClose={onClose}
      title="Buy Block Bucks"
      bumpkinParts={{
        body: "Light Brown Farmer Potion",
        hair: "White Long Hair",
        shirt: "Fancy Top",
        pants: "Fancy Pants",
        tool: "Farmer Pitchfork",
      }}
    >
      <Content />
    </CloseButtonPanel>
  );
};
