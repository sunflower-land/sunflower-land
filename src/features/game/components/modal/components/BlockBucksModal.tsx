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

const bulkAmount = 5;

interface Props {
  onClose: () => void;
}

export const BlockBucksModal: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const count =
    gameState.context.state.inventory["Block Buck"] ?? new Decimal(0);
  const canBuyOne = count.lessThan(bulkAmount);
  const canBuyBulk = count.lessThan(1);

  const onBuy = (amount: 1 | typeof bulkAmount) => {
    gameService.send("SYNC", { captcha: "", blockBucks: amount });
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

    const getWarning = () => {
      if (!canBuyOne) {
        return (
          <p className="text-xs text-center pb-3 px-2 leading-none">
            {`You have ${count} Block Bucks. You must use these before purchasing more.`}
          </p>
        );
      }

      if (!canBuyBulk) {
        return (
          <p className="text-xs text-center pb-3 px-2 leading-none">
            {`You have ${count} Block Bucks. You can buy and own up to ${bulkAmount} Block Bucks.`}
          </p>
        );
      }

      return <></>;
    };

    return (
      <>
        {getWarning()}

        <div className="flex justify-around px-3 space-x-5 pt-2">
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
            <Button disabled={!canBuyOne} onClick={() => onBuy(1)}>
              $0.10 USD
            </Button>
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
            <Button disabled={!canBuyBulk} onClick={() => onBuy(bulkAmount)}>
              $0.75 USD
            </Button>
          </OuterPanel>
        </div>

        <p className="text-xs text-center pt-2 px-2">
          Game progress will be stored on Blockchain.
        </p>
        <p className="text-xxs italic text-center p-2">
          *Prices exclude Blockchain transaction fees.
        </p>
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
