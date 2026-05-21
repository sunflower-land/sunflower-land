import React, { useContext } from "react";
import { useSelector } from "@xstate/react";

import { Label, LabelType } from "components/ui/Label";
import { ButtonPanel } from "components/ui/Panel";
import walletIcon from "assets/icons/wallet.png";
import { SUNNYSIDE } from "assets/sunnyside";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { TranslationKeys } from "lib/i18n/dictionaries/types";
import { Context as GameContext } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { ContentComponentProps } from "../GameOptions";

const _linkedWallet = (state: MachineState) => state.context.linkedWallet;
const _socialDetails = (state: MachineState) => state.context.socialDetails;
const _linkingWallet = (state: MachineState) =>
  state.matches("linkingWallet") || state.matches("linkingWalletSuccess");
const _linkingWalletFailed = (state: MachineState) =>
  state.matches("linkingWalletFailed");
const _linkingSocial = (state: MachineState) =>
  state.matches("linkingSocial") || state.matches("linkingSocialSuccess");
const _linkingSocialFailed = (state: MachineState) =>
  state.matches("linkingSocialFailed");

const maskWalletAddress = (address: string): string => {
  if (address.length <= 10) return address;

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const maskEmail = (email: string): string => {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visibleLocal = local.slice(0, Math.min(2, local.length));
  const localMask = "*".repeat(Math.max(3, local.length - visibleLocal.length));
  const tld = domain.includes(".") ? domain.slice(domain.lastIndexOf(".")) : "";
  const domainBody = tld ? domain.slice(0, -tld.length) : domain;
  const domainMask = "*".repeat(Math.max(3, domainBody.length));
  return `${visibleLocal}${localMask}@${domainMask}${tld}`;
};

type RowStatus = "linked" | "notLinked" | "linking" | "failed";

const PILL: Record<RowStatus, { type: LabelType; key: TranslationKeys }> = {
  linked: { type: "success", key: "linkedAccounts.linked" },
  notLinked: { type: "default", key: "linkedAccounts.notLinked" },
  linking: { type: "warning", key: "linkedAccounts.linking" },
  failed: { type: "danger", key: "linkedAccounts.failedPill" },
};

interface RowProps {
  icon: string;
  title: string;
  /** Short role/category badge shown next to the title — e.g. "Owner", "Sign-in". */
  role: { type: LabelType; key: TranslationKeys };
  /** Italic one-liner explaining what this provider does for the farm. */
  rationale: string;
  status: RowStatus;
  /** Status detail line — wallet address, masked email, or a "no X" placeholder. */
  subtext: string;
  onClick?: () => void;
  /** Allow the row to remain clickable when in the "linked" state — for providers that have a manage panel. */
  clickableWhenLinked?: boolean;
}

const ProviderRow: React.FC<RowProps> = ({
  icon,
  title,
  role,
  rationale,
  status,
  subtext,
  onClick,
  clickableWhenLinked,
}) => {
  const { t } = useAppTranslation();
  const disabled =
    status === "linking" || (status === "linked" && !clickableWhenLinked);
  const pill = PILL[status];
  const showManageHint = status === "linked" && clickableWhenLinked;

  return (
    <ButtonPanel
      variant="card"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 flex-wrap">
          <Label type="default" icon={icon}>
            {title}
          </Label>
          <Label type={role.type}>{t(role.key)}</Label>
        </div>
        <Label type={pill.type}>{t(pill.key)}</Label>
      </div>

      <p className="text-xs italic mt-1 ml-1 opacity-75">{rationale}</p>

      <div className="flex items-center justify-between gap-2 mt-1">
        <p className="text-xs break-all ml-1">{subtext}</p>
        {showManageHint && (
          <img
            src={SUNNYSIDE.icons.chevron_right}
            alt=""
            className="w-3 mr-1 shrink-0"
          />
        )}
      </div>
    </ButtonPanel>
  );
};

export const LinkedAccounts: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(GameContext);

  const linkedWallet = useSelector(gameService, _linkedWallet);
  const socialDetails = useSelector(gameService, _socialDetails);
  const linkingWallet = useSelector(gameService, _linkingWallet);
  const linkingWalletFailed = useSelector(gameService, _linkingWalletFailed);
  const linkingSocial = useSelector(gameService, _linkingSocial);
  const linkingSocialFailed = useSelector(gameService, _linkingSocialFailed);

  const walletStatus: RowStatus = linkingWallet
    ? "linking"
    : linkingWalletFailed
      ? "failed"
      : linkedWallet
        ? "linked"
        : "notLinked";

  const googleStatus: RowStatus = linkingSocial
    ? "linking"
    : linkingSocialFailed
      ? "failed"
      : socialDetails?.email
        ? "linked"
        : "notLinked";

  const walletSubtext =
    walletStatus === "linked" && linkedWallet
      ? maskWalletAddress(linkedWallet)
      : walletStatus === "linking"
        ? t("linkedAccounts.waitingForWallet")
        : walletStatus === "failed"
          ? t("linkedAccounts.linkFailed")
          : t("linkedAccounts.noWallet");

  const googleSubtext =
    googleStatus === "linked" && socialDetails?.email
      ? maskEmail(socialDetails.email)
      : googleStatus === "linking"
        ? t("linkedAccounts.waitingForGoogle")
        : googleStatus === "failed"
          ? t("linkedAccounts.signInCancelled")
          : t("linkedAccounts.noGoogle");

  // Wireframe: the warning copy depends on whether the wallet is the
  // active owner of the NFT or merely the future owner. Wallet linked
  // → emphasise NFT ownership being on the wallet. Wallet not linked
  // → emphasise that linking later cements ownership.
  const warningKey: TranslationKeys =
    walletStatus === "linked"
      ? "linkedAccounts.warning.walletLinked"
      : "linkedAccounts.warning.walletNotLinked";

  // Wallet rationale shifts with link status — "holds" vs "will hold".
  const walletRationale =
    walletStatus === "linked"
      ? t("linkedAccounts.rationale.walletLinked")
      : t("linkedAccounts.rationale.walletNotLinked");

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs mx-1">{t("linkedAccounts.description")}</p>

      <Label type="warning">{t(warningKey)}</Label>

      <ProviderRow
        icon={walletIcon}
        title={t("linkedAccounts.wallet")}
        role={{
          type: walletStatus === "linked" ? "warning" : "chill",
          key:
            walletStatus === "linked"
              ? "linkedAccounts.role.owner"
              : "linkedAccounts.role.futureOwner",
        }}
        rationale={walletRationale}
        status={walletStatus}
        subtext={walletSubtext}
        onClick={() => onSubMenuClick("linkAccountWallet")}
      />

      <ProviderRow
        icon={SUNNYSIDE.icons.googleIcon}
        title={t("linkedAccounts.google")}
        role={{ type: "default", key: "linkedAccounts.role.signIn" }}
        rationale={t("linkedAccounts.rationale.google")}
        status={googleStatus}
        subtext={googleSubtext}
        clickableWhenLinked
        onClick={() =>
          onSubMenuClick(
            socialDetails?.email
              ? "linkAccountGoogleManage"
              : "linkAccountGoogle",
          )
        }
      />
    </div>
  );
};
