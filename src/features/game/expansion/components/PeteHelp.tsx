import React, { useContext } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import type { MachineState } from "features/game/lib/gameMachine";
import {
  hasPlazaAccess,
  needsFirstDelivery,
} from "features/island/delivery/lib/onboarding";
import { Context } from "features/game/GameProvider";
import { useNavigate } from "react-router";
import { useSelector } from "@xstate/react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const isLocked = (state: MachineState) => !hasPlazaAccess(state.context.state);

const isDeliveryPhase = (state: MachineState) =>
  needsFirstDelivery(state.context.state);

const isTutorialIsland = (state: MachineState) =>
  state.context.state.island.type === "basic";

export const PeteHelp: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const locked = useSelector(gameService, isLocked);
  const deliveryPhase = useSelector(gameService, isDeliveryPhase);
  const tutorialIsland = useSelector(gameService, isTutorialIsland);

  const navigate = useNavigate();

  return (
    <>
      <div className="p-2">
        {deliveryPhase ? (
          <p className="text-sm mb-2">{t("pete.pumpkinPlaza.delivery")}</p>
        ) : (
          <>
            <p className="text-sm mb-2">{t("pete.pumpkinPlaza.one")}</p>
            <p className="text-sm">{t("pete.pumpkinPlaza.two")}</p>
          </>
        )}

        <img
          src={SUNNYSIDE.tutorial.plazaScreenshot}
          className="w-full mx-auto rounded-lg my-2"
        />
        {locked &&
          (tutorialIsland ? (
            <p className="text-xs mb-2">{t("pete.help.harvestFirst")}</p>
          ) : (
            <>
              <p className="text-xs mb-2">{t("pete.help.zero")}</p>
              <Label
                type="danger"
                className="mb-2 ml-1"
                icon={SUNNYSIDE.icons.lock}
              >
                {t("warning.level.required", { lvl: 2 })}
              </Label>
            </>
          ))}
      </div>
      <Button
        disabled={locked}
        onClick={() => {
          navigate(`/world/plaza`);
        }}
      >
        {t("lets.go")}
      </Button>
    </>
  );
};
