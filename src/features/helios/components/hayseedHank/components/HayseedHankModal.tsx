import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { acknowledgeTutorial, hasShownTutorial } from "lib/tutorial";
import React, { useContext, useEffect, useState } from "react";
import { Chore } from "./Chore";

interface Props {
  onTutorialComplete: () => void;
  onClose: () => void;
}
export const HayseedHankModal: React.FC<Props> = ({
  onClose,
  onTutorialComplete,
}) => {
  const { gameService } = useContext(Context);

  useEffect(() => {
    // Trigger an autosave in case they have changes so user can sync right away
    gameService.send("SAVE");
  }, []);

  const [showTutorial, setShowTutorial] = useState<boolean>(
    !hasShownTutorial("Chore Master")
  );

  const acknowledgeIntro = () => {
    onTutorialComplete();
    acknowledgeTutorial("Chore Master");
    setShowTutorial(false);
  };

  if (showTutorial) {
    return (
      <>
        <div className="p-2 text-sm">
          <p className="mb-2">{`I've been working this land for fifty years.`}</p>
          <p className="mb-2">
            But even with all my experience, I still need help sometimes.
          </p>

          <p className="mb-2">
            You look like a strong and capable adventurer, and I could use
            someone like you to help me with my daily tasks.
          </p>
        </div>
        <Button onClick={acknowledgeIntro}>Continue</Button>
      </>
    );
  }

  return <Chore />;
};
