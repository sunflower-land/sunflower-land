import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext } from "react";

import { Context } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import { GameWallet } from "features/wallet/Wallet";

interface Props {
  onClose: () => void;
}
export const StoreOnChainModal: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);

  const storeData = () => {
    gameService.send("SYNC", {
      captcha: "",
      blockBucks: 0,
    });

    onClose();
  };

  return (
    <CloseButtonPanel
      onClose={onClose}
      title="Store Progress"
      bumpkinParts={{
        body: "Goblin Potion",
        pants: "Farmer Overalls",
        tool: "Hammer",
        hair: "Sun Spots",
      }}
    >
      <GameWallet>
        <>
          <div className="p-2">
            <p className="text-sm mb-2">
              Do you wish to store your progress on the Blockchain?
            </p>
            <p className="text-xxs italic mb-2">
              Storing data on the Blockchain does not restock shops.
            </p>
          </div>
          <Button onClick={storeData}>Store progress</Button>
        </>
      </GameWallet>
    </CloseButtonPanel>
  );
};
