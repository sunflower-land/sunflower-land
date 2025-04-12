import clipboard from "clipboard";
import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { Button } from "components/ui/Button";

import ticket from "assets/icons/ticket.png";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context as GameContext } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { ContentComponentProps } from "../GameOptions";
import { Label } from "components/ui/Label";
import { useSound } from "lib/utils/hooks/useSound";
import { WalletAddressLabel } from "components/ui/WalletAddressLabel";

const _farmAddress = (state: MachineState) => state.context.farmAddress ?? "";
const _state = (state: MachineState) => state.context.state;

export const BlockchainSettings: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
  onClose,
}) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(GameContext);
  const { openModal } = useContext(ModalContext);

  const farmAddress = useSelector(gameService, _farmAddress);
  const state = useSelector(gameService, _state);
  const isFullUser = farmAddress !== "";
  const storeOnChain = async () => {
    openModal("STORE_ON_CHAIN");
    onClose();
  };

  const [showNftId, setShowNftId] = useState(false);
  const copypaste = useSound("copypaste");

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between">
        {gameService.state?.context?.nftId !== undefined ? (
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
              clipboard.copy(
                gameService.state?.context?.nftId?.toString() || "",
              );
            }}
          >
            {`NFT ID #${gameService.state?.context?.nftId}`}
          </Label>
        ) : (
          <div className="w-10" />
        )}
        {gameService.state?.context?.linkedWallet && (
          <WalletAddressLabel
            walletAddress={
              (gameService.state?.context?.linkedWallet as string) || "XXXX"
            }
            showLabelTitle={false}
          />
        )}
      </div>

      <Button onClick={() => onSubMenuClick("deposit")}>{t("deposit")}</Button>
      {isFullUser && (
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
  );
};
