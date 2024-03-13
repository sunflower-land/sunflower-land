import React, { useContext } from "react";

import plaza from "assets/tutorials/plaza_screenshot1.png";
import { Label } from "components/ui/Label";
import lockIcon from "assets/skills/lock.png";
import { Button } from "components/ui/Button";
import { MachineState } from "features/game/lib/gameMachine";
import { getBumpkinLevel } from "features/game/lib/level";
import { Context } from "features/game/GameProvider";
import { useNavigate } from "react-router-dom";
import { useSelector } from "@xstate/react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const isLocked = (state: MachineState) =>
  getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0) < 3;

export const PeteHelp: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const locked = useSelector(gameService, isLocked);

  const navigate = useNavigate();

  return (
    <div className="p-2">
      <p className="text-sm mb-2">{t("pete.pumpkinPlaza.one")}</p>
      <p className="text-sm">{t("pete.pumpkinPlaza.two")}</p>

      <img src={plaza} className="w-full mx-auto rounded-lg my-2" />
      {locked && (
        <>
          <p className="text-xs mb-2">{t("pete.help.zero")}</p>
          <Label type="danger" className="mb-2 ml-1" icon={lockIcon}>
            {t("warning.level.required", { lvl: 3 })}
          </Label>
        </>
      )}

      <Button
        disabled={locked}
        onClick={() => {
          navigate(`/world/plaza`);
        }}
      >
        {t("lets.go")}
      </Button>
    </div>
  );
};
