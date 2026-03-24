import React from "react";
import classNames from "classnames";
import { ColorPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";

/** Inventory items that use the minigame currency disclaimer (extend when adding more). */
export const MINIGAME_CURRENCY_ITEM_NAMES = ["CluckCoin"] as const;

export type MinigameCurrencyItemName =
  (typeof MINIGAME_CURRENCY_ITEM_NAMES)[number];

export function showsMinigameCurrencyDisclaimer(
  name: string,
): name is MinigameCurrencyItemName {
  return (MINIGAME_CURRENCY_ITEM_NAMES as readonly string[]).includes(name);
}

type Props = {
  className?: string;
};

export const MinigameCurrencyDisclaimerPanel: React.FC<Props> = ({
  className,
}) => {
  const { t } = useAppTranslation();

  return (
    <ColorPanel
      type="vibrant"
      className={classNames("rounded-sm p-2", className)}
    >
      <div className="flex flex-row gap-2 items-start">
        <div className="shrink-0 scale-[0.9] origin-top-left">
          <NPCIcon parts={NPC_WEARABLES["pumpkin' pete"]} width={44} />
        </div>
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <p className="text-sm font-medium">
            {t("marketplace.cluckCoin.minigameName")}
          </p>
          <p className="text-xxs opacity-90">
            {t("marketplace.cluckCoin.builtBy")}
          </p>
          <p className="text-xxs leading-snug opacity-95">
            {t("marketplace.cluckCoin.disclaimer")}
          </p>
        </div>
      </div>
    </ColorPanel>
  );
};
