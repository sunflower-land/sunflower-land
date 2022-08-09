import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";

import bakery from "assets/buildings/bakery_TEST2.gif";
import { Context } from "features/game/GameProvider";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";

export const Buildings: React.FC = () => {
  const { gameService } = useContext(Context);
  const [open, setOpen] = useState(false);
  const [scrollIntoView] = useScrollIntoView();

  const handleEditMode = () => {
    gameService.send("EDIT", { placeable: "bakery" });
    setOpen(false);
    scrollIntoView(Section.GenesisBlock);
  };

  return (
    <div className="flex flex-col items-end mr-2 sm:block fixed top-16 right-0 z-50">
      <Button onClick={() => setOpen(!open)}>Buildings</Button>
      {open && (
        <div onClick={handleEditMode}>
          <img src={bakery} alt="" />
        </div>
      )}
    </div>
  );
};
