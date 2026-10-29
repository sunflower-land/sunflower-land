import React, { useRef, useState } from "react";
import classNames from "classnames";

import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { BoostsDisplay } from "components/ui/layouts/BoostsDisplay";
import type { BoostName, GameState } from "features/game/types/game";

interface Props {
  icon: string;
  boosts: { name: BoostName; value: string }[];
  state: GameState;
  /** Open the boosts breakdown on click. Off where the label sits on a clickable card. */
  interactive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  labelClassName?: string;
}

/**
 * A bounty reward label. Shows a lightning icon when boosts apply; when
 * `interactive`, clicking it opens the boosts breakdown.
 */
export const BountyRewardLabel: React.FC<React.PropsWithChildren<Props>> = ({
  icon,
  boosts,
  state,
  interactive = false,
  className,
  style,
  labelClassName,
  children,
}) => {
  const [showBoosts, setShowBoosts] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const hasBoosts = boosts.length > 0;
  const canOpenBoosts = interactive && hasBoosts;

  return (
    <div
      ref={anchorRef}
      className={classNames(className, {
        "cursor-pointer": canOpenBoosts,
        // Completed bounty cards disable pointer events on the whole card;
        // keep the boosts breakdown reachable on their reward label.
        "pointer-events-auto": canOpenBoosts,
      })}
      style={style}
      role={canOpenBoosts ? "button" : undefined}
      tabIndex={canOpenBoosts ? 0 : undefined}
      aria-expanded={canOpenBoosts ? showBoosts : undefined}
      onClick={(e) => {
        if (!canOpenBoosts) return;
        e.stopPropagation();
        setShowBoosts((prev) => !prev);
      }}
      onKeyDown={(e) => {
        if (!canOpenBoosts || (e.key !== "Enter" && e.key !== " ")) return;
        e.preventDefault();
        e.stopPropagation();
        setShowBoosts((prev) => !prev);
      }}
    >
      <Label
        type="warning"
        icon={icon}
        secondaryIcon={hasBoosts ? SUNNYSIDE.icons.lightning : undefined}
        className={labelClassName}
      >
        {children}
      </Label>
      {canOpenBoosts && showBoosts && (
        <BoostsDisplay
          boosts={boosts}
          show={showBoosts}
          state={state}
          onClick={() => setShowBoosts(false)}
          anchorRef={anchorRef}
          portalAlign="right"
          portalPlacement="auto"
        />
      )}
    </div>
  );
};
