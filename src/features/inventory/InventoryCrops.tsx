import { useActor } from "@xstate/react";
import classNames from "classnames";
import React, { useContext, useState } from "react";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";

import { CropName, CROPS } from '../game/types/crops';

interface Props {}

export const InventoryCrops: React.FC<Props> = ({}) => {
  
    localStorage.setItem("inventory.tab", 'crops');

    const { gameService, selectedItem, shortcutItem } = useContext(Context);
    const [game] = useActor(gameService);
    const inventory = game.context.state.inventory;

    const items = Object.keys(inventory) as InventoryItemName[];
    const crops = Object.keys(CROPS) as InventoryItemName[];

    const VALID_CROPS: InventoryItemName[] = crops;

    function isCrop(crop: InventoryItemName): crop is CropName {
        return VALID_CROPS.includes(crop);
    }
    
    const validItems = items.filter(function(itemName){
        if(isCrop(itemName))
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
