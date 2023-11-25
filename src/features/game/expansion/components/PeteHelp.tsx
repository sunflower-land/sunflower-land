import React, { useContext } from "react";

import plaza from "assets/tutorials/plaza_screenshot1.png";
import { Label } from "components/ui/Label";
import lockIcon from "assets/skills/lock.png";
import { Button } from "components/ui/Button";
import { MachineState } from "features/game/lib/gameMachine";
import { getBumpkinLevel } from "features/game/lib/level";
import { Context } from "features/game/GameProvider";
import { useNavigate } from "react-router-dom";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
// import { useSelector } from "@xstate/react";

const isLocked = (state: MachineState) =>
  getBumpkinLevel(state.context.state.bumpkin?.experience ?? 0) < 3;

export const PeteHelp: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  // TEMP: Disable for conference
  const locked = false;
  // const locked = useSelector(gameService, isLocked);

  const navigate = useNavigate();

  return (
    <div className="p-2">
      <p className="text-sm mb-2">{t("pete.help.one")}</p>
      <p className="text-sm">{t("pete.help.two")}</p>

      <img src={plaza} className="w-full mx-auto rounded-lg my-2" />
      {locked && (
        <>
          <p className="text-xs mb-2">
            Visit the fire pit, cook food and eat to level up.
          </p>
          <Label type="danger" className="mb-2 ml-1" icon={lockIcon}>
            {t("warning.level.required")}3
          </Label>
        </>
      )}

      <Button
        disabled={locked}
        onClick={() => {
          navigate(`/world/plaza`);
        }}
      >
        {t("letsGo")}
      </Button>
    </div>
  );
};
