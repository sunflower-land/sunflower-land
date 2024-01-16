import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import { GreedyGoblin } from "features/community/arcade/games/GreedyGoblin";
import { ChickenFight } from "features/community/arcade/games/ChickenFight";
import { Button } from "components/ui/Button";

import { ArcadeDonation } from "./ArcadeDonation";
import { ARCADE_GAMES } from "../lib/constants";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ArcadeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const { t } = useAppTranslation();
  return (
    <Modal centered show={isOpen} onHide={onClose}>
      <CloseButtonPanel
        onClose={onClose}
        onBack={activeWindow ? () => setActiveWindow(null) : undefined}
        title={activeWindow || "Mini SFL Games"}
      >
        {/* Menu */}
        {activeWindow === null && (
          <ul className="list-none">
            <li className="p-1">
              <Button
                className="text-sm"
                onClick={() =>
                  setActiveWindow(ARCADE_GAMES.GREEDY_GOBLIN.title)
                }
              >
                {ARCADE_GAMES.GREEDY_GOBLIN.title}
              </Button>
            </li>
            <li className="p-1">
              <Button
                className="text-sm"
                onClick={() =>
                  setActiveWindow(ARCADE_GAMES.CHICKEN_FIGHT.title)
                }
              >
                {ARCADE_GAMES.CHICKEN_FIGHT.title}
              </Button>
            </li>
            <li className="p-1 pb-2 text-sm flex justify-content-center">
              <span
                className="underline cursor-pointer"
                onClick={() => setActiveWindow("Donation")}
              >
                {t("transaction.donate")}
              </span>
            </li>
          </ul>
        )}

        {activeWindow === ARCADE_GAMES.GREEDY_GOBLIN.title && <GreedyGoblin />}
        {activeWindow === ARCADE_GAMES.CHICKEN_FIGHT.title && <ChickenFight />}
        {activeWindow === "Donation" && <ArcadeDonation />}
      </CloseButtonPanel>
    </Modal>
  );
};
