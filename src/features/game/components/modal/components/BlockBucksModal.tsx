import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useEffect } from "react";
import ticket from "assets/icons/block_buck_detailed.png";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { analytics } from "lib/analytics";

interface Props {
  onClose: () => void;
}
export const BlockBucksModal: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const count =
    gameState.context.state.inventory["Block Buck"] ?? new Decimal(0);

  const onBuy = (amount: 1 | 5 | 15) => {
    gameService.send("PURCHASE_ITEM", {
      name: "Block Buck",
      amount,
    });
    // gameService.send("SYNC", { captcha: "", blockBucks: amount });
    onClose();
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
        <div className="flex justify-around mx-3 space-x-5">
          <OuterPanel className="w-full h-full flex flex-col items-center relative">
            <div className="flex w-full items-center justify-center py-4 px-2">
              <p className="mr-2 mb-1">1 x</p>
              <img
                src={ticket}
                style={{
                  width: `${PIXEL_SCALE * 19}px`,
                }}
              />
            </div>
            <Button onClick={() => onBuy(1)}>$0.10 USD</Button>
          </OuterPanel>
          <OuterPanel className="w-full h-full flex flex-col items-center relative">
            <div className="h-10 absolute" style={{ top: "-20px" }}>
              <Label type="info">Recommended</Label>
            </div>
            <div className="flex w-full items-center justify-center py-4 px-2">
              <p className="mr-2 mb-1">5 x</p>
              <img
                src={ticket}
                style={{
                  width: `${PIXEL_SCALE * 19}px`,
                }}
              />
            </div>
            <Button onClick={() => onBuy(5)}>$0.75 USD</Button>
          </OuterPanel>
          <OuterPanel className="w-full h-full flex flex-col items-center relative">
            <div className="flex w-full items-center justify-center py-4 px-2">
              <p className="mr-2 mb-1">15 x</p>
              <img
                src={ticket}
                style={{
                  width: `${PIXEL_SCALE * 19}px`,
                }}
              />
            </div>
            <Button onClick={() => onBuy(15)}>$2.49 USD</Button>
          </OuterPanel>
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
            Why does the price increase when buying multiple?
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
