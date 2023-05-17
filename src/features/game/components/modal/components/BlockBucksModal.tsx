import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useEffect } from "react";
import ticket from "assets/icons/block_buck_detailed.png";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { analytics } from "lib/analytics";
import { buyBlockBucks } from "features/game/actions/buyBlockBucks";
import * as Auth from "features/auth/lib/Provider";
import { randomID } from "lib/utils/random";

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

export const BlockBucksModal: React.FC<Props> = ({ onClose }) => {
  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const count =
    gameState.context.state.inventory["Block Buck"] ?? new Decimal(0);

  const onBuy = async (amount: number) => {
    // gameService.send("PURCHASE_ITEM", {
    //   name: "Block Buck",
    //   amount,
    // });
    try {
      const response = await buyBlockBucks({
        farmId: authService.state.context.user.farmId as number,
        token: authService.state.context.user.rawToken as string,
        type: "MATIC",
        amount,
        transactionId: randomID(),
      });

      console.log("Buy block bucks from modal", response);
    } catch (error) {
      console.error("Error buying block bucks", error);
    }
    // onClose();
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
                  onClick={() => onBuy(price.amount)}
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
