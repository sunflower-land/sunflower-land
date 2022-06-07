import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";

export const Announcement: React.FC = () => {
  const { gameService } = useContext(Context);

  localStorage.getItem("announcementLastRead");

  function onAcknowledge() {
    gameService.send("ACKNOWLEDGE");
  }

  return (
    <div className="flex flex-col items-center">
      <span className="text-center mb-2">HELLO WORLD</span>
      <Button onClick={() => onAcknowledge()}>Continue</Button>
    </div>
  );
};
