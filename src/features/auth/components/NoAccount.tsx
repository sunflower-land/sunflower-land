import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { Context } from "../lib/Provider";
import { getFarms } from "lib/blockchain/Farm";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { isAddress } from "web3-utils";
import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Loading } from "./Loading";
import {
  checkReferralCode,
  getReferrerId,
  saveReferrerId,
} from "../actions/createAccount";
import { ConfirmationModal } from "components/ui/ConfirmationModal";
import { TextInput } from "components/ui/TextInput";
import debounce from "lodash.debounce";
import type { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { SignupBumpkinEquip } from "features/bumpkins/components/SignupBumpkinEquip";
import type { CreateFarmEvent } from "../lib/authMachine";

type ValidationState = "notFound" | "checking" | "valid" | "error";

/** How long signup waits for the farm NFT lookup before showing the regular page */
const NFT_LOOKUP_TIMEOUT_MS = 15_000;

export const NoAccount: React.FC = () => {
  const { t } = useAppTranslation();
  const { authService } = useContext(Context);
  const [authState] = useActor(authService);

  const [showReferralId, setShowReferralId] = useState(false);
  const [referralId, setReferralId] = useState(getReferrerId() ?? undefined);
  const [showEmptyReferralModal, setShowEmptyReferralModal] = useState(false);
  const [showBumpkinModal, setShowBumpkinModal] = useState(false);
  const [validationState, setValidationState] = useState<ValidationState>();
  const [showClaimAccount, setShowClaimAccount] = useState(false);
  const address = authState.context.user.token?.address ?? "";
  const hasWallet = isAddress(address);

  // Farm NFTs owned by the connected wallet, so a player who already owns a
  // farm is offered it before creating a new one. The result is keyed by the
  // address it was fetched for, so a stale lookup is never shown.
  const [nftLookup, setNftLookup] = useState<{
    address: string;
    tokenIds: number[];
  }>();
  const [createNewFarmFor, setCreateNewFarmFor] = useState<string>();

  const nftTokenIds = !hasWallet
    ? []
    : nftLookup?.address === address
      ? nftLookup.tokenIds
      : undefined;
  const createNewFarm = createNewFarmFor === address;

  useEffect(() => {
    if (!hasWallet) return;

    let settled = false;
    const settle = (tokenIds: number[]) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      setNftLookup({ address, tokenIds });
    };

    // A slow or failed lookup must never block signup: fall back to the
    // regular page, where "I already have a farm" runs its own search.
    const timer = setTimeout(() => settle([]), NFT_LOOKUP_TIMEOUT_MS);

    getFarms(address as `0x${string}`)
      .then((farms) => settle(farms.map((farm) => Number(farm.tokenId))))
      .catch(() => settle([]));

    return () => {
      settled = true;
      clearTimeout(timer);
    };
  }, [address, hasWallet]);

  const handleCreateFarm = () => {
    if (!referralId) {
      setShowEmptyReferralModal(true);
    } else {
      setShowBumpkinModal(true);
    }
  };
  const handleBumpkinSave = (equipment: BumpkinParts) => {
    setShowBumpkinModal(false);
    authService.send({
      type: "CREATE_FARM",
      equipment,
    } as CreateFarmEvent);
  };

  const validationStateStrings: Record<ValidationState, string> = {
    notFound: t("noaccount.referralCodeNotFound"),
    checking: t("noaccount.referralCodeChecking"),
    valid: t("noaccount.referralCodeValid"),
    error: t("noaccount.referralCodeError"),
  };

  const { current: debouncedCheckRef } = useRef(
    debounce(async (token: string, referralCode: string) => {
      setValidationState("checking");
      const result = await checkReferralCode({ token, referralCode });
      const { success } = result;
      try {
        if (!success) {
          setValidationState("notFound");
        } else {
          setValidationState("valid");
        }
      } catch {
        setValidationState("error");
      }
    }, 300),
  );

  const handleCheckReferralCode = useCallback(
    (token: string, referralCode: string) => {
      debouncedCheckRef(token, referralCode);
    },
    [debouncedCheckRef],
  );

  if (showReferralId) {
    return (
      <>
        <div className="p-2">
          <TextInput
            placeholder={t("reward.referral.code")}
            value={referralId}
            onValueChange={(value) => {
              setReferralId(value);
              handleCheckReferralCode(
                authState.context.user.rawToken as string,
                value,
              );
            }}
          />
          {validationState && (
            <Label
              type={
                validationState === "notFound"
                  ? "danger"
                  : validationState === "valid"
                    ? "success"
                    : "default"
              }
              secondaryIcon={
                validationState === "notFound"
                  ? SUNNYSIDE.icons.cancel
                  : validationState === "valid"
                    ? SUNNYSIDE.icons.confirm
                    : undefined
              }
              className="mt-2"
            >
              {validationStateStrings[validationState]}
            </Label>
          )}
        </div>
        <div className="flex space-x-1">
          <Button
            onClick={() => {
              setShowReferralId(false);
              setReferralId("");
              setValidationState(undefined);
            }}
          >
            {t("back")}
          </Button>
          <Button
            disabled={!referralId || validationState !== "valid"}
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
      <ClaimAccount
        onBack={() => setShowClaimAccount(false)}
        onClaim={(id) => authService.send("CLAIM", { id })}
      />
    );
  }

  if (showBumpkinModal) {
    return <SignupBumpkinEquip onSave={handleBumpkinSave} />;
  }

  if (nftTokenIds === undefined) {
    return <Loading />;
  }

  if (nftTokenIds.length > 0 && !createNewFarm) {
    return (
      <ClaimAccount
        tokenIds={nftTokenIds}
        message={t("noaccount.nftFarmsFound")}
        backLabel={t("noaccount.createNewFarm")}
        onBack={() => setCreateNewFarmFor(address)}
        onClaim={(id) => authService.send("CLAIM", { id })}
      />
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
          {hasWallet && (
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
          setShowEmptyReferralModal(false);
          setShowBumpkinModal(true);
        }}
        confirmButtonLabel={"Yes I'm sure"}
      />
    </>
  );
};

export const ClaimAccount: React.FC<{
  onClaim: (id: number) => void;
  onBack: () => void;
  /** Farm NFT ids already loaded by the parent; skips the on-chain lookup */
  tokenIds?: number[];
  message?: string;
  backLabel?: string;
}> = ({ onBack, onClaim, tokenIds: preloadedTokenIds, message, backLabel }) => {
  const { authService } = useContext(Context);
  const [authState] = useActor(authService);

  const [isLoading, setIsLoading] = useState(false);
  const [loadedTokenIds, setLoadedTokenIds] = useState<number[]>([]);
  const { t } = useAppTranslation();

  const tokenIds = preloadedTokenIds ?? loadedTokenIds;

  useEffect(() => {
    if (preloadedTokenIds) return;

    const load = async () => {
      setIsLoading(true);

      const farms = await getFarms(
        authState.context.user.token?.address as `0x${string}`,
      );

      const ids = farms.map((farm) => Number(farm.tokenId));

      setLoadedTokenIds(ids);

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
        <p className="m-1 text-sm">{message ?? t("noaccount.selectNFTID")}</p>
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
      <Button onClick={onBack}>{backLabel ?? t("back")}</Button>
    </>
  );
};
