import React from "react";
import { Transition } from "@headlessui/react";
import { InnerPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";

interface Props {
  show: boolean;
  className?: string;
  ingredients: InventoryItemName[];
  onClick: () => void;
  title?: string;
}

export const IngredientsPopover: React.FC<Props> = ({
  show,
  className,
  ingredients,
  onClick,
  title,
}) => {
  const { t } = useAppTranslation();

  if (ingredients.length === 0) return null;

  return (
    <Transition
      appear={true}
      id="ingredients-info-panel"
      show={show}
      enter="transition-opacity transition-transform duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      className={`flex absolute z-40 ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      as="div"
    >
      <InnerPanel className="drop-shadow-lg cursor-pointer max-w-md">
        <div className="flex flex-col mb-1">
          <div className="flex space-x-1 mb-1">
            <span className="text-xs whitespace-nowrap">
              {`${title ?? t("ingredients")}:`}
            </span>
          </div>
          <div className="space-y-1">
            {ingredients.map((ingredient) => (
              <div
                key={String(ingredient)}
                className="capitalize space-x-1 text-xs flex items-center"
              >
                <img
                  src={ITEM_DETAILS[ingredient].image}
                  alt={ingredient}
                  className="w-3"
                />
                <span className="text-xs">
                  {ITEM_DETAILS[ingredient].translatedName ?? ingredient}
                </span>
              </div>
            ))}
          </div>
        </div>
      </InnerPanel>
    </Transition>
  );
};
