import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "components/ui/Modal";

import { Context } from "features/game/GoblinProvider";
import { Panel } from "components/ui/Panel";

import { MachineInterpreter } from "./lib/tradingPostMachine";
import { Selling } from "../selling/Selling";
import { Buying } from "../buying/Buying";
import { Tabs } from "./components/Tabs";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface TraderModalProps {
  isOpen: boolean;
  initialTab?: "buying" | "selling";
  onClose: () => void;
}

export const TraderModal: React.FC<TraderModalProps> = ({
  isOpen,
  initialTab = "selling",
  onClose,
}) => {
  const { t } = useAppTranslation();
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  const child = goblinState.children.tradingPost as MachineInterpreter;

  const [machine] = useActor(child);

  const [isSelling, setIsSelling] = useState(initialTab === "selling");

  const proovePersonhood = async () => {
    goblinService.send("PROVE_PERSONHOOD");
    onClose();
  };

  const handleClose = () => {
    onClose();
    child.send("CLOSE");
  };

  const isTrading = machine.matches("trading");
  const isDisabled =
    machine.matches("loading") ||
    machine.matches("updatingSession") ||
    machine.matches("cancelling") ||
    machine.matches("purchasing");

  const Content = () => {
    if (!goblinState.context.verified) {
      return (
        <>
          <p className="text-sm p-1 m-1">{t("trader.PoH")}</p>
          <Button className="mr-1" onClick={proovePersonhood}>
            {t("trader.start.verification")}
          </Button>
        </>
      );
    }

    return (
      <>
        {isTrading && isSelling && <Selling />}
        {isTrading && !isSelling && <Buying />}

        {machine.matches("loading") && (
          <span className="loading m-2">{t("loading")}</span>
        )}
        {machine.matches("updatingSession") && (
          <span className="loading m-2">{t("refreshing")}</span>
        )}

        {machine.matches("cancelling") && (
          <span className="loading m-2">{t("cancelling")}</span>
        )}
        {machine.matches("purchasing") && (
          <span className="loading m-2">{t("purchasing")}</span>
        )}
      </>
    );
  };

  return (
    <Modal
      show={isOpen}
      // Prevent modal from closing during asynchronous state (listing, purchasing, cancelling, etc)
      onHide={!isDisabled ? handleClose : undefined}
    >
      <Panel className="relative" hasTabs>
        <Tabs
          disabled={isDisabled}
          isSelling={isSelling}
          setIsSelling={setIsSelling}
          onClose={handleClose}
        />
        <Content />
      </Panel>
    </Modal>
  );
};
