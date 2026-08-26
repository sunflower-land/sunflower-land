import { SUNNYSIDE } from "assets/sunnyside";
import type { GameState } from "features/game/types/game";
import { queueImage } from "../../core/assets";
import {
  ResourceNodeRenderer,
  type NodeObjects,
  type NodeSlice,
  type RenderContext,
} from "./ResourceNodeRenderer";

/**
 * Boulders [island/boulder/Boulder.tsx]: static art + a teaser modal.
 */

type BoulderNode = { x?: number; y?: number };

export class BoulderRenderer extends ResourceNodeRenderer<BoulderNode> {
  protected readonly rendererKey = "boulder";
  protected readonly tileDims = { width: 2, height: 2 };
  protected readonly hoverKind = null;

  protected selectNodes(game: GameState) {
    return (game as { boulders?: Record<string, BoulderNode> }).boulders ?? {};
  }

  protected collectAssets(_slice: NodeSlice<BoulderNode>) {
    queueImage(this.scene, SUNNYSIDE.resource.boulder);
  }

  protected renderNode(
    _id: string,
    _node: BoulderNode,
    objects: NodeObjects,
    ctx: RenderContext,
  ) {
    this.setArt(objects, ctx, {
      texture: SUNNYSIDE.resource.boulder,
      width: 26,
      top: 1,
      left: 3,
    });
  }

  protected onNodeClick(_id: string) {
    this.bridge.farmModal.open("boulder");
  }
}
