import { useEffect, useState } from "react";
import type { ScreenRect } from "./anchors";
import { useAnchorRegistry } from "../overlay/FarmOverlay";

/**
 * Live screen rect for a world anchor registered by the Phaser side.
 * Updates when the entity moves and when the camera pans or zooms; undefined
 * while no such anchor exists.
 */
export function useWorldAnchor(anchorId: string): ScreenRect | undefined {
  const registry = useAnchorRegistry();
  const [rect, setRect] = useState<ScreenRect | undefined>(() =>
    registry.getRect(anchorId),
  );

  useEffect(() => registry.subscribe(anchorId, setRect), [registry, anchorId]);

  return rect;
}
