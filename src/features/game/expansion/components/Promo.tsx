import { Button } from "components/ui/Button";
import treasure from "assets/icons/chest.png";

import React, { useContext } from "react";
import { Context } from "features/game/GameProvider";

export const Promo: React.FC = () => {
  const { gameService } = useContext(Context);

  return (
    <div className="flex flex-col items-center">
      <p className="text-base">Crypto.com Bonus!</p>
      <img src={treasure} className="w-12 my-2" />
      <p className="text-sm mb-1">Expand your land twice to claim 100 SFL.</p>
      <Button onClick={() => gameService.send("ACKNOWLEDGE")}>Got it</Button>
    </div>
  );
};
