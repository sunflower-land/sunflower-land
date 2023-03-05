import React, { useState } from "react";
import { ModalContent } from "./components/ui/ModalContent";
import { acknowledgeTutorial, hasShownTutorial } from "lib/tutorial";
import { Tutorial } from "./Tutorial";

interface Props {
  onClose: () => void;
}

export const Buildings: React.FC<Props> = ({ onClose }) => {
  const [showTutorial, setShowTutorial] = useState<boolean>(
    !hasShownTutorial("BuildingMenu")
  );

  const acknowledge = () => {
    acknowledgeTutorial("BuildingMenu");
    setShowTutorial(false);
  };

  if (showTutorial) {
    return <Tutorial onClose={acknowledge} />;
  }

  return <ModalContent closeModal={onClose} />;
};
