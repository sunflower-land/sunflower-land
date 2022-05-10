import React from "react";

import sign from "assets/decorations/woodsign.png";

import { Inventory, InventoryItemName } from "../types/game";
import { GRID_WIDTH_PX } from "../lib/constants";
import { SKILL_TREE } from "../types/skills";
import { ITEM_DETAILS } from "../types/images";

interface Props {
  inventory: Inventory;
  id: number;
}

export const Sign: React.FC<Props> = ({ inventory, id }) => {
  const badges = (Object.keys(SKILL_TREE) as InventoryItemName[]).filter(
    (name) => inventory[name]?.gte(1)
  );
  const badgeImages = badges.map((badge) => ITEM_DETAILS[badge]);

  return (
    <div
      className="flex justify-center absolute"
      style={{
        width: `${GRID_WIDTH_PX * 3.5}px`,
        left: `${GRID_WIDTH_PX * 48.9}px`,
        top: `${GRID_WIDTH_PX * 32.8}px`,
      }}
    >
      {badgeImages.length >= 1 && (
        <div
          className="h-5 w-5 absolute mr-1 flex items-center justify-center"
          style={{
            right: "3px",
            top: "24px",
          }}
        >
          <img src={badgeImages[0].image} className="h-3 z-10" />
        </div>
      )}
      {badgeImages.length >= 2 && (
        <div
          className="h-5 w-5 absolute mr-1 flex items-center justify-center"
          style={{
            left: "7px",
            top: "24px",
          }}
        >
          <img src={badgeImages[1].image} className="h-3 z-10" />
        </div>
      )}

      {badgeImages.length >= 3 && (
        <div
          className="h-5 w-5 absolute mr-1 flex items-center justify-center"
          style={{
            left: "16px",
            top: "8px",
          }}
        >
          <img src={badgeImages[2].image} className="h-3 z-10" />
        </div>
      )}
      {badgeImages.length >= 4 && (
        <div
          className="h-5 w-5 absolute mr-1 flex items-center justify-center"
          style={{
            right: "14px",
            top: "8px",
          }}
        >
          <img src={badgeImages[3].image} className="h-3 z-10" />
        </div>
      )}

      <img src={sign} className="w-full" />
      <div
        className="flex flex-col absolute"
        style={{
          width: `130px`,
          top: `${GRID_WIDTH_PX * 0.27}px`,
          left: `${GRID_WIDTH_PX * 0.2}px`,
          color: "#ead4aa",
          textAlign: "center",
          textShadow: "1px 1px #723e39",
          fontSize: "14px",
        }}
      >
        <p style={{ fontSize: "8px" }}>Land</p>
        {id}
      </div>
    </div>
  );
};
