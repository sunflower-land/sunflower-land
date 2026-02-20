import React from "react";
import { generateSignatureMessage } from "lib/blockchain/wallet";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useConnection, useSignMessage, useSwitchChain } from "wagmi";
import walletIcon from "assets/icons/wallet.png";
import { Label } from "components/ui/Label";
import { getWalletIcon } from "features/wallet/lib/getWalletIcon";
import { shortAddress } from "lib/utils/shortAddress";
import { Button } from "components/ui/Button";
import { SignMessageErrorType } from "@wagmi/core";
import { useEffect } from "react";
import { base, baseSepolia } from "viem/chains";
import { CONFIG } from "lib/config";

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
  const { address, connector, isConnected } = useConnection();
  const {
    mutateAsync: signMessageAsync,
    error,
    isError,
    isPending,
  } = useSignMessage();
  const { mutateAsync: switchChain } = useSwitchChain();
  const { t } = useAppTranslation();

  const signIn = async (address: string) => {
    // Coinbase Wallet sign in requires Base or Ethereum to function
    // It fails to sign in if the chain is Polygon for example
    if (connector?.name === "Coinbase Wallet") {
      await switchChain({
        chainId: CONFIG.NETWORK === "mainnet" ? base.id : baseSepolia.id,
      });
    }

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
        <Button onClick={() => onDisconnect()}>
          {t("walletWall.disconnect")}
        </Button>
        <Button disabled={isPending} onClick={() => signIn(address ?? "")}>
          {t("walletWall.signMessage")}
        </Button>
      </div>
    </>
  );
};
