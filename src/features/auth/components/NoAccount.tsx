import React, { useContext, useEffect, useState } from "react";
import { Context } from "../lib/Provider";

import walletIcon from "src/assets/icons/wallet.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getFarms } from "lib/blockchain/Farm";
import { wallet } from "lib/blockchain/wallet";
import { Button } from "components/ui/Button";
import { Wallet } from "features/wallet/Wallet";
import { OuterPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { isAddress } from "web3-utils";
import { useActor } from "@xstate/react";

export const NoAccount: React.FC = () => {
  const { authService } = useContext(Context);
  const [authState] = useActor(authService);

  const [showClaimAccount, setShowClaimAccount] = useState(false);

  if (showClaimAccount) {
    return (
      <Wallet>
        <ClaimAccount
          onBack={() => setShowClaimAccount(false)}
          onClaim={() => authService.send("CLAIM")}
        />
      </Wallet>
    );
  }

  return (
    <div className="p-2">
      <p className="text-sm mb-2">
        It looks like you don't have an account yet.
      </p>
      <Button onClick={() => authService.send("CREATE_FARM")}>
        Create Account
      </Button>
      {isAddress(authState.context.user.token?.address ?? "") && (
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-white text-xs cursor-pointer"
          onClick={() => setShowClaimAccount(true)}
        >
          Already have an NFT account?
        </a>
      )}
    </div>
  );
};

export const ClaimAccount: React.FC<{
  onClaim: (id: number) => void;
  onBack: () => void;
}> = ({ onBack, onClaim }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tokenIds, setTokenIds] = useState<number[]>([]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);

      const farms = await getFarms(
        wallet.web3Provider,
        wallet.myAccount as string
      );

      const ids = farms.map((farm) => Number(farm.tokenId));

      setTokenIds(ids);

      setIsLoading(false);
    };

    load();
  }, []);

  if (isLoading) return <p className="loading">Loading</p>;

  if (tokenIds.length === 0) {
    return (
      <>
        <div className="p-2">You do not own any farm NFTs.</div>
        <Button onClick={onBack}>Create new farm</Button>
      </>
    );
  }

  return (
    <>
      <div className="p-1">
        <p className="m-1 text-sm">Select your NFT ID:</p>
        {tokenIds.map((id) => (
          <OuterPanel
            className={
              "flex relative items-center justify-between p-2 mb-1 cursor-pointer hover:bg-brown-200"
            }
            key={id}
            onClick={() => onClaim(id)}
          >
            <Label type="formula">{`ID: #${id}`}</Label>
          </OuterPanel>
        ))}
      </div>
      <Button onClick={onBack}>Back</Button>
    </>
  );
};
