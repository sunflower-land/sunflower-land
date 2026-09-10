import { InnerPanel } from "components/ui/Panel";
import { getBudImage } from "lib/buds/types";
import type { OverlapMenuRequest } from "../bridge/GameBridge";
import React, { useEffect, useState, useRef } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import type { GameBridge } from "../bridge/GameBridge";
import { useWorldAnchor } from "../bridge/useWorldAnchor";

/**
 * What's left of landscaping's React surface: the same-tile disambiguation
 * picker, which the architecture doc keeps as an anchored overlay because
 * it's a menu rather than world furniture.
 *
 * The selected-item controls (flip / pixel-perfect / remove discs and the
 * nudge arrows) moved to the game layer — landscaping/SelectionControls.ts.
 * They hang off the selection box and pan and zoom with it, so by the engine's
 * boundary rule they belong in Phaser, not in DOM elements chasing a
 * world-space anchor.
 */

/** [MovableComponent] same-tile disambiguation picker. */
const OverlapMenu: React.FC<{ bridge: GameBridge }> = ({ bridge }) => {
  const [request, setRequest] = useState<OverlapMenuRequest>(
    bridge.overlapMenu.get(),
  );
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => bridge.overlapMenu.subscribe(setRequest), [bridge]);
  useEffect(() => {
    if (!request) return;
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        bridge.overlapMenu.set(null);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [request, bridge]);
  const rect = useWorldAnchor(request?.anchorId ?? "landscaping-overlap");
  if (!request || !rect?.visible) return null;

  return (
    <div
      ref={ref}
      className="absolute pointer-events-auto z-20"
      style={{
        left: `${rect.left + rect.width}px`,
        top: `${rect.top - 12 * 2.625}px`,
        minWidth: `${60 * 2.625}px`,
      }}
    >
      <InnerPanel>
        {request.choices.map((choice) => {
          const image =
            choice.name === "Bud"
              ? getBudImage(Number(choice.id))
              : ((ITEM_DETAILS as Partial<Record<string, { image: string }>>)[
                  choice.name
                ]?.image ?? SUNNYSIDE.icons.expression_confused);
          return (
            <div
              key={`${choice.name}-${choice.id}`}
              className="flex items-center gap-2 p-1 cursor-pointer hover:bg-brown-200"
              onClick={() => {
                bridge.landscaping.send({
                  type: "MOVE",
                  name: choice.name as never,
                  id: choice.id,
                });
                bridge.overlapMenu.set(null);
              }}
            >
              <img src={image} style={{ maxWidth: 20, maxHeight: 20 }} />
              <span className="text-xs">{choice.name}</span>
            </div>
          );
        })}
      </InnerPanel>
    </div>
  );
};

export const LandscapingUI: React.FC<{ bridge: GameBridge }> = ({ bridge }) => (
  <OverlapMenu bridge={bridge} />
);
