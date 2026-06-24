import React, { useContext } from "react";
import classNames from "classnames";
import { useNavigate } from "react-router";
import { useSelector } from "@xstate/react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { RoundButton } from "components/ui/RoundButton";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  /** Which floor the player is currently viewing. */
  floor: "ground" | "level_one";
}

const _expansion = (state: MachineState) =>
  state.context.state.interior.expansion;
// Volcano and every ascension island (swamp, spooky, …) share the volcano
// interior, so they all get the upgraded multi-floor layout.
const _hasUpgradedInterior = (state: MachineState) =>
  hasRequiredIslandExpansion(state.context.state.island.type, "volcano");

/**
 * Stacked up/down floor-navigation buttons for the interior HUD.
 *
 * Sits above the back-to-farm TravelButton in the bottom-left HUD column.
 * Up = go to /level_one (shows a lock and is disabled when the player
 * hasn't bought their first upgrade). Down = go back to /interior. The
 * arrow pointing away from any reachable floor is rendered disabled rather
 * than hidden so the button layout stays stable across floors.
 */
export const InteriorFloorNav: React.FC<Props> = ({ floor }) => {
  const { gameService } = useContext(Context);
  const navigate = useNavigate();

  const expansion = useSelector(gameService, _expansion);
  const hasUpgradedInterior = useSelector(gameService, _hasUpgradedInterior);
  const levelOneUnlocked = !!expansion && hasUpgradedInterior;

  const onGround = floor === "ground";
  const onLevelOne = floor === "level_one";

  // On ground floor: up navigates to level_one (or shows lock if unlocked).
  // On level_one: up has nowhere higher to go.
  const upDisabled = onGround ? !levelOneUnlocked : true;
  // On level_one: down returns to ground. On ground: nowhere lower.
  const downDisabled = onLevelOne ? false : true;

  const goUp = () => {
    if (upDisabled) return;
    navigate("/level_one");
  };

  const goDown = () => {
    if (downDisabled) return;
    navigate("/interior");
  };

  return (
    <>
      <RoundButton
        onClick={upDisabled ? undefined : goUp}
        disabled={upDisabled}
        className={classNames({ "opacity-60": upDisabled })}
      >
        <img
          src={SUNNYSIDE.icons.arrow_up}
          className="absolute group-active:translate-y-[2px]"
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            left: `${PIXEL_SCALE * 5.5}px`,
            top: `${PIXEL_SCALE * 3}px`,
          }}
        />
        {onGround && !levelOneUnlocked && (
          <img
            src={SUNNYSIDE.icons.lock}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 8}px`,
              right: `${PIXEL_SCALE * -1}px`,
              bottom: `${PIXEL_SCALE * -1}px`,
            }}
          />
        )}
      </RoundButton>
      <RoundButton
        onClick={downDisabled ? undefined : goDown}
        disabled={downDisabled}
        className={classNames({ "opacity-60": downDisabled })}
      >
        <img
          src={SUNNYSIDE.icons.arrow_down}
          className="absolute group-active:translate-y-[2px]"
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            left: `${PIXEL_SCALE * 5.5}px`,
            top: `${PIXEL_SCALE * 4}px`,
          }}
        />
      </RoundButton>
    </>
  );
};
