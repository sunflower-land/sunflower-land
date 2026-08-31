import React from "react";

import coinsIcon from "assets/icons/coins.webp";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onBuy: () => void;
  onSell: () => void;
  onGuide: () => void;
  onUpgrade: () => void;
}

const DISC_WIDTH = PIXEL_SCALE * 18;
const DISC_HEIGHT = PIXEL_SCALE * 19;
const ACTION_ICON_WIDTH = PIXEL_SCALE * 9;

export const AnimalBuildingActions: React.FC<Props> = ({
  onBuy,
  onSell,
  onGuide,
  onUpgrade,
}) => {
  const { t } = useAppTranslation();
  const actions = [
    { label: t("buy"), icon: coinsIcon, onClick: onBuy },
    { label: t("sell"), icon: SUNNYSIDE.icons.death, onClick: onSell },
    {
      label: t("guide"),
      icon: SUNNYSIDE.icons.expression_confused,
      onClick: onGuide,
    },
  ];

  return (
    <>
      <button
        type="button"
        aria-label={t("upgrade")}
        className="absolute z-30 cursor-pointer border-0 bg-transparent p-0 hover:img-highlight"
        style={{
          width: `${DISC_WIDTH}px`,
          height: `${DISC_HEIGHT}px`,
          left: `${PIXEL_SCALE * 9}px`,
          top: `${PIXEL_SCALE * -20}px`,
        }}
        onClick={onUpgrade}
      >
        <img className="w-full" src={SUNNYSIDE.icons.upgrade_disc} alt="" />
      </button>

      <div
        className="absolute z-30 flex"
        style={{
          gap: `${PIXEL_SCALE}px`,
          right: `${PIXEL_SCALE * -5}px`,
          top: `${PIXEL_SCALE * -20}px`,
        }}
      >
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            aria-label={action.label}
            className="relative cursor-pointer border-0 bg-transparent p-0 hover:img-highlight"
            style={{ width: `${DISC_WIDTH}px`, height: `${DISC_HEIGHT}px` }}
            onClick={action.onClick}
          >
            <img className="w-full" src={SUNNYSIDE.icons.disc} alt="" />
            <img
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              src={action.icon}
              alt=""
              style={{ width: `${ACTION_ICON_WIDTH}px` }}
            />
          </button>
        ))}
      </div>
    </>
  );
};
