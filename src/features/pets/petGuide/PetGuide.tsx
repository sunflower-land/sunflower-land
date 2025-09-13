import { Button } from "components/ui/Button";
import { InnerPanel } from "components/ui/Panel";
import React from "react";

export const PetGuide: React.FC = () => {
  return (
    <InnerPanel>
      <p>{`Pet Guide`}</p>
      <div id="Buttons" className="grid grid-cols-2 gap-1">
        <Button>{`Pet Egg`}</Button>
        <Button>{`Feed`}</Button>
        <Button>{`Fetch`}</Button>
        <Button>{`Pet Maintenance`}</Button>
        <Button>{`Pet Categories`}</Button>
        <Button>{`Levels & Perks`}</Button>
        <Button>{`Shrines`}</Button>
        <Button>{`Social`}</Button>
      </div>
    </InnerPanel>
  );
};
