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
import { useEffect } from "react";

const SignMessageErrorMessage: React.FC<{
  error: SignMessageErrorType;
}> = ({ error }) => {
  switch (error.name) {
    default:
      return (
        <div className="py-2">
          <Label type="warning">{error.message}</Label>
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
  const { address, connector, isConnected } = useAccount();
  const { signMessageAsync, error, isError, isPending } = useSignMessage();
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

  useEffect(() => {
    if (!isConnected) onDisconnect();
  }, [isConnected]);

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
          {isPending && (
            <p className="text-sm">{t("walletWall.pleaseCheckWallet")}</p>
          )}
          {!isPending && (
            <p className="text-sm">
              {t("wallet.signRequestInWallet")}
              {"."}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-between items-center space-x-1">
        <Button disabled={isPending} onClick={() => signIn(address ?? "")}>
          {t("walletWall.signMessage")}
        </Button>
        <Button onClick={() => onDisconnect()}>
          {t("walletWall.disconnect")}
        </Button>
      </div>
    </>
  );
};
