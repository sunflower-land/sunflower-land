import { Panel } from "components/ui/Panel";
import React from "react";
import { Modal } from "components/ui/Modal";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useContext } from "react";
import { Context } from "features/game/GameProvider";

export const IslandNotFound = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  return (
    <Modal show={true}>
      <Panel>
        <div className="flex flex-col items-center">
          <img id="richBegger" src={SUNNYSIDE.npcs.humanDeath} />
          <p className="my-4 px-2 text-center">{t("islandNotFound.message")}</p>
          <Button onClick={() => gameService.send({ type: "END_VISIT" })}>
            {t("islandNotFound.takeMeHome")}
          </Button>
        </div>
      </Panel>
    </Modal>
  );
};
