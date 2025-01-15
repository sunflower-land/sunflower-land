import PubSub from "pubsub-js";
import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useEffect, useRef, useState } from "react";

type BaseProps = {
  options: {
    name: InventoryItemName;
    icon: InventoryItemName;
    showSecondaryImage: boolean;
  }[];
  onClose: () => void;
  onSelected?: (name: InventoryItemName) => void;
  showExpanded?: boolean;
};

type PropsWithType = BaseProps & {
  type: string;
  emptyMessage?: never;
};

type PropsWithEmptyMessage = BaseProps & {
  type?: never;
  emptyMessage: string;
};

type Props = PropsWithType | PropsWithEmptyMessage;

const selectInventory = (state: MachineState) => state.context.state.inventory;

export const QuickSelect: React.FC<Props> = ({
  options,
  onClose,
  onSelected,
  type = "", // Provide a default empty string
  emptyMessage,
  showExpanded,
}) => {
  const { gameService, shortcutItem } = useContext(Context);
  const ref = useRef<HTMLDivElement>(null); // Create a ref to the component
  const inventory = useSelector(gameService, selectInventory);

  const { t } = useAppTranslation();

  const [showEmptyPanel, setShowEmptyPanel] = useState(true);
  const available = options.filter((option) => inventory[option.name]?.gte(1));
  const seedsShown = showExpanded ? available : available.slice(0, 3);

  useEffect(() => {
    if (available.length === 0) {
      const timer = setTimeout(() => {
        setShowEmptyPanel(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [available.length]);

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

  if (available.length === 0) {
    return (
      <div
        ref={ref}
        className="absolute transition-opacity duration-300"
        style={{ opacity: showEmptyPanel ? 1 : 0 }}
        onTransitionEnd={() => {
          if (!showEmptyPanel) onClose();
        }}
      >
        <InnerPanel style={{ maxWidth: "295px" }} className="shadow-2xl">
          <span className="text-xs p-0.5 py-1 font-secondary">
            {emptyMessage ||
              t("quickSelect.purchase", { name: type || "item" })}
          </span>
        </InnerPanel>
      </div>
    );
  }

  const showBasket = available.length > 3 && !showExpanded;
  const discLength = seedsShown.length + (showBasket ? 1 : 0);

  return (
    <div
      ref={ref}
      className="flex"
      style={{
        left: `50%`,
        transform: "translatex(-50%)",
      }}
    >
      {seedsShown.map(({ name, icon, showSecondaryImage }, index) => (
        <div
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            height: `${PIXEL_SCALE * 19}px`,
            top:
              // The first and last item in the array will be lower
              index !== 0 && index !== discLength - 1
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
          {showSecondaryImage && (
            <img
              src={ITEM_DETAILS[name].image}
              className="z-10 absolute top-0 right-0"
              style={{
                width: `${PIXEL_SCALE * 6}px`,
              }}
            />
          )}
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
    </div>
  );
};
