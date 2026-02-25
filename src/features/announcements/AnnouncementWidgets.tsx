import React, { useContext, useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  pixelGreenBorderStyle,
  pixelVibrantBorderStyle,
} from "features/game/lib/style";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import { ModalContext } from "features/game/components/modal/ModalProvider";

export const BuyGemsWidget: React.FC = () => {
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
        background: "#3e8948",
        color: "#ffffff",
        ...pixelGreenBorderStyle,
      }}
    >
      <img src={ITEM_DETAILS.Gem.image} className="w-8 mr-2" />
      <div>
        <p className="text-xs flex-1">{t("announcement.flowerGemsDiscount")}</p>
        <a
          href={
            "https://docs.sunflower-land.com/getting-started/usdflower-erc20"
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
};

export const ReferralWidget: React.FC = () => {
  const [showMessage, setShowMessage] = useState(true);
  const { openModal } = useContext(ModalContext);

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
          onClick={() => openModal("REFERRAL")}
        >
          {t("read.more")}
        </p>
      </div>
      <img
        src={SUNNYSIDE.icons.close}
        className="absolute right-2 top-1 w-5 cursor-pointer"
        onClick={() => setShowMessage(false)}
      />
    </div>
  );
};
