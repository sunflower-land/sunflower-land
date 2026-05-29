import React, { useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { RoundButton } from "components/ui/RoundButton";
import { SUNNYSIDE } from "assets/sunnyside";
import { BedsMigrationModal } from "features/home/components/BedsMigrationModal";

import plusIcon from "assets/icons/plus.png";

/**
 * Bottom-most button in the right-side HUD column on the interior floors.
 * Opens the beds-migration modal (which shows which beds the player still
 * needs to craft to unlock more farm hands).
 *
 * Visual: player icon as the primary glyph, with a small "+" badge in the
 * top-right corner to signal the "add another farm hand" affordance.
 */
export const InteriorBedsButton: React.FC = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      <RoundButton onClick={() => setShow(true)}>
        <img
          src={SUNNYSIDE.icons.player}
          className="absolute group-active:translate-y-[2px]"
          style={{
            width: `${PIXEL_SCALE * 13}px`,
            left: `${PIXEL_SCALE * 4.5}px`,
            top: `${PIXEL_SCALE * 4.5}px`,
          }}
        />
        <img
          src={plusIcon}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 7}px`,
            right: `${PIXEL_SCALE * -1}px`,
            top: `${PIXEL_SCALE * -1}px`,
          }}
        />
      </RoundButton>

      <BedsMigrationModal show={show} onHide={() => setShow(false)} />
    </>
  );
};
