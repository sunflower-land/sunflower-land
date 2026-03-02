import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import React, { useContext } from "react";

export const DEV_GenerateLandButton: React.FC = () => {
  const { gameService } = useContext(Context);

  const randomise = async () => {
    gameService.send({ type: "RANDOMISE" });
  };
  return (
    <div>
      <Button onClick={randomise}>{"Randomise Land"}</Button>
    </div>
  );
};
