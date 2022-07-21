import React from "react";
import { Character } from "./components/Character";

export const Bumpkin: React.FC = () => {
  return (
    <div>
      <Character
        body="Farmer Potion"
        wig="Rancher Wig"
        pants="Lumberjack Overalls"
        onClick={console.log}
      />
    </div>
  );
};
