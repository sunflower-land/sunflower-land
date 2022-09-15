import React from "react";
import { Character } from "./components/Character";

export const Bumpkin: React.FC = () => {
  return (
    <div>
      {/* TODO: Read from bumpkin */}
      <Character
        body="Beige Farmer Potion"
        hair="Basic Hair"
        pants="Farmer Overalls"
      />
    </div>
  );
};
