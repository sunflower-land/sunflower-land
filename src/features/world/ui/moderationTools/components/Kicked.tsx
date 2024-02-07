import React from "react";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { Modal } from "react-bootstrap";

import { ModerationEvent } from "features/world/Phaser";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const Kicked: React.FC<{
  event?: ModerationEvent;
  onClose: () => void;
}> = ({ event, onClose }) => {
  const { t } = useAppTranslation();

  if (!event) return null;

  return (
    <Modal show={true} centered backdrop="static" keyboard={false}>
      <Panel>
        <div className="flex flex-col gap-2">
          <div className="flex justify-center text-center">
            <h1 className="text-lg font-bold">{t("kicked.kicked")} </h1>
          </div>
          <div className="flex flex-col justify-center text-center">
            <p className="text-sm">{t("kicked.Reason")}</p>
            <p className="text-sm">{event.reason}</p>
          </div>
          <div className="flex justify-center text-center">
            <p className="text-xxs">{t("kick.Message")}</p>
          </div>
          <div className="flex justify-center">
            <Button className="mt-1" onClick={onClose}>
              {t("accept")}
            </Button>
          </div>
        </div>
      </Panel>
    </Modal>
  );
};
