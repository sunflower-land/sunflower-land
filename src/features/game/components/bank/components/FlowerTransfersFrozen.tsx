import React from "react";

import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import flowerIcon from "assets/icons/flower_token.webp";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { flowerTransfersFrozenUntilLabel } from "../lib/flowerTransferFreeze";

interface Props {
  flow: "withdraw" | "deposit";
  /** Renders a back arrow when the caller has no header of its own. */
  onBack?: () => void;
}

/**
 * Shown in place of the FLOWER withdraw and deposit pages while
 * `areFlowerTransfersFrozen()` is true. See `../lib/flowerTransferFreeze.ts`.
 */
export const FlowerTransfersFrozen: React.FC<Props> = ({ flow, onBack }) => {
  const { t } = useAppTranslation();

  return (
    <>
      {onBack && (
        <div className="flex items-center ml-2 gap-3 my-2">
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className="w-6 cursor-pointer"
            alt="back"
            onClick={onBack}
          />
          <Label type="default" icon={flowerIcon}>
            {`FLOWER`}
          </Label>
        </div>
      )}

      <div className="flex flex-col items-center text-center p-1">
        <Label type="danger" icon={SUNNYSIDE.icons.lock} className="mb-2">
          {t("flowerTransfersFrozen.title")}
        </Label>

        <img
          src={SUNNYSIDE.npcs.goblin_hammering}
          alt=""
          className="w-1/2 mb-2"
        />

        <p className="text-xs mb-2">
          {flow === "withdraw"
            ? t("flowerTransfersFrozen.withdraw")
            : t("flowerTransfersFrozen.deposit")}
        </p>

        <p className="text-xs">
          {t("flowerTransfersFrozen.until", {
            date: flowerTransfersFrozenUntilLabel(),
          })}
        </p>
      </div>
    </>
  );
};
