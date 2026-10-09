import React, { useRef, useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import lightning from "assets/icons/lightning.png";
import { Label, LABEL_STYLES } from "components/ui/Label";
import { SquareIcon } from "components/ui/SquareIcon";
import { BoostsDisplay } from "components/ui/layouts/BoostsDisplay";
import type { GameState } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { getDailyFishingLimit } from "features/game/types/fishing";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

type Props = {
  state: GameState;
  reelsLeft: number;
  now: number;
};

export const ReelsRemainingBadge: React.FC<Props> = ({
  state,
  reelsLeft,
  now,
}) => {
  const { t } = useAppTranslation();
  const [showBoosts, setShowBoosts] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const extraReels = state.fishing.extraReels?.count ?? 0;
  const boosts: React.ComponentProps<typeof BoostsDisplay>["boosts"] = [
    ...getDailyFishingLimit(state, now).boostsUsed,
  ];

  if (extraReels > 0) {
    boosts.push({
      name: "Gem",
      value: `+${extraReels}`,
      label: t("fishing.extraReelsPurchased"),
      icon: ITEM_DETAILS.Gem.image,
    });
  }

  const reelsText =
    reelsLeft === 1
      ? t("fishing.oneReelLeft")
      : t("fishing.reelsLeft", { reelsLeft });
  const labelType = reelsLeft <= 0 ? "danger" : "default";

  if (!boosts.length) {
    return (
      <Label icon={SUNNYSIDE.tools.fishing_rod} type={labelType}>
        {reelsText}
      </Label>
    );
  }

  const labelStyle = LABEL_STYLES[labelType];

  return (
    <div className="group relative shrink-0">
      <button
        ref={anchorRef}
        type="button"
        className="relative flex w-fit items-center justify-center text-xs cursor-pointer"
        style={{
          ...labelStyle.borderStyle,
          background: labelStyle.background,
          color: labelStyle.textColour,
          paddingLeft: "14px",
          paddingRight: "14px",
        }}
        aria-label={`${reelsText}. ${t("faction.boostsApplied")}`}
        aria-expanded={showBoosts}
        onClick={() => setShowBoosts((show) => !show)}
      >
        <SquareIcon
          icon={SUNNYSIDE.tools.fishing_rod}
          width={9}
          className="absolute top-1/2 -translate-y-1/2"
          style={{ height: "24px", left: "-12px" }}
        />
        <span>{reelsText}</span>
        <SquareIcon
          icon={lightning}
          width={9}
          className="absolute top-1/2 -translate-y-1/2"
          style={{ height: "24px", right: "-12px" }}
        />
      </button>
      {!showBoosts && (
        <Label
          type="default"
          className="absolute right-0 bottom-full mb-1 hidden whitespace-nowrap pointer-events-none group-hover:flex"
        >
          {t("faction.boostsApplied")}
        </Label>
      )}
      <BoostsDisplay
        boosts={boosts}
        show={showBoosts}
        state={state}
        onClick={() => setShowBoosts(false)}
        anchorRef={anchorRef}
      />
    </div>
  );
};
