import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { TEST_FARM } from "features/game/lib/constants";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { getImageUrl } from "features/goblins/tailor/TabContent";
import React, { useState } from "react";

const MERCH_ITEMS: BumpkinItem[] = [
  "Merch Bucket Hat",
  "Merch Coffee Mug",
  "Merch Hoodie",
  "Grey Merch Hoodie",
  "Merch Tee",
  "Witches' Eve Tee",
];
export const Merch: React.FC = () => {
  const [selected, setSelected] = useState<BumpkinItem>("Merch Bucket Hat");

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={TEST_FARM}
          details={{
            wearable: selected,
          }}
          actionView={
            <a
              href="https://shop.sunflower-land.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="mt-1">Buy now</Button>
            </a>
          }
        />
      }
      content={
        <>
          <div className="flex flex-wrap">
            {MERCH_ITEMS.map((item) => {
              return (
                <Box
                  key={item}
                  onClick={() => setSelected(item)}
                  image={getImageUrl(ITEM_IDS[item])}
                />
              );
            })}
            <p className="text-xs mt-4">
              Each merchandise items comes with an in-game wearable!
            </p>
          </div>
        </>
      }
    />
  );
};
