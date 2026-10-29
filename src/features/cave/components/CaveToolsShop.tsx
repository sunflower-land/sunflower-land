import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  TREASURE_TOOLS,
  type TreasureToolName,
} from "features/game/types/tools";
import { getKeys } from "lib/object";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { Box } from "components/ui/Box";
import { Label } from "components/ui/Label";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { ToolContent } from "features/world/ui/beach/treasure_shop/TreasureShopBuy";

const _inventory = (state: MachineState) => state.context.state.inventory;

/**
 * Gloomwick's Tools tab: the Sand Shovel / Sand Drill shelf Jafar sells, from
 * the same stock, using Jafar's buy panel.
 */
export const CaveToolsShop: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService, shortcutItem } = useContext(Context);
  const inventory = useSelector(gameService, _inventory);
  const [selectedName, setSelectedName] =
    useState<TreasureToolName>("Sand Shovel");

  return (
    <SplitScreenView
      panel={<ToolContent selectedName={selectedName} />}
      content={
        <div className="flex flex-col w-full">
          <Label type="default">{t("tools")}</Label>
          <div className="flex flex-wrap mb-2">
            {getKeys(TREASURE_TOOLS).map((toolName) => (
              <Box
                isSelected={selectedName === toolName}
                key={toolName}
                onClick={() => {
                  setSelectedName(toolName);
                  shortcutItem(toolName);
                }}
                image={ITEM_DETAILS[toolName].image}
                count={inventory[toolName]}
              />
            ))}
          </div>
        </div>
      }
    />
  );
};
