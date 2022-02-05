import { useActor } from "@xstate/react";
import classNames from "classnames";
import React, { useContext, useState } from "react";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { Craftable } from "features/game/types/craftables";
import { SeedName, SEEDS } from '../game/types/crops';
import { NFTs, TOOLS, FOODS } from "features/game/types/craftables";

interface Props {
    items: Object
  }

export const InventoryPreview: React.FC<Props> = ({ items }) => {
    
    // let items2 = Object.assign(TOOLS)
    // localStorage.setItem("inventory.tab", items);

    const { gameService, selectedItem, shortcutItem } = useContext(Context);
    const [game] = useActor(gameService);
    const inventory = game.context.state.inventory;

    const current_items = Object.keys(inventory) as InventoryItemName[];

    const itemList = Object.keys(items) as InventoryItemName[];

    const itemBelongsTo: InventoryItemName[] = itemList;

    function isValid(inventory: InventoryItemName) {
        return itemBelongsTo.includes(inventory);
    }
  
    const validItems = current_items.filter(function(itemName){
        if(isValid(itemName))
        {
        return inventory[itemName];
        }
    });

    return (
        <div className="flex">
            <div className="w-3/5 flex flex-wrap  h-fit">
            {validItems.length === 0 && (
                <span className="text-white text-shadow text-xs">
                You have no items in your inventory.
                </span>
            )}

            

            {validItems.map((itemName) => (
                
                <Box
                count={inventory[itemName]}
                isSelected={selectedItem === itemName}
                key={itemName}
                onClick={() => shortcutItem(itemName)}
                image={ITEM_DETAILS[itemName].image}
                />
            
                    
                
            ))}
            </div>
            <OuterPanel className="flex-1">
            {selectedItem && (
                <div className="flex flex-col justify-center items-center p-2 ">
                <span className="text-base text-center text-shadow">
                    {selectedItem}
                </span>
                
                <img
                    src={ITEM_DETAILS[selectedItem].image}
                    className="h-12 w-12"
                    alt={selectedItem}
                />
                <span className="text-xs text-shadow text-center mt-2">
                    {ITEM_DETAILS[selectedItem].description}
                </span>
                
                </div>
            )}
            </OuterPanel>
        </div>
    );
};
