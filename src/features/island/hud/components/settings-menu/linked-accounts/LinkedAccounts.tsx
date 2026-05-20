import React from "react";
import { useSelector } from "@xstate/react";

import { Label, LabelType } from "components/ui/Label";
import { ButtonPanel } from "components/ui/Panel";
import walletIcon from "assets/icons/wallet.png";
import { SUNNYSIDE } from "assets/sunnyside";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { TranslationKeys } from "lib/i18n/dictionaries/types";
import { useContext } from "react";
import { Context as GameContext } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { ContentComponentProps } from "../GameOptions";
import { hasFeatureAccess } from "lib/flags";

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
  status: RowStatus;
  subtext: string;
  onClick?: () => void;
}

const ProviderRow: React.FC<RowProps> = ({
  icon,
  title,
  status,
  subtext,
  onClick,
}) => {
  const { t } = useAppTranslation();
  const disabled = status === "linked" || status === "linking";
  const pill = PILL[status];

  return (
    <ButtonPanel
      variant="card"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex items-center justify-between gap-2">
        <Label type="default" icon={icon}>
          {title}
        </Label>
        <Label type={pill.type}>{t(pill.key)}</Label>
      </div>
      <p className="text-xs break-all mt-1 ml-1">{subtext}</p>
    </ButtonPanel>
  );
};

export const LinkedAccounts: React.FC<ContentComponentProps> = ({
  onSubMenuClick,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(GameContext);

  const hasLinkingAccess = useSelector(gameService, (state) =>
    hasFeatureAccess(state.context.state, "DUAL_LOGIN"),
  );

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
          ? t("linkedAccounts.linkFailed")
          : t("linkedAccounts.noGoogle");

  if (!hasLinkingAccess) {
    return (
      <div className="flex flex-col gap-2 items-center p-4">
        <Label type="default" className="ml-2">
          {t("linkedAccounts.linkAccounts")}
        </Label>
        <p className="text-sm text-center mt-2">
          {t("linkedAccounts.linkAccountsDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs mx-1">{t("linkedAccounts.description")}</p>

      <Label type="warning">{t("linkedAccounts.permanenceWarning")}</Label>

      <ProviderRow
        icon={walletIcon}
        title={t("linkedAccounts.wallet")}
        status={walletStatus}
        subtext={walletSubtext}
        onClick={() => onSubMenuClick("linkAccountWallet")}
      />

      <ProviderRow
        icon={SUNNYSIDE.icons.googleIcon}
        title={t("linkedAccounts.google")}
        status={googleStatus}
        subtext={googleSubtext}
        onClick={() => onSubMenuClick("linkAccountGoogle")}
      />
    </div>
  );
};
