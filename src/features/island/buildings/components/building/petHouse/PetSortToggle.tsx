import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import type { PetSortOption } from "./sortActivePets";

type Props = {
  sort: PetSortOption;
  onChange: (sort: PetSortOption) => void;
};

const SORT_CYCLE: PetSortOption[] = ["default", "level", "energy"];

/**
 * Compact sort control for the pet list, used on both the Pets and Feed
 * tabs. A single click cycles default -> level -> energy -> default, instead
 * of three full-width buttons, to keep the interface minimal. Napping/
 * neglected pets always float to the top regardless of the chosen option —
 * see sortActivePets.ts.
 */
export const PetSortToggle: React.FC<Props> = ({ sort, onChange }) => {
  const { t } = useAppTranslation();

  const handleClick = () => {
    const nextIndex = (SORT_CYCLE.indexOf(sort) + 1) % SORT_CYCLE.length;
    onChange(SORT_CYCLE[nextIndex]);
  };

  const sortLabel =
    sort === "level"
      ? t("pets.sortLevel")
      : sort === "energy"
        ? t("pets.sortEnergy")
        : t("pets.sortDefault");

  return (
    <div
      className="flex flex-row items-center gap-1 cursor-pointer w-fit"
      onClick={handleClick}
    >
      <span className="text-xs underline">
        {t("pets.sortBy", { option: sortLabel })}
      </span>
      <img
        src={SUNNYSIDE.icons.chevron_down}
        style={{ width: `${PIXEL_SCALE * 5}px` }}
        alt=""
      />
    </div>
  );
};
