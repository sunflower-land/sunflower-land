import { Button } from "components/ui/Button";
import React, { useContext } from "react";
import { Context } from "../GameProvider";

export const Success: React.FC = () => {
  const { gameService } = useContext(Context);

  return (
    <>
      <span>Woohoo! Your items are on the Blockchain!</span>
      <Button onClick={() => gameService.send("REFRESH")}>Continue</Button>
    </>
  );
};
