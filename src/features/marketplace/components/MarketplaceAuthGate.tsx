import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { useConnections, useDisconnect } from "wagmi";

import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { Loading } from "features/auth/components";
import { GameWallet } from "features/wallet/Wallet";
import { SignMessageBody } from "features/wallet/components/SignMessage";

import { Context as AuthContext } from "features/auth/lib/Provider";
import { Context as GameContext } from "features/game/GameProvider";

import { isGoogleToken } from "features/auth/lib/isGoogleUser";
import {
  upgradeJwt,
  UpgradeJwtError,
  UpgradeJwtFailure,
} from "features/auth/actions/upgradeJwt";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { MachineState } from "features/game/lib/gameMachine";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { randomID } from "lib/utils/random";
import walletIcon from "assets/icons/wallet.png";

const _token = (s: AuthMachineState) => s.context.user.token;
const _rawToken = (s: AuthMachineState) => s.context.user.rawToken;
const _linkedWallet = (s: MachineState) => s.context.linkedWallet;

type Status =
  | { kind: "idle" }
  | { kind: "verifying" }
  | { kind: "error"; code: UpgradeJwtError | "UNKNOWN" };

type Props = {
  onProceed: (authToken: string) => void;
  onCancel: () => void;
};

/**
 * Step-up auth panel for marketplace actions. Asks a Google-authed
 * player with a `linkedWallet` to sign a message that upgrades their
 * JWT from `address: google:…` to `address: 0x…`. Subsequent actions in
 * the session reuse the upgraded JWT and bypass.
 *
 * Wraps `SignMessageBody` inside `<GameWallet action="marketplaceStepUp">`
 * so the standard wallet UX kicks in: wallet picker, connection state,
 * wrong-wallet detection (SelectLinkedWallet) if the connected wallet
 * doesn't match `farm.linkedWallet`. Mirrors the LinkGoogle pattern
 * (commit eef1da40f) so behavior is consistent across the app.
 *
 * Callers consult [[useNeedsMarketplaceStepUp]] to know when to mount
 * this component at all:
 *   - wallet-authed user (no `google:` prefix) → no step-up needed
 *   - Google user with NO `linkedWallet` → offchain trades stay open as
 *     today; onchain trades are blocked separately by `<GameWallet>` /
 *     the BE's `linkedWallet` checks
 */
export const MarketplaceAuthGate: React.FC<Props> = ({
  onProceed,
  onCancel,
}) => {
  const { authService } = useContext(AuthContext);
  const { t } = useAppTranslation();

  const rawToken = useSelector(authService, _rawToken);

  const { mutate: disconnect } = useDisconnect();
  const connections = useConnections();

  const onDisconnect = () => {
    disconnect();
    connections.forEach((connection) =>
      disconnect({ connector: connection.connector }),
    );
  };

  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const handleSignMessage = async ({
    address,
    signature,
  }: {
    address: string;
    signature: string;
  }) => {
    setStatus({ kind: "verifying" });
    try {
      const { token: newToken } = await upgradeJwt({
        authToken: rawToken as string,
        address,
        signature,
        transactionId: randomID(),
      });
      authService.send("UPDATE_TOKEN", { token: newToken });
      setStatus({ kind: "idle" });
      onProceed(newToken);
    } catch (e) {
      const code =
        e instanceof UpgradeJwtFailure ? e.code : ("UNKNOWN" as const);
      setStatus({ kind: "error", code });
    }
  };

  if (status.kind === "verifying") {
    return <Loading text={t("marketplace.stepUp.verifying")} />;
  }

  if (status.kind === "error") {
    return (
      <ErrorView
        code={status.code}
        onRetry={() => setStatus({ kind: "idle" })}
        onClose={onCancel}
      />
    );
  }

  return (
    <>
      <Label className="ml-2 mt-1 mb-2" icon={walletIcon} type="default">
        {t("marketplace.stepUp.title")}
      </Label>
      <p className="text-xs mx-1 mb-2">{t("marketplace.stepUp.body")}</p>
      <GameWallet action="marketplaceStepUp">
        <SignMessageBody
          onSignMessage={handleSignMessage}
          onDisconnect={onDisconnect}
        />
      </GameWallet>
    </>
  );
};

/**
 * Returns whether the current player needs a JWT step-up before
 * marketplace actions. Drives the parent's "gate or dispatch directly?"
 * branch so the gate component itself stays single-purpose and doesn't
 * fan out a render-time bypass via an effect.
 */
export function useNeedsMarketplaceStepUp(): boolean {
  const { authService } = useContext(AuthContext);
  const { gameService } = useContext(GameContext);

  const token = useSelector(authService, _token);
  const linkedWallet = useSelector(gameService, _linkedWallet);

  return isGoogleToken(token) && !!linkedWallet;
}

const ErrorView: React.FC<{
  code: UpgradeJwtError | "UNKNOWN";
  onRetry: () => void;
  onClose: () => void;
}> = ({ code, onRetry, onClose }) => {
  const { t } = useAppTranslation();
  const message =
    code === UpgradeJwtError.WALLET_MISMATCH
      ? t("marketplace.stepUp.error.walletMismatch")
      : code === UpgradeJwtError.INVALID_SIGNATURE
        ? t("marketplace.stepUp.error.invalidSignature")
        : code === UpgradeJwtError.NO_LINKED_WALLET
          ? t("marketplace.stepUp.error.noLinkedWallet")
          : t("marketplace.stepUp.error.unknown");

  return (
    <div className="p-2 space-y-2">
      <Label type="danger" className="-ml-1 mb-2">
        {t("marketplace.stepUp.error.title")}
      </Label>
      <p className="text-xs mb-2">{message}</p>
      <div className="flex gap-1">
        <Button onClick={onClose}>{t("close")}</Button>
        <Button onClick={onRetry}>{t("retry")}</Button>
      </div>
    </div>
  );
};
