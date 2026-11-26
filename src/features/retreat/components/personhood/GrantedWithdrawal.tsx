import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";
import { useConnection } from "wagmi";

import withdrawIcon from "assets/icons/withdraw.png";
import flowerIcon from "assets/icons/flower_token.webp";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { ITEM_IDS } from "features/game/types/bumpkin";
import type { LockedWithdrawal } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { GameWallet } from "features/wallet/Wallet";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getKeys } from "lib/object";
import { getImageUrl } from "lib/utils/getImageURLS";
import { useNow } from "lib/utils/hooks/useNow";
import { getPendingGrant, GRANT_TRANSACTION } from "./lib/lockedWithdrawal";

const _ban = (state: MachineState) => state.context.state.ban;
const _transaction = (state: MachineState) => state.context.state.transaction;
const _farmId = (state: MachineState) => state.context.farmId;
// The game machine only accepts TRANSACT while playing. Startup notifications
// (daily reward, VIP, season change…) are their own states with their own
// modals, so the popup waits for those to close instead of covering them and
// sending an event the machine would drop. Autosaving and transacting are
// brief stops on the way back to playing, so it stays up through them.
const _canShow = (state: MachineState) =>
  state.matches("playing") ||
  state.matches("autosaving") ||
  state.matches("transacting");
const _canTransact = (state: MachineState) => state.matches("playing");

/**
 * Shown to a locked farm that support has prepared a withdrawal for.
 *
 * It cannot be dismissed: it stays up until the player fires the withdrawal.
 * Once it is signed the game state carries the transaction and no grant, this
 * hides, and the usual transaction modal takes over.
 */
export const GrantedWithdrawal: React.FC = () => {
  const { gameService } = useContext(Context);
  const ban = useSelector(gameService, _ban);
  const transaction = useSelector(gameService, _transaction);
  const canShow = useSelector(gameService, _canShow);
  // A minute is plenty: it only hides the popup once the grant expires.
  const now = useNow({ live: true, intervalMs: 60_000 });

  const grant = getPendingGrant({ game: { ban, transaction }, now });

  if (!grant || !canShow) return null;

  return (
    <Modal show backdrop="static">
      <Panel>
        <GrantedWithdrawalContent grant={grant} />
      </Panel>
    </Modal>
  );
};

const GrantedWithdrawalContent: React.FC<{ grant: LockedWithdrawal }> = ({
  grant,
}) => {
  const { t } = useAppTranslation();
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="p-1">
      <Label type="default" icon={withdrawIcon} className="mb-1">
        {t("grantedWithdrawal.title")}
      </Label>
      <p className="text-xs mb-2">{t("grantedWithdrawal.description")}</p>

      <GrantedAssets grant={grant} />

      {!confirming && (
        <Button onClick={() => setConfirming(true)}>{t("withdraw")}</Button>
      )}

      {confirming && (
        <GameWallet
          action={grant.type === "flower" ? "withdrawFlower" : "withdrawItems"}
        >
          <ConfirmGrantedWithdrawal grant={grant} />
        </GameWallet>
      )}
    </div>
  );
};

const GrantedAssets: React.FC<{ grant: LockedWithdrawal }> = ({ grant }) => {
  if (grant.type === "flower") {
    return (
      <div className="flex flex-wrap mb-2">
        <Box image={flowerIcon} count={new Decimal(grant.flower)} />
      </div>
    );
  }

  if (grant.type === "wearables") {
    return (
      <div className="flex flex-wrap mb-2">
        {getKeys(grant.wearables).map((name) => (
          <Box
            key={name}
            image={getImageUrl(ITEM_IDS[name])}
            count={new Decimal(grant.wearables[name] ?? 0)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap mb-2">
      {getKeys(grant.items).map((name) => (
        <Box
          key={name}
          image={ITEM_DETAILS[name]?.image}
          count={new Decimal(grant.items[name] ?? 0)}
        />
      ))}
    </div>
  );
};

/**
 * Rendered inside `GameWallet`, so the player's linked wallet is connected by
 * the time they confirm. The API reads what to withdraw from the grant; only a
 * FLOWER withdrawal needs to say which chain.
 */
const ConfirmGrantedWithdrawal: React.FC<{ grant: LockedWithdrawal }> = ({
  grant,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const farmId = useSelector(gameService, _farmId);
  const canTransact = useSelector(gameService, _canTransact);
  const { chain } = useConnection();

  const needsChain = grant.type === "flower";
  const disabled = !canTransact || (needsChain && !chain);

  const withdraw = () => {
    if (disabled) return;

    gameService.send("TRANSACT", {
      transaction: GRANT_TRANSACTION[grant.type],
      request: {
        farmId,
        effect: {
          type: "lock.withdrawn",
          ...(needsChain && { chainId: chain?.id }),
        },
      },
    });
  };

  return (
    <Button disabled={disabled} onClick={withdraw}>
      {t("grantedWithdrawal.confirm")}
    </Button>
  );
};
