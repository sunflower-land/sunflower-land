import React, { type PropsWithChildren, useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { Label, type LabelType } from "components/ui/Label";
import { ButtonPanel } from "components/ui/Panel";
import walletIcon from "assets/icons/wallet.png";
import fslIcon from "assets/icons/fsl_id.svg";
import { SUNNYSIDE } from "assets/sunnyside";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { TranslationKeys } from "lib/i18n/dictionaries/types";
import { Context as GameContext } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { maskEmail } from "lib/utils/maskEmail";
import { connectToFSL } from "features/auth/actions/oauth";
import type { ContentComponentProps } from "../types";

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
const _twitter = (state: MachineState) => state.context.state.twitter;
const _telegram = (state: MachineState) => state.context.state.telegram;
const _discordState = (state: MachineState) => state.context.state.discord;
const _fslId = (state: MachineState) => state.context.fslId;
const _oauthNonce = (state: MachineState) => state.context.oauthNonce;

const maskWalletAddress = (address: string): string => {
  if (address.length <= 10) return address;

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

type RowStatus = "linked" | "notLinked" | "linking" | "failed" | "partial";

const PILL: Record<RowStatus, { type: LabelType; key: TranslationKeys }> = {
  linked: { type: "success", key: "linkedAccounts.linked" },
  notLinked: { type: "default", key: "linkedAccounts.notLinked" },
  linking: { type: "warning", key: "linkedAccounts.linking" },
  failed: { type: "danger", key: "linkedAccounts.failedPill" },
  partial: { type: "warning", key: "linkedAccounts.partialPill" },
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
  /** Optional click handler bound to the subtext only (stops propagation). Used for click-to-reveal. */
  onSubtextClick?: () => void;
  subtextTitle?: string;
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
  onSubtextClick,
  subtextTitle,
}) => {
  const { t } = useAppTranslation();
  const disabled =
    status === "linking" || (status === "linked" && !clickableWhenLinked);
  const pill = PILL[status];
  // Show the manage-chevron whenever the row is clickable post-link —
  // both the fully-linked "manage" path and the partial-setup
  // "continue setup" path benefit from the affordance.
  const showManageHint =
    (status === "linked" && clickableWhenLinked) || status === "partial";

  return (
    <ButtonPanel variant="card" onClick={disabled ? undefined : onClick}>
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

      {(subtext || showManageHint) && (
        <div className="flex items-center justify-between gap-2 mt-1">
          <p
            className={`text-xs break-all ml-1 ${
              onSubtextClick ? "cursor-pointer" : ""
            }`}
            onClick={
              onSubtextClick
                ? (e) => {
                    e.stopPropagation();
                    onSubtextClick();
                  }
                : undefined
            }
            title={subtextTitle}
          >
            {subtext}
          </p>
          {showManageHint && (
            <img
              src={SUNNYSIDE.icons.chevron_right}
              alt=""
              className="w-3 mr-1 shrink-0"
            />
          )}
        </div>
      )}
    </ButtonPanel>
  );
};

const SectionHeader: React.FC<PropsWithChildren> = ({ children }) => (
  <Label type="default">{children}</Label>
);

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
  const twitter = useSelector(gameService, _twitter);
  const telegram = useSelector(gameService, _telegram);
  const discordState = useSelector(gameService, _discordState);
  const fslId = useSelector(gameService, _fslId);
  const oauthNonce = useSelector(gameService, _oauthNonce);

  const [revealWallet, setRevealWallet] = useState(false);

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

  // X (Twitter): three sub-steps — OAuth (isAuthorised) → follow → first
  // verified post. Treat fully-set-up only after all three; OAuth-only or
  // followed-only counts as partial so the row keeps a "more to do" hint.
  const twitterStatus: RowStatus = !twitter?.isAuthorised
    ? "notLinked"
    : twitter.followedAt && twitter.verifiedPostsAt
      ? "linked"
      : "partial";

  // Telegram: linkedAt → startedAt (bot) → joinedAt (channel). joinedAt
  // is the BE-confirmed completion signal, so anything before that is
  // partial.
  const telegramStatus: RowStatus = !telegram?.linkedAt
    ? "notLinked"
    : telegram.joinedAt
      ? "linked"
      : "partial";

  // Discord: `connected` is the OAuth handshake flag; `verified` flips
  // after the server confirms guild membership. The flag distinguishes
  // "connected but not on the official server" from "fully verified".
  // Use `connected` rather than the stale `discordId` so a stored ID
  // without an active connection isn't mis-shown as linked.
  const discordStatus: RowStatus = !discordState?.connected
    ? "notLinked"
    : discordState.verified
      ? "linked"
      : "partial";

  // FSL: one-shot link. Partner integration kept post-deprecation so
  // players who still have an FSL ID can claim the Morchi airdrop.
  // No partial/linking state — the SDK popup redirects the page on
  // success, so we only ever observe linked or not-linked.
  const fslStatus: RowStatus = fslId ? "linked" : "notLinked";

  const walletSubtext =
    walletStatus === "linked" && linkedWallet
      ? revealWallet
        ? linkedWallet
        : maskWalletAddress(linkedWallet)
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

  const twitterSubtext =
    twitterStatus === "notLinked"
      ? t("linkedAccounts.subtext.twitterNotLinked")
      : twitterStatus === "partial"
        ? t("linkedAccounts.subtext.twitterPartial")
        : t("linkedAccounts.rationale.twitter");

  const telegramSubtext =
    telegramStatus === "notLinked"
      ? t("linkedAccounts.subtext.telegramNotLinked")
      : telegramStatus === "partial"
        ? t("linkedAccounts.subtext.telegramPartial")
        : t("linkedAccounts.rationale.telegram");

  const discordSubtext =
    discordStatus === "notLinked"
      ? t("linkedAccounts.subtext.discordNotLinked")
      : discordStatus === "partial"
        ? t("linkedAccounts.subtext.discordPartial")
        : t("linkedAccounts.subtext.discordLinked");

  const fslSubtext = fslStatus === "linked" && fslId ? fslId : "";

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
    <div className="flex flex-col gap-1 overflow-auto max-h-[400px] scrollable">
      <p className="text-xs mx-1">{t("linkedAccounts.description")}</p>

      <Label type="warning">{t(warningKey)}</Label>

      <SectionHeader>{t("linkedAccounts.sectionLogin")}</SectionHeader>

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
        onSubtextClick={
          walletStatus === "linked" && linkedWallet
            ? () => setRevealWallet((prev) => !prev)
            : undefined
        }
        subtextTitle={
          walletStatus === "linked" && linkedWallet
            ? t(
                revealWallet
                  ? "linkedAccounts.hideWallet"
                  : "linkedAccounts.revealWallet",
              )
            : undefined
        }
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

      <SectionHeader>{t("linkedAccounts.sectionSocial")}</SectionHeader>

      <ProviderRow
        icon={SUNNYSIDE.icons.discord}
        title={t("linkedAccounts.discord")}
        role={{ type: "chill", key: "linkedAccounts.role.recommended" }}
        rationale={t("linkedAccounts.rationale.discord")}
        status={discordStatus}
        subtext={discordSubtext}
        clickableWhenLinked
        onClick={() => onSubMenuClick("linkAccountDiscord")}
      />

      <ProviderRow
        icon={SUNNYSIDE.icons.x}
        title={t("linkedAccounts.twitter")}
        role={{ type: "default", key: "linkedAccounts.role.rewards" }}
        rationale={t("linkedAccounts.rationale.twitter")}
        status={twitterStatus}
        subtext={twitterSubtext}
        clickableWhenLinked
        onClick={() => onSubMenuClick("linkAccountTwitter")}
      />

      <ProviderRow
        icon={SUNNYSIDE.icons.telegram}
        title={t("linkedAccounts.telegram")}
        role={{ type: "default", key: "linkedAccounts.role.community" }}
        rationale={t("linkedAccounts.rationale.telegram")}
        status={telegramStatus}
        subtext={telegramSubtext}
        clickableWhenLinked
        onClick={() => onSubMenuClick("linkAccountTelegram")}
      />

      <ProviderRow
        icon={fslIcon}
        title={t("linkedAccounts.fsl")}
        role={{ type: "default", key: "linkedAccounts.role.partner" }}
        rationale={t("linkedAccounts.rationale.fsl")}
        status={fslStatus}
        subtext={fslSubtext}
        onClick={() => connectToFSL({ nonce: oauthNonce })}
      />
    </div>
  );
};
