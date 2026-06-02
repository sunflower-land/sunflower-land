import clipboard from "clipboard";
import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import ticket from "assets/icons/ticket.png";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context as GameContext } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type { ContentComponentProps } from "../types";
import { Label } from "components/ui/Label";
import { useSound } from "lib/utils/hooks/useSound";
import { WalletAddressLabel } from "components/ui/WalletAddressLabel";

const _nftId = (state: MachineState) => state.context.nftId;
const _linkedWallet = (state: MachineState) => state.context.linkedWallet;

export const BlockchainSettings: React.FC<ContentComponentProps> = () => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(GameContext);
  const nftId = useSelector(gameService, _nftId);
  const linkedWallet = useSelector(gameService, _linkedWallet);

  const [showNftId, setShowNftId] = useState(false);
  const copypaste = useSound("copypaste");

  return (
    <div className="flex flex-col gap-2 p-1 mt-1">
      <div className="flex justify-between">
        {nftId !== undefined && (
          <Label
            type="default"
            icon={ticket}
            popup={showNftId}
            className="mb-1 mr-4 ml-2"
            onClick={() => {
              setShowNftId(true);
              setTimeout(() => {
                setShowNftId(false);
              }, 2000);
              copypaste.play();
              clipboard.copy(String(nftId));
            }}
          >
            {`NFT ID #${nftId}`}
          </Label>
        )}
        {linkedWallet && (
          <WalletAddressLabel
            walletAddress={linkedWallet}
            showLabelTitle={false}
          />
        )}
      </div>

      <p className="text-xs">
        {t("gameOptions.blockchainSettings.movedToBank")}
      </p>
    </div>
  );
};
