import React from "react";
import classNames from "classnames";

import { SUNNYSIDE } from "assets/sunnyside";
import bwHeart from "assets/icons/bw_heart.png";
import { Button } from "components/ui/Button";
import { SquareIcon } from "components/ui/SquareIcon";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

type Props = {
  isFavorite: boolean;
  onToggle: () => void;
  className?: string;
  showLabel?: boolean;
};

export const FavoriteToggle: React.FC<Props> = ({
  isFavorite,
  onToggle,
  className,
  showLabel = false,
}) => {
  const { t } = useAppTranslation();
  const label = isFavorite
    ? t("marketplace.removeFromFavorites")
    : t("marketplace.addToFavorites");
  const visibleLabel = isFavorite
    ? t("marketplace.removeFromFavoriteIcon")
    : t("marketplace.addToFavoriteIcon");
  const icon = isFavorite ? SUNNYSIDE.icons.heart : bwHeart;
  const handleToggle = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    onToggle();
  };

  return (
    <div title={label} className={classNames("w-fit", className)}>
      <Button
        className={classNames(
          "h-8 rounded-none",
          showLabel ? "relative w-fit pr-5" : "w-8",
        )}
        aria-label={!showLabel ? label : undefined}
        onClick={handleToggle}
      >
        <div className="flex items-center justify-center gap-1">
          {!showLabel && (
            <img src={icon} alt="" className="h-4 w-4 object-contain" />
          )}
          {showLabel && (
            <>
              <span className="whitespace-nowrap text-xs">{visibleLabel}</span>
              <SquareIcon
                icon={icon}
                width={9}
                className="absolute top-1/2 -translate-y-1/2"
                style={{
                  height: "24px",
                  right: "-12px",
                }}
              />
            </>
          )}
        </div>
      </Button>
    </div>
  );
};
