import PubSub from "pubsub-js";
import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useEffect, useRef } from "react";

interface Props {
  icon: string;
  options: { name: InventoryItemName; icon: InventoryItemName }[];
  onClose: () => void;
  onSelected?: (name: InventoryItemName) => void;
  type: string;
}

const selectInventory = (state: MachineState) => state.context.state.inventory;

export const QuickSelect: React.FC<Props> = ({
  icon,
  options,
  onClose,
  onSelected,
  type,
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
    if (onSelected) {
      onSelected(name);
    }
    shortcutItem(name);
  };

  const onOpenBasket = () => {
    PubSub.publish("OPEN_INVENTORY");
    onClose();
  };

  const available = options.filter((option) => inventory[option.name]?.gte(1));

  if (available.length === 0) {
    return (
      <div ref={ref}>
        <InnerPanel style={{ maxWidth: "295px" }} className="shadow-2xl">
          <Label className="absolute -top-3 left-4" type="default" icon={icon}>
            {t("quickSelect.label")}
          </Label>
          <span className="text-xs p-0.5 py-1 font-secondary">
            {t("quickSelect.purchase", { name: type })}
          </span>
        </InnerPanel>
      </div>
    );
  }

  const showBasket = available.length > 3;
  const discLength = available.slice(0, 3).length + (showBasket ? 1 : 0);

  return (
    <div
      ref={ref}
      className="flex"
      style={{
        left: `50%`,
        transform: "translatex(-50%)",
      }}
    >
      {available.slice(0, 3).map(({ name, icon }, index) => (
        <div
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            height: `${PIXEL_SCALE * 19}px`,
            top:
              (discLength === 3 && index === 1) ||
              (discLength === 4 && index >= 1)
                ? `${PIXEL_SCALE * -6}px`
                : 0,
          }}
          className="flex items-center justify-center relative mr-1 cursor-pointer"
          onClick={() => select(name)}
          key={name}
        >
          <img
            src={SUNNYSIDE.icons.disc}
            className="absolute w-full h-full inset-0"
          />
          <img
            src={ITEM_DETAILS[icon as InventoryItemName].image}
            className="z-10 -mt-1"
            style={{
              width: `${PIXEL_SCALE * 10}px`,
            }}
          />

          <img
            src={ITEM_DETAILS[name].image}
            className="z-10 absolute top-0 right-0"
            style={{
              width: `${PIXEL_SCALE * 6}px`,
            }}
          />
        </div>
      ))}
      {showBasket && (
        <div
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            height: `${PIXEL_SCALE * 19}px`,
          }}
          className="flex items-center justify-center relative cursor-pointer"
          onClick={onOpenBasket}
        >
          <img
            src={SUNNYSIDE.icons.disc}
            className="absolute w-full h-full inset-0"
          />
          <img
            src={SUNNYSIDE.icons.basket}
            className="z-10"
            style={{
              width: `${PIXEL_SCALE * 10}px`,
            }}
          />
        </div>
      )}
      {/* //       <Box
      //         key={name}
      //         count={inventory[name]}
      //         image={ITEM_DETAILS[name].image}
      //         secondaryImage={icon ? ITEM_DETAILS[icon].image : undefined}
      //         disabled={!inventory[name]?.gte(1)}
      //         onClick={() => select(name)}
      //         isSelected={selectedItem === name}
      //       />
      //     ))}
      //     {available.length === 0 && (
      //       <span className="text-xs p-0.5 py-1 font-secondary">
      //         {t("quickSelect.purchase", { name: type })}
      //       </span>
      //     )}
      //   </div>
      // </InnerPanel> */}
    </div>
  );
};
