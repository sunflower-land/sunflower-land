import { Panel } from "components/ui/Panel";
import React from "react";
import { Modal } from "components/ui/Modal";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

export const IslandNotFound = () => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();

  return (
    <Modal show={true}>
      <Panel>
        <div className="flex flex-col items-center">
          <img id="richBegger" src={SUNNYSIDE.npcs.humanDeath} />
          <p className="my-4 px-2 text-center">{t("islandNotFound.message")}</p>
          <Button onClick={() => navigate(`/`)}>
            {t("islandNotFound.takeMeHome")}
          </Button>
        </div>
      </Panel>
    </Modal>
  );
};
