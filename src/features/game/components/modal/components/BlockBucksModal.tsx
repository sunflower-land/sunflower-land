import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext } from "react";
import ticket from "assets/icons/block_buck.png";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";

interface Props {
  onClose: () => void;
}
export const BlockBucksModal: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const count =
    gameState.context.state.inventory["Block Buck"] ?? new Decimal(0);
  const canBuyMore = count.eq(0);

  const onBuy = (amount: 1 | 5) => {
    gameService.send("SYNC", { captcha: "", blockBucks: amount });
    onClose();
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
      {!canBuyMore && (
        <p className="text-xs text-center mb-4 leading-none">
          {`You have ${count} Block Bucks. You must use these before purchasing more`}
        </p>
      )}

      <div className="flex justify-around">
        <OuterPanel className="w-2/5 flex flex-col items-center p-3">
          <div className="flex w-full items-center justify-center  mb-2 ">
            <p>1 x</p>
            <img src={ticket} className="w-2/5 ml-1" />
          </div>
          <Button
            disabled={!canBuyMore}
            className="w-20 text-sm"
            onClick={() => onBuy(1)}
          >
            US$0.10
          </Button>
        </OuterPanel>
        <OuterPanel className="w-2/5 flex flex-col items-center relative p-3">
          <div className="h-10 absolute" style={{ top: "-20px" }}>
            <Label type="info">Recommended</Label>
          </div>
          <div className="flex w-full items-center justify-center  mb-2">
            <p>5 x</p>
            <img src={ticket} className="w-2/5 ml-1" />
          </div>
          <Button
            disabled={!canBuyMore}
            className="w-20 text-sm"
            onClick={() => onBuy(5)}
          >
            US$0.75
          </Button>
        </OuterPanel>
      </div>

      <p className="text-xs text-center pt-2">
        Game progress will be stored on Blockchain.
      </p>
      <p className="text-xxs italic text-center pb-2">
        *Prices exclude Blockchain transaction fees.
      </p>
    </CloseButtonPanel>
  );
};
