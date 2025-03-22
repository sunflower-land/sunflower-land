import React, { useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  pixelGrayBorderStyle,
  pixelGreenBorderStyle,
  pixelOrangeBorderStyle,
  pixelVibrantBorderStyle,
} from "features/game/lib/style";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import lockIcon from "assets/icons/lock.png";
import { ITEM_DETAILS } from "features/game/types/images";
import { hasFeatureAccess } from "lib/flags";
import { useGame } from "features/game/GameProvider";
import { Referral } from "features/island/hud/components/referral/Referral";

export const LockdownWidget: React.FC = () => {
  const [showMessage, setShowMessage] = useState(true);

  const { t } = useAppTranslation();

  if (!showMessage) {
    return null;
  }

  return (
    <div
      className={classNames(
        `w-full justify-center items-center flex  text-xs p-1 pr-4 mt-1 relative`,
      )}
      style={{
        background: "#c0cbdc",
        color: "#181425",
        ...pixelGrayBorderStyle,
      }}
    >
      <img src={lockIcon} className="w-8 mr-2" />
      <div>
        <p className="text-xs flex-1">{t("announcement.lockdown")}</p>

        <a
          href={
            "https://docs.sunflower-land.com/getting-started/usdflower-erc20/schedule#the-lockdown"
          }
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-xxs pb-1 pt-0.5 hover:text-blue-500 mb-2"
        >
          {t("read.more")}
        </a>
      </div>
      <img
        src={SUNNYSIDE.icons.close}
        className="absolute right-2 top-1 w-5 cursor-pointer"
        onClick={() => setShowMessage(false)}
      />
    </div>
  );
};

export const BuyGemsWidget: React.FC = () => {
  const [showMessage, setShowMessage] = useState(true);

  const { t } = useAppTranslation();

  const { gameState } = useGame();

  if (!showMessage) {
    return null;
  }

  if (hasFeatureAccess(gameState.context.state, "FLOWER_GEMS")) {
    return (
      <div
        className={classNames(
          `w-full items-center flex  text-xs p-1 pr-4 mt-1 relative`,
        )}
        style={{
          background: "#3e8948",
          color: "#ffffff",
          ...pixelGreenBorderStyle,
        }}
      >
        <img src={ITEM_DETAILS.Gem.image} className="w-8 mr-2" />
        <div>
          <p className="text-xs flex-1">
            {t("announcement.flowerGemsDiscount")}
          </p>
          <a
            href={
              "https://docs.sunflower-land.com/getting-started/usdflower-erc20/schedule#usdflower-x-gems"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-xxs pb-1 pt-0.5 hover:text-blue-500 mb-2 text-white"
          >
            {t("read.more")}
          </a>
        </div>
        <img
          src={SUNNYSIDE.icons.close}
          className="absolute right-2 top-1 w-5 cursor-pointer"
          onClick={() => setShowMessage(false)}
        />
      </div>
    );
  }

  return (
    <div
      className={classNames(
        `w-full items-center flex  text-xs p-1 pr-4 mt-1 relative`,
      )}
      style={{
        background: "#f09100",
        color: "#3e2731",
        ...pixelOrangeBorderStyle,
      }}
    >
      <img src={ITEM_DETAILS.Gem.image} className="w-8 mr-2" />
      <div>
        <p className="text-xs flex-1">{t("announcement.flowerGems")}</p>
        <a
          href={
            "https://docs.sunflower-land.com/getting-started/usdflower-erc20/schedule#usdflower-x-gems"
          }
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-xxs pb-1 pt-0.5 hover:text-blue-500 mb-2"
        >
          {t("read.more")}
        </a>
      </div>
      <img
        src={SUNNYSIDE.icons.close}
        className="absolute right-2 top-1 w-5 cursor-pointer"
        onClick={() => setShowMessage(false)}
      />
    </div>
  );
};

export const GaslessWidget: React.FC = () => {
  const [showMessage, setShowMessage] = useState(true);

  const { t } = useAppTranslation();

  if (!showMessage) {
    return null;
  }

  return (
    <div
      className={classNames(
        `w-full items-center flex  text-xs p-1 pr-4 mt-1 relative`,
      )}
      style={{
        background: "#f09100",
        color: "#3e2731",
        ...pixelOrangeBorderStyle,
      }}
    >
      <img src={SUNNYSIDE.icons.heart} className="w-8 mr-2" />
      <div>
        <p className="text-xs flex-1">{t("announcement.gasless")}</p>
        <a
          href={
            "https://docs.sunflower-land.com/getting-started/usdflower-erc20/schedule#usdflower-in-game"
          }
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-xxs pb-1 pt-0.5 hover:text-blue-500 mb-2"
        >
          {t("read.more")}
        </a>
      </div>
      <img
        src={SUNNYSIDE.icons.close}
        className="absolute right-2 top-1 w-5 cursor-pointer"
        onClick={() => setShowMessage(false)}
      />
    </div>
  );
};

export const ReferralWidget: React.FC = () => {
  const [showMessage, setShowMessage] = useState(true);
  const [showReferralModal, setShowReferralModal] = useState(false);

  const { t } = useAppTranslation();

  if (!showMessage) {
    return null;
  }

  return (
    <div
      className={classNames(
        `w-full items-center flex  text-xs p-1 pr-4 mt-1 relative`,
      )}
      style={{
        background: "#b65389",
        color: "#ffffff",
        ...pixelVibrantBorderStyle,
      }}
    >
      <img src={SUNNYSIDE.icons.lightning} className="w-5 mr-2" />
      <div>
        <p className="text-xs flex-1">{t("announcement.referral")}</p>
        <p
          className="underline text-xxs pb-1 pt-0.5 hover:text-blue-500 mb-2"
          onClick={() => setShowReferralModal(true)}
        >
          {t("read.more")}
        </p>
      </div>
      <img
        src={SUNNYSIDE.icons.close}
        className="absolute right-2 top-1 w-5 cursor-pointer"
        onClick={() => setShowMessage(false)}
      />
      <Referral
        show={showReferralModal}
        onHide={() => setShowReferralModal(false)}
      />
    </div>
  );
};
