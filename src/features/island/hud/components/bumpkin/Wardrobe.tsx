import React, { useState } from "react";
import basket from "assets/icons/basket.png";
import head from "assets/bumpkins/example.png";
import hair from "assets/ui/equipment/hair_placeholder.png";
import hat from "assets/ui/equipment/hat_placeholder.png";
import shirt from "assets/ui/equipment/shirt_placeholder.png";
import necklace from "assets/ui/equipment/necklace_placeholder.png";
import pants from "assets/ui/equipment/pants_placeholder.png";
import shoes from "assets/ui/equipment/shoe_placeholder.png";
import hairTest from "assets/ui/equipment/hair_test.png";
import shirtTest from "assets/ui/equipment/shirt_test.png";
import pantsTest from "assets/ui/equipment/pants_test.png";
import shoesTest from "assets/ui/equipment/shoes_test.png";
import crown from "assets/nfts/goblin_crown.png";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import {
  BumpkinPants,
  BumpkinShirts,
  BumpkinShoes,
  BumpkinWigs,
  Inventory,
  InventoryItemName,
} from "features/game/types/game";
import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";

type Slot = "Hair" | "Shirt" | "Pants" | "Hat" | "Shoes" | "Necklace";

type Equipped = {
  hair: BumpkinWigs;
  shirt: BumpkinShirts;
  pants: BumpkinPants;
  shoes: BumpkinShoes; //TODO
  hat: InventoryItemName; // TODO
};

// TODO
const EQUIPPED: Equipped = {
  hair: "Basic Wig",
  hat: "Goblin Crown",
  pants: "Farmer Pants",
  shirt: "Farmer Shirt",
  shoes: "Farmer Shoes",
};

// TODO
const INVENTORY: Inventory = {
  "Goblin Crown": new Decimal(1),
};
export const Wardrobe: React.FC = () => {
  const [equipped, setEquipped] = useState(EQUIPPED);
  const [inventory, setInventory] = useState(INVENTORY);

  const equip = (itemName: InventoryItemName) => {};

  return (
    <div className="flex flex-col">
      <div>
        <div className="flex items-start  justify-center">
          <div>
            <Box image={hairTest} />
            <Box image={shirtTest} />
            <Box image={pantsTest} />
            <Box image={shoesTest} />
          </div>
          <img src={head} className="w-40" />
          <div>
            <Box image={hat} />
            <Box image={necklace} />
          </div>
        </div>
      </div>
      <div className="flex-1 px-2 mt-4">
        <div className="flex items-center pl-2">
          <img src={basket} className="w-6 mr-1" />
          <span className="text-sm">Items</span>
        </div>
        <div className="flex flex-wrap">
          {getKeys(inventory).map((itemName) => (
            <Box
              image={ITEM_DETAILS[itemName].image}
              count={inventory[itemName]}
              onClick={() => equip(itemName)}
            />
          ))}
          <Box />
          <Box />
          <Box />
          <Box />
          <Box />
        </div>
      </div>
      <div className="px-2 mt-2">
        <div>
          <p className="text-xxs">Bumpkins live on the Blockchain.</p>
          <p className="text-xxs mt-2">
            You must save after making changes to update the NFT.
          </p>
        </div>
        <Button className="mt-2 text-sm">Save</Button>
      </div>
    </div>
  );
};
