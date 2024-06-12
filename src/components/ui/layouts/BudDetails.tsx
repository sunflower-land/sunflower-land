import classNames from "classnames";
import React from "react";
import { SquareIcon } from "../SquareIcon";
import { Bud } from "features/game/types/buds";
import { CONFIG } from "lib/config";
import { Label } from "../Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

/**
 * The props for the component.
 * @param wideLayout Whether to always use the wide layout for large screen or not.
 * @param budId Bud ID
 * @param actionView The view for displaying the item action.
 */
interface Props {
  wideLayout?: boolean;
  budId: number;
  bud: Bud;
  actionView?: JSX.Element;
}

const imageDomain = CONFIG.NETWORK === "mainnet" ? "buds" : "testnet-buds";

/**
 * The view for displaying item name, details, properties and action.
 * @props The component props.
 */
export const BudDetails: React.FC<Props> = ({
  wideLayout = false,
  budId,
  bud,
  actionView,
}: Props) => {
  const icon = `https://${imageDomain}.sunflower-land.com/images/${budId}.webp`;
  const title = `${bud.type} Bud`;
  const { t } = useAppTranslation();

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col justify-center px-1 py-0">
        <div
          className={classNames(
            "flex mb-1 space-x-2 justify-start items-center",
            {
              "sm:flex-col-reverse md:space-x-0": !wideLayout,
            }
          )}
        >
          {icon && (
            <div className={classNames("", { "sm:mt-2": !wideLayout })}>
              <SquareIcon
                icon={icon}
                width={14}
                className="scale-[1.8] origin-bottom"
              />
            </div>
          )}
          <span className={classNames("", { "sm:text-center": !wideLayout })}>
            {title}
          </span>
        </div>
        <div
          className={classNames(
            "border-t border-white w-full mb-2 pt-2 flex justify-between gap-x-3 gap-y-2 flex-wrap",
            { "sm:flex-col sm:items-center sm:flex-nowrap": !wideLayout }
          )}
        >
          <div className="flex flex-wrap">
            {Object.values(bud)
              // Filter out "No Aura" and "No Ears"
              .filter((property) => !String(property).startsWith("No "))
              .map((property, i) => (
                <Label
                  key={`bud-${i}`}
                  type="default"
                  className="whitespace-nowrap mr-2 mb-1"
                >
                  {property}
                </Label>
              ))}
          </div>
          <a
            href={`https://opensea.io/assets/matic/0x78a0cea8f323ff80985c5f9d1f9de18bb9e35996/${budId}`}
            className="underline text-xxs pb-1 pt-0.5 hover:text-blue-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("opensea")}
          </a>
        </div>
      </div>
      {actionView}
    </div>
  );
};
