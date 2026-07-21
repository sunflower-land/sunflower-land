import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { ColorPanel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Label } from "components/ui/Label";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import upgradeIcon from "assets/icons/upgrade_disc.png";

const _interiorsEnabled = (state: MachineState) =>
  !!state.context.state.settings.interiorsEnabled;

/**
 * Countdown notice shown in the HUD while a player is inside the *old* home.
 *
 * On August 3rd the old home is retired and everyone moves to the new
 * `/interior` room. This nudges players to opt in early (via the `interiors`
 * experiment) so they can move their items across with the automated tooling
 * rather than being migrated cold on the day.
 *
 * Mounted from {@link Hud} for `location === "home"` only, in the bottom widget
 * column so it stacks with the other HUD notices and stays clear of the button
 * columns on either side.
 */
export const HomeUpgradeWidget: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  // Already opted in — they're only here via a direct /home link, so there is
  // nothing left to nudge them towards.
  const interiorsEnabled = useSelector(gameService, _interiorsEnabled);

  const upgradeNow = () => {
    // Flip on the interiors experiment, then drop them straight into the new
    // room — the welcome modal there offers to move their items across.
    gameService.send({ type: "interiors.enabled", enabled: true });
    setShowModal(false);
    navigate("/interior");
  };

  if (interiorsEnabled) return null;

  return (
    <>
      <ColorPanel
        type="vibrant"
        className="flex items-center p-1 py-2 cursor-pointer hover:brightness-110"
        onClick={() => setShowModal(true)}
      >
        <img
          src={upgradeIcon}
          className="object-contain mr-2 ml-1 shrink-0"
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            height: `${PIXEL_SCALE * 11}px`,
          }}
        />
        <div className="pr-1">
          <p className="text-xs leading-tight">{t("home.upgrade.widget")}</p>
          <p className="text-xxs underline">{t("home.upgrade.readMore")}</p>
        </div>
      </ColorPanel>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel
          onClose={() => setShowModal(false)}
          title={t("home.upgrade.title")}
        >
          <div className="p-2 flex flex-col gap-2 mb-1">
            <Label type="info">{t("home.upgrade.date")}</Label>
            <p className="text-sm">{t("home.upgrade.description")}</p>
            <p className="text-sm">{t("home.upgrade.tooling")}</p>
            <p className="text-xs italic">{t("home.upgrade.revert")}</p>
          </div>

          <div className="flex space-x-1">
            <Button onClick={() => setShowModal(false)}>
              {t("home.upgrade.later")}
            </Button>
            <Button onClick={upgradeNow}>{t("home.upgrade.now")}</Button>
          </div>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
