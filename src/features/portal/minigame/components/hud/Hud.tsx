import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { HudContainer } from "components/ui/HudContainer";
import { PortalMachineState } from "../../lib/Machine";
import { Score } from "./Score";
import { Settings } from "./Settings";
import { Travel } from "./Travel";
import { Timer } from "./Timer";
import { Target } from "./Target";
import { Lives } from "./Lives";
import { Powers } from "./Powers";
import { Food } from "./Food";

const _isJoystickActive = (state: PortalMachineState) =>
  state.context.isJoystickActive;
// const _achievements = (state: PortalMachineState) =>
//   state.context.state?.minigames.games[PORTAL_NAME]?.achievements ?? {};
const _isPlaying = (state: PortalMachineState) => state.matches("playing");

export const Hud: React.FC = () => {
  const { portalService } = useContext(PortalContext);

  const isJoystickActive = useSelector(portalService, _isJoystickActive);
  // const achievements = useSelector(portalService, _achievements);
  const isPlaying = useSelector(portalService, _isPlaying);

  // achievement toast provider
  // const { showAchievementToasts } = useAchievementToast();

  // show new achievements
  // const [existingAchievementNames, setExistingAchievements] = React.useState(
  //   Object.keys(achievements),
  // );
  // useEffect(() => {
  //   const achievementNames = Object.keys(achievements);
  //   const newAchievementNames = achievementNames.filter(
  //     (achievement) => !existingAchievementNames.includes(achievement),
  //   );
  //   if (newAchievementNames.length > 0) {
  //     showAchievementToasts(newAchievementNames);
  //     setExistingAchievements(achievementNames);
  //   }
  // }, [achievements]);

  return (
    <HudContainer>
      <div>
        <div className="flex flex-col gap-2 absolute p-3">
          {isPlaying && (
            <>
              <Target />
              <Timer />
              <Lives />
              <Score />
              <Food />
            </>
          )}
        </div>
        {isPlaying && <Powers />}

        {!isJoystickActive && (
          <>
            <Travel />
            <Settings />
          </>
        )}
      </div>
    </HudContainer>
  );
};
