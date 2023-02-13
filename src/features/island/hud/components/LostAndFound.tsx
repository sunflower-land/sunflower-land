import React, { useContext, useEffect, useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import Decimal from "decimal.js-light";
import { Loading } from "features/auth/components";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { ITEM_NAMES } from "features/game/types/bumpkin";
import { getKeys } from "features/game/types/craftables";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import { loadWearablesBalanceBatch as loadWearablesBalances } from "lib/blockchain/BumpkinItems";
import { wallet } from "lib/blockchain/wallet";
import { shortAddress } from "lib/utils/shortAddress";
import { transferLostItems } from "lib/blockchain/LostAndFound";
import { SomethingWentWrong } from "features/auth/components/SomethingWentWrong";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  onClose: () => void;
}

export const LostAndFound: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [status, setStatus] = useState<
    "loading" | "loaded" | "sending" | "sent" | "error"
  >("loading");
  const [lostWearables, setLostWearables] = useState<Record<number, number>>(
    {}
  );

  useEffect(() => {
    if (status !== "loading") return;

    const loadBalances = async () => {
      const wearables = await loadWearablesBalances(
        wallet.web3Provider,
        gameService.state.context.state.farmAddress as string
      );

      setLostWearables(wearables);
      setStatus("loaded");
    };

    loadBalances();
  }, [status]);

  const handleItemsTransfer = async () => {
    const lostIds = Object.keys(lostWearables).map((id) => parseInt(id));
    const lostAmounts = Object.values(lostWearables);
    const farmId = gameService.state.context.state.id as number;

    setStatus("sending");

    try {
      await transferLostItems(
        wallet.web3Provider,
        wallet.myAccount,
        lostIds,
        lostAmounts,
        farmId
      );

      setStatus("sent");
    } catch (error: any) {
      console.error(error.message);

      if (error.message === "REJECTED_TRANSACTION") {
        onClose();
        return;
      }

      setStatus("error");
    }
  };

  const hasLostWearables = Object.keys(lostWearables).length > 0;

  const Content = () => (
    <>
      <div className="p-2 mb-2">
        <p className="text-sm mb-4">
          The following Bumpkin Wearables were found on your farm:{" "}
        </p>
        <div className="flex mb-4 -ml-1">
          {getKeys(lostWearables).map((wearableId) => {
            const wearable = ITEM_NAMES[wearableId];
            const count = new Decimal(lostWearables[wearableId]);

            return (
              <Box
                key={wearable}
                image={getImageUrl(wearableId)}
                count={count}
                className="pointer-events-none"
              />
            );
          })}
        </div>
        <div className="flex space-x-2 items-center">
          <img
            src={SUNNYSIDE.icons.player}
            className="w-6"
            alt="Personal address"
          />
          <p className="text-sm">{shortAddress(wallet.myAccount)}</p>
        </div>
      </div>
      <Button
        type="button"
        onClick={handleItemsTransfer}
        disabled={!hasLostWearables}
        className="w-full"
      >
        Send items to my personal wallet
      </Button>
    </>
  );

  const title = status === "sent" ? "Congratulations" : "Lost and Found";
  const handleClose = status !== "sending" ? onClose : undefined;

  if (status === "error") return <SomethingWentWrong />;

  return (
    <CloseButtonPanel title={title} onClose={handleClose}>
      {status === "loading" && <Loading />}
      {status === "loaded" && hasLostWearables && <Content />}
      {status === "loaded" && !hasLostWearables && (
        <p className="text-sm p-2">No missing items found!</p>
      )}
      {status === "sending" && <Loading text="Sending items" />}
      {status === "sent" && (
        <div className="text-sm p-2 pt-0 space-y-2 flex flex-col items-center">
          <img
            src={SUNNYSIDE.npcs.goblin_jumping}
            style={{
              width: `${PIXEL_SCALE * 18}px`,
            }}
          />
          <p>Your items have been returned to your personal wallet.</p>
        </div>
      )}
    </CloseButtonPanel>
  );
};
