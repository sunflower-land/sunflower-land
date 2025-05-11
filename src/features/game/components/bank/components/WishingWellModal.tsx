import React from "react";
import { Modal } from "components/ui/Modal";

import { Button } from "components/ui/Button";
import { wallet } from "lib/blockchain/wallet";
import { fromWei } from "web3-utils";
import { shortAddress } from "lib/utils/shortAddress";
import classNames from "classnames";

import { WishingWellTokens } from "../../../../goblins/wishingWell/actions/loadWishingWell";
import { formatNumber } from "lib/utils/formatNumber";
import { SUNNYSIDE } from "assets/sunnyside";
import { translate } from "lib/i18n/translate";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import flowerIcon from "assets/icons/flower_token.webp";
import { CloseButtonPanel } from "../../CloseablePanel";
import { Merkl } from "../../modal/components/Merkl";

type GrantedArgs = Pick<WishingWellTokens, "lockedTime"> & {
  onClose: () => void;
  reward: string;
};

type GrantWishArgs = Pick<WishingWellTokens, "totalTokensInWell"> & {
  onClick?: () => void;
};

type ZeroTokensArgs = {
  onClick?: () => void;
};

type WaitingForWishArgs = Pick<WishingWellTokens, "lockedTime">;

type NoWishArgs = Pick<WishingWellTokens, "totalTokensInWell"> & {
  onClick: () => void;
  hasLPTokens: boolean;
};

const Granted = ({ lockedTime, onClose, reward }: GrantedArgs) => {
  const { t } = useAppTranslation();
  return (
    <>
      <div className="p-2">
        <div className="flex flex-col items-center mb-3">
          <h1 className="text-lg mb-4 text-center">{t("congrats")}</h1>
          <img src={flowerIcon} alt="sunflower token" className="w-16 mb-2" />
        </div>
        <p className="mb-4 text-sm">{t("wishingWell.wish.granted")}</p>
        <p className="mb-4 text-sm">
          {t("wishingWell.sflRewardsReceived", { reward: reward })}
        </p>
        <p className="mb-4 text-sm">{t("wishingWell.newWish")}</p>
        {lockedTime && (
          <p className="mb-2 text-sm">
            {t("wishingWell.wish.timeTillNextWish", {
              nextWishTime: lockedTime,
            })}
          </p>
        )}
      </div>
      <Button className="mr-1" onClick={onClose}>
        {t("close")}
      </Button>
    </>
  );
};

const GrantWish = ({ totalTokensInWell, onClick }: GrantWishArgs) => {
  const { t } = useAppTranslation();
  return (
    <>
      <div className="p-2">
        <div className="flex flex-col items-center mb-3">
          <h1 className="text-lg mb-4 text-center">
            {t("wishingWell.wish.grantTime")}
          </h1>
          <img
            src={SUNNYSIDE.building.wishingwell}
            alt="wishing well"
            className="w-16 mb-2"
          />
        </div>
        <p className="mb-4 text-sm">
          {t("statements.wishing.well.worthwell", {
            rewards: formatNumber(
              Number(fromWei(totalTokensInWell.toString())),
              { decimalPlaces: 4 },
            ),
          })}
        </p>
        <p className="mb-2 text-sm">{t("statements.wishing.well.lucky")}</p>
      </div>
      <div className="flex">
        <Button onClick={onClick}>{t("grant.wish")}</Button>
      </div>
    </>
  );
};

const ZeroTokens = ({ onClick }: ZeroTokensArgs) => {
  const { t } = useAppTranslation();
  return (
    <>
      <div className="p-2">
        <div className="flex flex-col items-center mb-3">
          <h1 className="text-lg mb-4 text-center">{t("uhOh")}</h1>
          <img
            src={SUNNYSIDE.npcs.goblinHead}
            alt="skeleton death"
            className="w-16 mb-2"
          />
        </div>
        <p className="mb-4 text-sm">{t("wishingWell.noReward")}</p>
        <p className="mb-2 text-sm">{t("wishingWell.wish.lucky")}</p>
      </div>
      <div className="flex">
        <Button className="whitespace-nowrap" onClick={onClick}>
          {t("grant.wish")}
        </Button>
      </div>
    </>
  );
};

const WaitingForWish = ({ lockedTime }: WaitingForWishArgs) => {
  const { t } = useAppTranslation();
  return (
    <>
      <div className="p-2">
        <div className="flex flex-col items-center mb-3">
          <h1 className="text-lg mb-4 text-center">
            {t("wishingWell.wish.made")}
          </h1>
          <img src={SUNNYSIDE.icons.timer} alt="timer" className="w-8 mb-2" />
        </div>
        <p className="mb-4 text-sm">
          {t("wishingWell.wish.comeBackAfter", {
            nextWishTime: lockedTime || "",
          })}
        </p>
        <p className="mb-4 text-sm">{t("wishingWell.wish.warning.one")}</p>
        <div className="flex items-center border-2 rounded-md border-black p-2 mb-2 bg-[#f77621]">
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            alt="alert"
            className="mr-2 w-6"
          />
          <span className="text-xs">{t("wishingWell.wish.warning.two")}</span>
        </div>
      </div>
    </>
  );
};

const NoWish = ({ totalTokensInWell, hasLPTokens, onClick }: NoWishArgs) => {
  const { t } = useAppTranslation();
  return (
    <>
      <div className="p-2">
        <div className="flex flex-col items-center mb-3">
          <h1 className="text-lg mb-2 text-center">{t("wishing.well")}</h1>
          <img
            src={SUNNYSIDE.building.wishingwell}
            alt="wishing well"
            className="w-16"
          />
        </div>
        <p className="mb-4 text-sm">{t("wishingWell.info.one")}</p>
        <p className="mb-4 text-sm">{t("wishingWell.info.two")}</p>
        <p className="mb-4 text-sm">
          {t("statements.wishing.well.worthwell", {
            rewards: formatNumber(
              Number(fromWei(totalTokensInWell.toString())),
              { decimalPlaces: 4 },
            ),
          })}
        </p>
        <div className="flex justify-center items-center mb-4">
          <img
            src={SUNNYSIDE.icons.player}
            alt="player address"
            className="w-6"
          />
          <span className="ml-2 font-secondary">
            {shortAddress(wallet.getAccount() as string)}
          </span>
        </div>
        {hasLPTokens ? (
          <p className="mb-2 text-sm">{t("wishingWell.info.three")}</p>
        ) : (
          <p className="mb-2 text-sm">
            {t("statements.wishing.well.look.like")}
          </p>
        )}
      </div>
      <div className="flex">
        <Button
          className={classNames(!hasLPTokens && "text-xs")}
          onClick={onClick}
        >
          {hasLPTokens ? translate("make.wish") : translate("add.liquidity")}
        </Button>
      </div>
    </>
  );
};

interface Props {
  onClose: () => void;
}
export const WishingWellModal: React.FC<Props> = ({ onClose }) => {
  return (
    <Modal show={true} onHide={onClose}>
      <CloseButtonPanel onClose={onClose} className="relative">
        <Merkl onClose={onClose} />
      </CloseButtonPanel>
    </Modal>
  );
};
