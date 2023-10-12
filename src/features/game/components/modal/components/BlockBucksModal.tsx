import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useEffect, useState } from "react";
import ticket from "assets/icons/block_buck_detailed.png?inline";
import creditCard from "assets/icons/credit_card.png";
import matic from "assets/icons/polygon-token.png";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { analytics } from "lib/analytics";
import { buyBlockBucksXsolla } from "features/game/actions/buyBlockBucks";
import * as AuthProvider from "features/auth/lib/Provider";
import { randomID } from "lib/utils/random";
import { Label } from "components/ui/Label";

interface Props {
  closeable: boolean;
  setCloseable: (closeable: boolean) => void;
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
  {
    amount: 100,
    usd: 14.5, // $0.145 each
  },
  {
    amount: 500,
    usd: 65, // $0.13 each
  },
  {
    amount: 1000,
    usd: 125, // $0.125 each
  },
  {
    amount: 10000,
    usd: 1000, // $0.10 each
  },
];

interface PokoConfig {
  url: string;
  network: string;
  marketplaceCode: string;
  itemName: string;
  itemImageURL: string;
  listingId: number;
  apiKey: string;
  extra: string;
  receiverId: string;
}

interface Price {
  amount: number;
  usd: number;
}

const XsollaIFrame: React.FC<{ url: string }> = ({ url }) => {
  return (
    <iframe
      src={url}
      title="Xsolla Checkout"
      className="w-full h-[85vh] sm:h-[65vh]"
    />
  );
};
export const BlockBucksModal: React.FC<Props> = ({
  closeable,
  onClose,
  setCloseable,
}) => {
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showXsolla, setShowXsolla] = useState<string>();
  const [loading, setLoading] = useState(false);

  const [price, setPrice] = useState<Price>();

  const onMaticBuy = async (amount: number) => {
    gameService.send("BUY_BLOCK_BUCKS", {
      currency: "MATIC",
      amount,
    });
    onClose();
  };

  const onCreditCardBuy = async () => {
    setLoading(true);
    try {
      const amount = price?.amount ?? 0;

      const { url } = await buyBlockBucksXsolla({
        amount,
        farmId: gameState.context.state.id as number,
        transactionId: randomID(),
        type: "USDC",
        token: authState.context.user.rawToken as string,
      });

      setShowXsolla(url);
    } finally {
      setLoading(false);
    }
  };

  const onCreditCardSuccess = () => {
    setCloseable(true);
    gameService.send("UPDATE_BLOCK_BUCKS", { amount: price?.amount });
  };

  const onCreditCardProcessing = () => {
    setCloseable(false);
  };

  useEffect(() => {
    // Trigger an autosave in case they have changes so user can sync right away
    gameService.send("SAVE");

    analytics.logEvent("begin_checkout");
  }, []);

  const Content = () => {
    if (gameState.matches("autosaving") || loading) {
      return (
        <div className="flex justify-center">
          <p className="loading text-center">Loading</p>
        </div>
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
          <div className="flex flex-col flex-grow items-stretch justify-around mx-3 space-y-2 sm:space-y-0 sm:space-x-5 sm:flex-row">
            <OuterPanel className="w-full flex flex-col items-center relative">
              <div className="flex w-full items-center justify-center py-4 px-2">
                <p className="mr-2 mb-1 text-xs">Cash / Card</p>
                <img
                  src={creditCard}
                  style={{
                    height: `${PIXEL_SCALE * 13}px`,
                  }}
                />
              </div>
              {price.amount == 1 && (
                <Label type="info" className="mb-1">
                  Choose a higher amount
                </Label>
              )}
              <Button
                onClick={() => onCreditCardBuy()}
                disabled={price.amount == 1}
              >
                Pay with Cash
              </Button>
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
            Block bucks will be stored on your farm.
          </p>
          <p className="text-xxs italic text-center py-2">
            *Prices exclude transaction fees.
          </p>
        </>
      );
    }

    return (
      <>
        <div
          className="overflow-y-auto scrollable "
          style={{ maxHeight: "280px" }}
        >
          <p className="text-xxs italic text-center pt-2">
            *Prices exclude transaction fees.
          </p>
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
        </div>

        <div className="flex flex-col">
          <a
            href="https://docs.sunflower-land.com/fundamentals/blockchain-fundamentals#block-bucks"
            className="mx-auto text-xxs underline text-center pb-2 pt-2"
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
      onBack={closeable && price ? () => setPrice(undefined) : undefined}
      onClose={closeable ? onClose : undefined}
      title="Buy Block Bucks"
      bumpkinParts={{
        body: "Light Brown Farmer Potion",
        hair: "White Long Hair",
        shirt: "Fancy Top",
        pants: "Fancy Pants",
        tool: "Farmer Pitchfork",
      }}
    >
      {showXsolla ? <XsollaIFrame url={showXsolla} /> : <Content />}
    </CloseButtonPanel>
  );
};
