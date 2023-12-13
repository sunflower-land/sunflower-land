import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { Context } from "../lib/Provider";

import { getPromoCode, savePromoCode } from "features/game/actions/loadSession";

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
import { SUNNYSIDE } from "assets/sunnyside";

export const NoAccount: React.FC = () => {
  const { authService } = useContext(Context);
  const [authState] = useActor(authService);

  const [showPromoCode, setShowPromoCode] = useState(false);
  const [promoCode, setPromoCode] = useState(getPromoCode());

  const [showClaimAccount, setShowClaimAccount] = useState(false);

  if (showPromoCode) {
    return (
      <>
        <div className="p-2">
          <p className="text-xs mb-1">Enter your promo code:</p>
          <input
            style={{
              boxShadow: "#b96e50 0px 1px 1px 1px inset",
              border: "2px solid #ead4aa",
            }}
            type="text"
            min={1}
            value={promoCode}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setPromoCode(e.target.value);
            }}
            className={
              "text-shadow mr-2 rounded-sm shadow-inner shadow-black bg-brown-200 w-full p-2 h-10"
            }
          />
        </div>
        <div className="flex space-x-1">
          <Button
            onClick={() => {
              setShowPromoCode(false);
            }}
          >
            Back
          </Button>
          <Button
            disabled={!promoCode}
            onClick={() => {
              setShowPromoCode(false);
              savePromoCode(promoCode as string);
            }}
          >
            Ok
          </Button>
        </div>
      </>
    );
  }

  if (showClaimAccount) {
    return (
      <Wallet>
        <ClaimAccount
          onBack={() => setShowClaimAccount(false)}
          onClaim={(id) => authService.send("CLAIM", { id })}
        />
      </Wallet>
    );
  }

  return (
    <>
      <div className="px-2">
        <div className="flex items-center justify-between mb-2">
          <Label type="chill" icon={SUNNYSIDE.icons.heart}>
            New Farmer
          </Label>
          {promoCode && (
            <Label type="formula" icon={SUNNYSIDE.icons.search}>
              {`Promo Code: ${getPromoCode()}`}
            </Label>
          )}
          {!promoCode && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-white text-xs cursor-pointer"
              onClick={() => setShowPromoCode(true)}
            >
              Add a promo code?
            </a>
          )}
        </div>
        <p className="text-sm mb-2">
          Welcome to Sunflower Land. It looks like you don't have a farm yet.
        </p>
      </div>
      <Button onClick={() => authService.send("CREATE_FARM")}>
        Create Farm
      </Button>
      {isAddress(authState.context.user.token?.address ?? "") && (
        <div className="mb-1 px-1 py-0.5">
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-white text-xs cursor-pointer"
            onClick={() => setShowClaimAccount(true)}
          >
            Already have an NFT farm?
          </a>
        </div>
      )}
    </>
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
