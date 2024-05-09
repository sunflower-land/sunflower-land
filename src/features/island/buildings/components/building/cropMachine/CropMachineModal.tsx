import React, { useContext, useEffect, useState } from "react";

import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "components/ui/Modal";

const Timer: React.FC<{ readyAt: number }> = ({ readyAt }) => {
  const [secondsLeft, setSecondsLeft] = useState((readyAt - Date.now()) / 1000);

  const active = readyAt >= Date.now();

  useEffect(() => {
    if (active) {
      const interval = setInterval(() => {
        setSecondsLeft((readyAt - Date.now()) / 1000);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [active]);

  return (
    <div className="flex items-center mb-2">
      <img src={SUNNYSIDE.icons.timer} className="h-5 mr-1" />

      <span className="text-xs mr-1">
        {secondsToString(secondsLeft, {
          length: "full",
        })}
      </span>
    </div>
  );
};

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  readyAt?: number;
}

export const CropMachineModal: React.FC<Props> = ({
  setShowModal,
  showModal,
  readyAt,
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const cropMachine = gameState.context.state.buildings["Crop Machine"]?.[0];

  const [tab, setTab] = useState(0);
  const { t } = useAppTranslation();

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <CloseButtonPanel
        onClose={() => {
          setShowModal(false);
        }}
        tabs={[{ icon: "", name: "Crop Machine" }]}
        currentTab={tab}
        setCurrentTab={setTab}
      >
        {tab === 0 && (
          <div>
            <p></p>
          </div>
        )}
      </CloseButtonPanel>
    </Modal>
  );
};
