import React from "react";
import { generateSignatureMessage } from "lib/blockchain/wallet";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useAccount, useSignMessage } from "wagmi";
import walletIcon from "assets/icons/wallet.png";
import { Label } from "components/ui/Label";
import { getWalletIcon } from "features/wallet/lib/getWalletIcon";
import { shortAddress } from "lib/utils/shortAddress";
import { Button } from "components/ui/Button";
import { SignMessageErrorType } from "@wagmi/core";

const SignMessageErrorMessage: React.FC<{
  error: SignMessageErrorType;
}> = ({ error }) => {
  switch (error.name) {
    case "SizeOverflowError":
      return (
        <div className="p-2">
          You are already connected to this wallet. Please disconnect and try
          again.
        </div>
      );
    case "IntegerOutOfRangeError":
      return (
        <div className="p-2">
          The connection request was rejected. Please try again.
        </div>
      );
    case "Error":
      return (
        <div className="p-2">
          There was an error signing the message. Please try again.
        </div>
      );
    case "SizeExceedsPaddingSizeError":
      return (
        <div className="p-2">The message is too long. Please try again.</div>
      );
    default:
      return (
        <div className="p-2">
          There was an error signing the message. Please try again.
        </div>
      );
  }
};

export const SignMessage: React.FC<{
  onSignMessage: ({
    address,
    signature,
  }: {
    address: string;
    signature: string;
  }) => void;
  onDisconnect: () => void;
}> = ({ onSignMessage, onDisconnect }) => {
  const { address, connector } = useAccount();
  const { signMessageAsync, error, isError } = useSignMessage();
  const { t } = useAppTranslation();

  const signIn = async (address: string) => {
    const signature = await signMessageAsync({
      message: generateSignatureMessage({
        address,
        nonce: Math.floor(Date.now() / 8.64e7),
      }),
    });

    onSignMessage({ address, signature });
  };

  return (
    <>
      <div className="flex justify-between items-center mt-1 ml-2">
        <div>
          <Label type="default" icon={walletIcon}>
            {connector?.name ?? "Connected"}
          </Label>
        </div>
        <div>
          <Label type="default" icon={getWalletIcon(connector)}>
            {shortAddress(address ?? "")}
          </Label>
        </div>
      </div>
      {isError && <SignMessageErrorMessage error={error} />}
      {!isError && (
        <div className="p-2">
          <p className="text-sm">
            {t("wallet.signRequestInWallet")}
            {"."}
          </p>
        </div>
      )}

      <div className="flex justify-between items-center space-x-1">
        <Button onClick={() => signIn(address ?? "")}>Sign Message</Button>
        <Button onClick={() => onDisconnect()}>Disconnect</Button>
      </div>
    </>
  );
};
