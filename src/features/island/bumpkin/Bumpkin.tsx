import React from "react";
import { BumpkinNPC } from "./components/BumpkinNPC";

export const Bumpkin: React.FC = () => {
  return (
    <div className="w-full">
      <BumpkinNPC
        body="Farmer Potion"
        wig="Explorer Wig"
        pants="Lumberjack Overalls"
        onClick={() => {}}
      />
    </div>
  );
};
