import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "@xstate/react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "components/ui/Modal";
import { WorldMap } from "./WorldMap";
import { RoundButton } from "components/ui/RoundButton";
import { SUNNYSIDE } from "assets/sunnyside";
import type { PlaceableLocation } from "features/game/types/collectibles";
import farmIcon from "assets/icons/farm.webp";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { getTutorialNudge } from "features/island/lib/tutorialNudge";

interface Props {
  location?: PlaceableLocation;
}

/**
 * Bottom-left HUD button.
 *
 * On the exterior farm (`location === "farm"` or undefined) this opens the
 * WorldMap modal so the player can travel between worlds.
 *
 * Inside any farm-interior surface (home, interior, barn, greenhouse, etc.)
 * the button instead shows a "back to farm" icon (assets/icons/farm.webp) and
 * navigates the player to the mainland on click. The Home/Barn/Greenhouse
 * pages also keep their bottom Exit button; the new /interior route relies on
 * this HUD button as its only way out.
 */
// One nudge at a time across the whole farm - see getTutorialNudge
const _needsFirstDelivery = (state: MachineState) =>
  getTutorialNudge(state.context.state) === "travel-first-delivery";

export const Travel: React.FC<Props> = ({ location }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const { gameService } = useContext(Context);
  const showDeliveryHelper = useSelector(gameService, _needsFirstDelivery);

  const onClose = () => {
    setShowModal(false);
  };

  const isInsideFarm = !!location && location !== "farm";

  if (isInsideFarm) {
    return (
      <RoundButton
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          navigate("/");
        }}
      >
        <img
          src={farmIcon}
          id="farm-icon"
          alt="Back to farm"
          style={{
            width: `${PIXEL_SCALE * 12}px`,
            left: `${PIXEL_SCALE * 5}px`,
            top: `${PIXEL_SCALE * 4}px`,
          }}
          className="absolute group-active:translate-y-[2px]"
        />
      </RoundButton>
    );
  }

  return (
    <>
      <RoundButton
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setShowModal(true);
        }}
      >
        <img
          src={SUNNYSIDE.icons.worldIcon}
          id="world-icon"
          style={{
            width: `${PIXEL_SCALE * 12}px`,
            left: `${PIXEL_SCALE * 5}px`,
            top: `${PIXEL_SCALE * 4}px`,
          }}
          className="absolute group-active:translate-y-[2px]"
        />
        {/* Tutorial: the first delivery is made at the Plaza. Hangs off the
            bottom-right so it never overlaps the Marketplace button above. */}
        {showDeliveryHelper && (
          <img
            className="absolute z-30 animate-pulsate pointer-events-none"
            src={SUNNYSIDE.icons.click_icon}
            style={{
              width: `${PIXEL_SCALE * 14}px`,
              right: `${PIXEL_SCALE * -6}px`,
              bottom: `${PIXEL_SCALE * -4}px`,
            }}
          />
        )}
      </RoundButton>
      <Modal show={showModal} dialogClassName="md:max-w-3xl" onHide={onClose}>
        <WorldMap onClose={onClose} />
      </Modal>
    </>
  );
};

export const TravelButton = React.memo(Travel);
