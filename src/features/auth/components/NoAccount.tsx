import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { Context } from "../lib/Provider";
import { getFarms } from "lib/blockchain/Farm";
import { wallet } from "lib/blockchain/wallet";
import { Button } from "components/ui/Button";
import { Wallet } from "features/wallet/Wallet";
import { OuterPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { isAddress } from "web3-utils";
import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Loading } from "./Loading";
import { getReferrerId, saveReferrerId } from "../actions/createAccount";
import { ConfirmationModal } from "components/ui/ConfirmationModal";

export const NoAccount: React.FC = () => {
  const { authService } = useContext(Context);
  const [authState] = useActor(authService);

  const [showReferralId, setShowReferralId] = useState(false);
  const [referralId, setReferralId] = useState(getReferrerId() ?? undefined);
  const [showEmptyReferralModal, setShowEmptyReferralModal] = useState(false);

  const [showClaimAccount, setShowClaimAccount] = useState(false);
  const { t } = useAppTranslation();
  const handleCreateFarm = () => {
    if (!referralId) {
      setShowEmptyReferralModal(true);
    } else {
      authService.send("CREATE_FARM");
    }
  };

  if (showReferralId) {
    return (
      <>
        <div className="p-2">
          <p className="text-xs mb-1">{t("reward.promo.code")}</p>
          <input
            style={{
              boxShadow: "#b96e50 0px 1px 1px 1px inset",
              border: "2px solid #ead4aa",
            }}
            type="text"
            min={1}
            value={referralId}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setReferralId(e.target.value);
            }}
            className={
              "text-shadow mr-2 rounded-sm shadow-inner shadow-black bg-brown-200 w-full p-2 h-10"
            }
          />
        </div>
        <div className="flex space-x-1">
          <Button
            onClick={() => {
              setShowReferralId(false);
            }}
          >
            {t("back")}
          </Button>
          <Button
            disabled={!referralId}
            onClick={() => {
              setShowReferralId(false);
              saveReferrerId(referralId as string);
            }}
          >
            {t("ok")}
          </Button>
        </div>
      </>
    );
  }

  if (showClaimAccount) {
    return (
      <Wallet action="login">
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
            {t("noaccount.newFarmer")}
          </Label>
          {referralId && (
            <Label
              type="formula"
              icon={SUNNYSIDE.icons.search}
              onClick={() => setShowReferralId(true)}
            >
              {`${t("noaccount.referralCodeLabel", { referralId })}`}
            </Label>
          )}
          {!referralId && (
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-xs cursor-pointer"
              onClick={() => setShowReferralId(true)}
            >
              {t("noaccount.addReferralCode")}
            </a>
          )}
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <span className="px-2 text-sm">{t("noaccount.welcomeMessage")}</span>
        <div className="flex space-x-1 mt-2.5">
          {isAddress(authState.context.user.token?.address ?? "") && (
            <Button onClick={() => setShowClaimAccount(true)}>
              {t("noaccount.haveFarm")}
            </Button>
          )}
          <Button onClick={handleCreateFarm}>{t("noaccount.letsGo")}</Button>
        </div>
      </div>
      <ConfirmationModal
        show={showEmptyReferralModal}
        onHide={() => setShowEmptyReferralModal(false)}
        messages={[
          "You have not added a referral code. Are you sure you want to continue?",
        ]}
        onCancel={() => setShowEmptyReferralModal(false)}
        onConfirm={() => {
          authService.send("CREATE_FARM");
          setShowEmptyReferralModal(false);
        }}
        confirmButtonLabel={"Yes I'm sure"}
      />
    </>
  );
};

export const ClaimAccount: React.FC<{
  onClaim: (id: number) => void;
  onBack: () => void;
}> = ({ onBack, onClaim }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tokenIds, setTokenIds] = useState<number[]>([]);
  const { t } = useAppTranslation();

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);

      const farms = await getFarms(wallet.getAccount() as `0x${string}`);

      const ids = farms.map((farm) => Number(farm.tokenId));

      setTokenIds(ids);

      setIsLoading(false);
    };

    load();
  }, []);

  if (isLoading) return <Loading />;

  if (tokenIds.length === 0) {
    return (
      <>
        <div className="p-2">{t("noaccount.noFarmNFTs")}</div>
        <Button onClick={onBack}>{t("noaccount.createNewFarm")}</Button>
      </>
    );
  }

  return (
    <>
      <div className="p-1">
        <p className="m-1 text-sm">{t("noaccount.selectNFTID")}</p>
        {tokenIds.map((id) => (
          <OuterPanel
            className={
              "flex relative items-center justify-between !p-2 mb-1 cursor-pointer hover:bg-brown-200"
            }
            key={id}
            onClick={() => onClaim(id)}
          >
            <Label type="formula">{`ID: #${id}`}</Label>
          </OuterPanel>
        ))}
      </div>
      <Button onClick={onBack}>{t("back")}</Button>
    </>
  );
};
