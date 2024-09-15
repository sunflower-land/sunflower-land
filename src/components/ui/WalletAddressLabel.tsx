import React from "react";

import walletIcon from "assets/icons/wallet.png";
import { useSound } from "lib/utils/hooks/useSound";
import clipboard from "clipboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { shortAddress } from "lib/utils/shortAddress";
import { Label } from "./Label";

interface Props {
  walletAddress: string;
  showLabelTitle?: boolean;
}

export const WalletAddressLabel: React.FC<Props> = ({
  walletAddress,
  showLabelTitle,
}) => {
  const { t } = useAppTranslation();

  const copypaste = useSound("copypaste");

  return (
    <Label
      type="formula"
      className="mb-1 mr-4"
      icon={walletIcon}
      onClick={() => {
        copypaste.play();
        clipboard.copy(walletAddress);
      }}
    >
      {showLabelTitle && t("linked.wallet") + " - "}
      {shortAddress(walletAddress)}
    </Label>
  );
};
