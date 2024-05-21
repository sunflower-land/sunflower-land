import { useSelector } from "@xstate/react";
import { Box } from "components/ui/Box";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useEffect, useRef } from "react";

interface Props {
  icon: string;
  options: { name: InventoryItemName; icon?: InventoryItemName }[];
  onClose: () => void;
  onSelected?: (name: InventoryItemName) => void;
}

const selectInventory = (state: MachineState) => state.context.state.inventory;

export const QuickSelect: React.FC<Props> = ({
  icon,
  options,
  onClose,
  onSelected,
}) => {
  const { gameService, selectedItem, shortcutItem } = useContext(Context);
  const ref = useRef<HTMLDivElement>(null); // Create a ref to the component
  const inventory = useSelector(gameService, selectInventory);

  const { t } = useAppTranslation();

  // Function to handle click events outside the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const select = (name: InventoryItemName) => {
    shortcutItem(name);

    if (onSelected) {
      onSelected(name);
    }
  };

  const available = options.filter((option) => inventory[option.name]?.gte(1));

  return (
    <div ref={ref} style={{ minWidth: "190px" }}>
      <InnerPanel>
        <Label className="absolute -top-3 left-4" type="default" icon={icon}>
          {t("quickSelect.label")}
        </Label>
        <div className="flex mt-1">
          {available.map(({ name, icon }) => (
            <Box
              key={name}
              count={inventory[name]}
              image={ITEM_DETAILS[name].image}
              secondaryImage={icon ? ITEM_DETAILS[icon].image : undefined}
              disabled={!inventory[name]?.gte(1)}
              onClick={() => select(name)}
              isSelected={selectedItem === name}
            />
          ))}
          {available.length === 0 && (
            <span className="text-xs p-0.5 pb-1">{t("quickSelect.empty")}</span>
          )}
        </div>
      </InnerPanel>
    </div>
  );
};
