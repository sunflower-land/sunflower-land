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
import { hasFeatureAccess } from "lib/flags";
import { Modal } from "react-bootstrap";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";

interface Props {
  show: boolean;
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

const XsollaIFrame: React.FC<{
  url: string;
  onSuccess: () => void;
  onClose: () => void;
}> = ({ url, onSuccess, onClose }) => {
  useEffect(() => {
    const listener = (event: any) => {
      const origin = new URL(url).origin;

      if (event.origin !== origin) return;

      const eventData = JSON.parse(event.data);
      console.log(eventData);
      if (eventData.command === "close-widget") {
        onClose();
      }

      if (eventData.command === "return") {
        onSuccess();
      }
    };
    window.addEventListener("message", listener);

    return () => window.removeEventListener("message", listener);
  }, []);

  return (
    <iframe
      src={url}
      title="Xsolla Checkout"
      className="w-full h-full rounded-lg shadow-md absolute"
    />
  );
};

const Loading: React.FC<{ autoClose: boolean }> = ({ autoClose }) => {
  const [closed, setClosed] = useState<boolean>(false);

  useEffect(() => {
    if (autoClose) {
      setTimeout(() => {
        setClosed(true);
      }, 10000);
    }
  }, [autoClose]);

  if (closed) return null;

  return (
    <div className="flex items-center justify-center w-full h-full absolute">
      <svg
        width="24"
        height="24"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-[spin_2s_linear_infinite]"
      >
        <path
          d="M45.5 24C45.5 28.2523 44.239 32.4091 41.8766 35.9448C39.5141 39.4804 36.1563 42.2361 32.2277 43.8634C28.2991 45.4907 23.9762 45.9165 19.8056 45.0869C15.635 44.2573 11.804 42.2096 8.7972 39.2028C5.79038 36.196 3.7427 32.365 2.91312 28.1944C2.08353 24.0239 2.50931 19.7009 4.13659 15.7723C5.76387 11.8437 8.51958 8.48585 12.0552 6.1234C15.5909 3.76095 19.7477 2.5 24 2.5"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export const BlockBucksModal: React.FC<Props> = ({
  show,
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

  const [isMobile] = useIsMobile();

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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    }
  };

  const onCreditCardSuccess = () => {
    onClose();
    gameService.send("UPDATE_BLOCK_BUCKS", { amount: price?.amount });
  };

  const onExited = () => {
    setShowXsolla(undefined);
    setPrice(undefined);
    setLoading(false);
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
              {price.amount === 1 && (
                <Label type="info" className="mb-1">
                  Choose a higher amount
                </Label>
              )}
              <Button
                onClick={() => onCreditCardBuy()}
                disabled={price.amount === 1 || !hasFeatureAccess({}, "XSOLLA")}
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
    <Modal
      centered
      show={show}
      onHide={onClose}
      fullscreen={!!showXsolla && isMobile ? true : undefined}
      onExited={onExited}
      size={showXsolla ? "lg" : undefined}
    >
      {showXsolla ? (
        <div className="relative w-full h-full min-h-[65vh] min-w[65vw]">
          <Loading autoClose={true} />
          <XsollaIFrame
            url={showXsolla}
            onSuccess={onCreditCardSuccess}
            onClose={onClose}
          />
        </div>
      ) : loading ? (
        <Loading autoClose={false} />
      ) : (
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
          <Content />
        </CloseButtonPanel>
      )}
    </Modal>
  );
};
