import clipboard from "clipboard";
import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { Button } from "components/ui/Button";

import ticket from "assets/icons/ticket.png";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context as GameContext } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { useTimeBasedFeatureAccess } from "lib/utils/hooks/useTimeBasedFeatureAccess";
import type { ContentComponentProps } from "../types";
import { Label } from "components/ui/Label";
import { useSound } from "lib/utils/hooks/useSound";
import { WalletAddressLabel } from "components/ui/WalletAddressLabel";
import { GameWallet } from "features/wallet/Wallet";

const _farmAddress = (state: MachineState) => state.context.farmAddress ?? "";
const _nftId = (state: MachineState) => state.context.nftId;
const _linkedWallet = (state: MachineState) => state.context.linkedWallet;
const _state = (state: MachineState) => state.context.state;

export const BlockchainSettings: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
  onClose,
}) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(GameContext);
  const { openModal } = useContext(ModalContext);
  const nftId = useSelector(gameService, _nftId);
  const linkedWallet = useSelector(gameService, _linkedWallet);

  const farmAddress = useSelector(gameService, _farmAddress);
  const state = useSelector(gameService, _state);
  const isFullUser = farmAddress !== "";
  // @deprecated: gated behind `MINT_ON_DEMAND_WITHDRAWS`. Beta players see no
  // "Store on Chain" CTA — the new mint-on-demand withdraw flow replaces it.
  const showStoreOnChain = !useTimeBasedFeatureAccess({
    featureName: "MINT_ON_DEMAND_WITHDRAWS",
    game: state,
  });
  const storeOnChain = async () => {
    openModal("STORE_ON_CHAIN");
    onClose();
  };

  const [showNftId, setShowNftId] = useState(false);
  const copypaste = useSound("copypaste");

  return (
    <GameWallet action="blockchainSettings">
      <div className="flex flex-col gap-1 mt-1">
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

        <Button onClick={() => onSubMenuClick("deposit")}>
          {t("deposit.items")}
        </Button>
        {isFullUser && showStoreOnChain && (
          <Button onClick={storeOnChain}>
            {t("gameOptions.blockchainSettings.storeOnChain")}
          </Button>
        )}
        {isFullUser && (
          <Button onClick={() => onSubMenuClick("dequip")}>
            {t("dequipper.dequip")}
          </Button>
        )}
        {isFullUser && (
          <Button onClick={() => onSubMenuClick("transfer")}>
            {t("gameOptions.blockchainSettings.transferOwnership")}
          </Button>
        )}
      </div>
    </GameWallet>
  );
};
