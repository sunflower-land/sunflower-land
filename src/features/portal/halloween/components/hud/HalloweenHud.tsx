import React, { useContext, useEffect } from "react";
import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { HudContainer } from "components/ui/HudContainer";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PortalMachineState } from "../../lib/halloweenMachine";
import { useAchievementToast } from "../../providers/AchievementToastProvider";

const _isJoystickActive = (state: PortalMachineState) =>
  state.context.isJoystickActive;
const _target = (state: PortalMachineState) =>
  state.context.state?.minigames.prizes["halloween"]?.score ?? 0;
const _achievements = (state: PortalMachineState) =>
  state.context.state?.minigames.games["halloween"]?.achievements ?? {};
const _isPlaying = (state: PortalMachineState) => state.matches("playing");

export const HalloweenHud: React.FC = () => {
  const { portalService } = useContext(PortalContext);
  const { t } = useAppTranslation();

  const isJoystickActive = useSelector(portalService, _isJoystickActive);
  const target = useSelector(portalService, _target);
  const achievements = useSelector(portalService, _achievements);
  const isPlaying = useSelector(portalService, _isPlaying);

  // achievement toast provider
  const { showAchievementToasts } = useAchievementToast();

  // show new achievements
  const [existingAchievementNames, setExistingAchievements] = React.useState(
    Object.keys(achievements),
  );
  useEffect(() => {
    const achievementNames = Object.keys(achievements);
    const newAchievementNames = achievementNames.filter(
      (achievement) => !existingAchievementNames.includes(achievement),
    );

    if (newAchievementNames.length > 0) {
      showAchievementToasts(newAchievementNames);
      setExistingAchievements(achievementNames);
    }
  }, [achievements]);

  return (
    <>
      <HudContainer>
        {/* <div
          className={classNames({
            "pointer-events-none": isJoystickActive,
          })}
        >
          <div
            className="absolute"
            style={{
              top: `${PIXEL_SCALE * 3}px`,
              left: `${PIXEL_SCALE * 6}px`,
            }}
          >
            <CropsAndChickensTarget />
            <CropsAndChickensScores />
          </div>

          <CropsAndChickensTimer />
          <CropsAndChickensTravel />
        </div>
      </HudContainer>
      <HudContainer zIndex={99999}>
        <div
          className={classNames({
            "pointer-events-none": isJoystickActive,
          })}
        >
          <CropsAndChickensSettings />
        </div> */}
      </HudContainer>
    </>
  );
};
