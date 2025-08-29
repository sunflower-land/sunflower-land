import React, { useContext } from "react";

import { ITEM_DETAILS } from "features/game/types/images";
import { getExperienceToNextLevel, PetName } from "features/game/types/pets";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import {
  SFTDetailPopoverInnerPanel,
  SFTDetailPopoverLabel,
} from "components/ui/SFTDetailPopover";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";

const PETS_STYLES: Record<
  PetName,
  {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    width?: number;
    height?: number;
  }
> = {
  // Dogs
  Barkley: { width: 20, bottom: 22, left: -2 },
  Biscuit: { width: 20, bottom: 22, left: -1.5 },
  Cloudy: { width: 20, bottom: 25, left: -2 },

  // Cats
  Meowchi: { width: 20, bottom: 23, left: -1.5 },
  Butters: { width: 20, bottom: 23, left: -1.5 },
  Smokey: { width: 20, bottom: 23, left: -1.5 },

  // Owls
  Twizzle: { width: 17, bottom: 19 },
  Flicker: { width: 17, bottom: 22 },
  Pippin: { width: 17, bottom: 22 },

  // Horses
  Burro: { width: 20, bottom: 23, left: -2 },
  Pinto: { width: 22, bottom: 24, left: -3.5 },
  Roan: { width: 19, bottom: 25, left: -1.5 },
  Stallion: { width: 21, bottom: 24, left: -2.5 },

  // Bulls
  Mudhorn: { width: 23, bottom: 26, left: -4.25 },
  Bison: { width: 22, bottom: 26, left: -3.25 },
  Oxen: { width: 23, bottom: 26, left: -4.25 },

  // Hamsters
  Nibbles: { width: 16, bottom: 20 },
  Peanuts: { width: 16, bottom: 20 },

  // Penguins
  Waddles: { width: 17, bottom: 20 },
  Pip: { width: 17, bottom: 20 },
  Skipper: { width: 21, bottom: 20, left: -3 },

  // Goat
  Ramsey: { width: 32, bottom: 36 },
};

const PET_PIXEL_STYLES = getObjectEntries(PETS_STYLES).reduce<
  Record<PetName, React.CSSProperties>
>(
  (acc, [pet, styles]) => {
    acc[pet] = {
      left: styles.left ? `${PIXEL_SCALE * styles.left}px` : undefined,
      right: styles.right ? `${PIXEL_SCALE * styles.right}px` : undefined,
      top: styles.top ? `${PIXEL_SCALE * styles.top}px` : undefined,
      bottom: styles.bottom ? `${PIXEL_SCALE * styles.bottom}px` : undefined,
      width: styles.width ? `${PIXEL_SCALE * styles.width}px` : undefined,
      height: styles.height ? `${PIXEL_SCALE * styles.height}px` : undefined,
    };
    return acc;
  },
  { ...PETS_STYLES },
);

export const Pet: React.FC<{ name: PetName }> = ({ name }) => {
  const { gameService } = useContext(Context);
  const petData = useSelector(
    gameService,
    (state) => state.context.state.pets.commonPets[name],
  );

  return (
    <>
      <Popover>
        <PopoverButton as="div" className="cursor-pointer">
          <div className="absolute" style={{ ...PET_PIXEL_STYLES[name] }}>
            <img
              src={ITEM_DETAILS[name].image}
              className="absolute w-full cursor-pointer hover:img-highlight"
              alt={name}
            />
          </div>
        </PopoverButton>
        <PopoverPanel
          anchor={{ to: "left start" }}
          className="flex pointer-events-none"
        >
          <SFTDetailPopoverInnerPanel>
            <SFTDetailPopoverLabel name={name} />
            {petData && (
              <Label
                type="info"
                icon={SUNNYSIDE.icons.lightning}
                className="ml-2 sm:ml-0"
              >
                {`Pet Level: ${getExperienceToNextLevel(petData.experience).level}`}
              </Label>
            )}
          </SFTDetailPopoverInnerPanel>
        </PopoverPanel>
      </Popover>
    </>
  );
};
