import React from "react";
import classNames from "classnames";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { LABEL_STYLES, Label, type LabelType } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import moonIcon from "assets/icons/moon_crystal.webp";
import fullMoonIcon from "assets/icons/full_moon.png";
import eventIcon from "assets/icons/calendar.webp";
import {
  CHAPTER_CROP_WEEK_SEED,
  RETIRED_CHAPTER_CROP_WEEK_SEEDS,
} from "features/game/types/chapterCropWeek";
import { isFullMoonBerry } from "features/game/events/landExpansion/seedBought";
import springIcon from "assets/icons/spring.webp";
import summerIcon from "assets/icons/summer.webp";
import autumnIcon from "assets/icons/autumn.webp";
import winterIcon from "assets/icons/winter.webp";
import {
  SEASONAL_SEEDS,
  SEEDS,
  type SeedName,
} from "features/game/types/seeds";
import {
  CROPS,
  GREENHOUSE_CROPS,
  getCropCategory,
  isOvernightCrop,
  type CropName,
  type GreenHouseCropName,
  type ProduceName,
} from "features/game/types/crops";
import {
  BASIC_CROP_MACHINE_SEEDS,
  CROP_EXTENSION_MOD_I_SEEDS,
  CROP_EXTENSION_MOD_II_SEEDS,
  CROP_EXTENSION_MOD_III_SEEDS,
} from "features/game/events/landExpansion/supplyCropMachine";
import type { CropSeedName } from "features/game/types/crops";
import type { GameState, TemperateSeasonName } from "features/game/types/game";
import { getKeys } from "lib/object";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { TranslationKeys } from "lib/i18n/dictionaries/types";

export type CropTag = {
  key: string;
  label: string;
  type: LabelType;
  icon?: string;
};

const SEASON_TAGS: Record<
  TemperateSeasonName,
  { type: LabelType; icon: string }
> = {
  spring: { type: "success", icon: springIcon },
  summer: { type: "warning", icon: summerIcon },
  autumn: { type: "vibrant", icon: autumnIcon },
  winter: { type: "default", icon: winterIcon },
};

/**
 * Whether this player can put the seed in their Crop Machine: they own one and
 * the seed is a basic machine seed or unlocked by the matching Crop Extension
 * Module skill - the same rule `supplyCropMachine` enforces.
 */
const canUseCropMachine = (game: GameState, seed: SeedName) => {
  const hasMachine =
    !!game.buildings["Crop Machine"]?.length ||
    !!game.inventory["Crop Machine"]?.gt(0);
  if (!hasMachine) return false;

  const cropSeed = seed as CropSeedName;
  const { skills } = game.bumpkin;

  return (
    BASIC_CROP_MACHINE_SEEDS.includes(cropSeed) ||
    (!!skills["Crop Extension Module I"] &&
      CROP_EXTENSION_MOD_I_SEEDS.includes(cropSeed)) ||
    (!!skills["Crop Extension Module II"] &&
      CROP_EXTENSION_MOD_II_SEEDS.includes(cropSeed)) ||
    (!!skills["Crop Extension Module III"] &&
      CROP_EXTENSION_MOD_III_SEEDS.includes(cropSeed))
  );
};

const isOvernightProduce = (produce?: ProduceName) =>
  !!produce &&
  (produce in CROPS || produce in GREENHOUSE_CROPS) &&
  isOvernightCrop(produce as CropName | GreenHouseCropName);

/**
 * Tags describing a seed's crop: its category, whether it is an Overnight Crop
 * (what Hoot boosts), whether this player's Crop Machine takes it, and the
 * seasons it can be planted in. Derived from the same data the game logic
 * uses, so they stay in step with it.
 */
export const getCropTags = (
  seed: SeedName,
  game: GameState,
  t: (key: TranslationKeys) => string,
  { seasons: withSeasons = true }: { seasons?: boolean } = {},
): CropTag[] => {
  const produce = SEEDS[seed]?.yield as ProduceName | undefined;
  const tags: CropTag[] = [];

  tags.push({
    key: "category",
    label: t(getCropCategory(produce as ProduceName)),
    type: "chill",
  });

  if (isOvernightProduce(produce)) {
    tags.push({
      key: "overnight",
      label: t("crops.overnightCrop"),
      type: "formula",
      icon: moonIcon,
    });
  }

  // Chapter Crop Week crops, current and past: only sold during the event.
  if (
    seed === CHAPTER_CROP_WEEK_SEED ||
    RETIRED_CHAPTER_CROP_WEEK_SEEDS.includes(seed)
  ) {
    tags.push({
      key: "event",
      label: t("chapterCropWeek.specialEventCrop"),
      type: "danger",
      icon: eventIcon,
    });
  }

  // Full Moon berries are sold only during a Full Moon, not by season.
  if (isFullMoonBerry(seed)) {
    tags.push({
      key: "fullMoon",
      label: t("calendar.events.fullMoon.title"),
      type: "vibrant",
      icon: fullMoonIcon,
    });
  }

  if (canUseCropMachine(game, seed)) {
    tags.push({
      key: "cropMachine",
      label: t("crops.tag.cropMachine"),
      type: "info",
      icon: SUNNYSIDE.building.cropMachine,
    });
  }

  if (withSeasons) {
    getKeys(SEASONAL_SEEDS)
      .filter((season) => SEASONAL_SEEDS[season].includes(seed))
      .forEach((season) =>
        tags.push({
          key: season,
          label: t(`season.${season}`),
          ...SEASON_TAGS[season],
        }),
      );
  }

  return tags;
};

/** A small square chip in the tag's label colour with just its icon. */
const IconTag: React.FC<{ tag: CropTag }> = ({ tag }) => (
  <div
    role="img"
    title={tag.label}
    aria-label={tag.label}
    className="flex items-center justify-center"
    style={{
      ...LABEL_STYLES[tag.type].borderStyle,
      background: LABEL_STYLES[tag.type].background,
      padding: "1px",
    }}
  >
    <img src={tag.icon} alt="" className="w-[18px] h-[18px] object-contain" />
  </div>
);

/**
 * The category reads as a label; the other tags are compact icon chips. Tapping
 * the chips opens a panel naming each one, so
 * the icons don't have to be learnt.
 */
export const CropTags: React.FC<{
  seed: SeedName;
  game: GameState;
  seasons?: boolean;
  /** Leave the category out where it is already shown (crop guide rows). */
  category?: boolean;
  /** Show Overnight Crop / Full Moon as chips too (tight crop guide rows). */
  iconsOnly?: boolean;
  className?: string;
}> = ({
  seed,
  game,
  seasons,
  category = true,
  iconsOnly = false,
  className,
}) => {
  const { t } = useAppTranslation();
  const tags = getCropTags(seed, game, t, { seasons }).filter(
    (tag) => category || tag.key !== "category",
  );
  // The category, Overnight Crop and Full Moon read as text labels; the rest
  // (Crop Machine, seasons) are chips.
  const isTextTag = (tag: CropTag) =>
    !tag.icon ||
    (!iconsOnly &&
      (tag.key === "overnight" ||
        tag.key === "fullMoon" ||
        tag.key === "event"));
  const textTags = tags.filter(isTextTag);
  const iconTags = tags.filter((tag) => !isTextTag(tag));

  return (
    <div className={classNames("flex flex-wrap items-center gap-1", className)}>
      {textTags.map((tag) => (
        <Label
          key={tag.key}
          type={tag.type}
          icon={tag.icon}
          className={tag.icon ? "ml-3" : undefined}
        >
          <span className="text-xxs">{tag.label}</span>
        </Label>
      ))}
      {iconTags.length > 0 && (
        <Popover className="relative">
          <PopoverButton
            className="flex flex-wrap items-center gap-1 cursor-pointer"
            aria-label={iconTags.map((tag) => tag.label).join(", ")}
          >
            {iconTags.map((tag) => (
              <IconTag key={tag.key} tag={tag} />
            ))}
          </PopoverButton>
          <PopoverPanel anchor="bottom" className="z-50 mt-1">
            <InnerPanel className="drop-shadow-lg">
              <div className="flex flex-col gap-1 p-1">
                {iconTags.map((tag) => (
                  <div key={tag.key} className="flex items-center gap-2">
                    <IconTag tag={tag} />
                    <span className="text-xs whitespace-nowrap">
                      {tag.label}
                    </span>
                  </div>
                ))}
              </div>
            </InnerPanel>
          </PopoverPanel>
        </Popover>
      )}
    </div>
  );
};
