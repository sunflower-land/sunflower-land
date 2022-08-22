import React from "react";
import { Character } from "./components/Character";

export const Bumpkin: React.FC = () => {
  return (
    <div>
      {/* TODO: Read from bumpkin */}
      <Character
        body="Light Farmer Potion"
        hair="Basic Hair"
        pants="Farmer Overalls"
        onClick={console.log}
      />
    </div>
  );
};
