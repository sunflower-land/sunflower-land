import classNames from "classnames";
import React, { type JSX } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { NPCPlaceable } from "features/island/bumpkin/components/NPC";
import type { NPCParts } from "features/island/bumpkin/components/NPC";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  wideLayout?: boolean;
  equipped: Partial<NPCParts> | undefined;
  actionView?: JSX.Element;
}

export const FarmHandDetails: React.FC<Props> = ({
  wideLayout = false,
  equipped,
  actionView,
}) => {
  const { t } = useAppTranslation();

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col justify-center px-1 py-0">
        <div
          className={classNames(
            "flex mb-1 space-x-2 justify-start items-center",
            {
              "sm:flex-col-reverse md:space-x-0": !wideLayout,
            },
          )}
        >
          {equipped && (
            <div
              className={classNames("relative flex justify-center", {
                "sm:mt-2": !wideLayout,
              })}
              style={{
                width: `${PIXEL_SCALE * 15}px`,
                height: `${PIXEL_SCALE * 15 * 2}px`,
              }}
            >
              <NPCPlaceable parts={equipped} />
            </div>
          )}
          <span className="text-center">{t("farmHand")}</span>
        </div>
      </div>
      {actionView}
    </div>
  );
};
