import Phaser from "phaser";

/**
 * Hover affordance, attempt three (scale-up and a flat 1px outline were both
 * rejected): a shader glow that knows the difference between art and shadow.
 *
 * Farm sprites bake their drop shadows in as SEMI-TRANSPARENT pixels, so any
 * effect keyed off "alpha > 0" (Phaser's built-in Glow FX included) traces a
 * halo around the shadow blob. This pipeline thresholds alpha first — only
 * near-opaque pixels count as the body — then draws:
 *
 *  - a hairline white rim hugging the solid silhouette (HALF a source px —
 *    Adam's call: half the weight of the art's own 1px lines, rim only, no
 *    halo),
 *  - a slight brightness lift on the body itself.
 */

const FRAG = `
precision mediump float;

uniform sampler2D uMainSampler;
uniform vec2 uTexel;
uniform float uZoom;

varying vec2 outTexCoord;

// Alpha above this is "body"; baked shadows sit well below it.
const float SOLID = 0.8;

void main() {
  vec4 base = texture2D(uMainSampler, outTexCoord);
  float isSolid = step(SOLID, base.a);

  // A non-solid pixel is rim when a solid pixel sits within HALF a source
  // pixel: uTexel is one framebuffer texel, uZoom is framebuffer pixels per
  // source pixel.
  vec2 halfPx = uTexel * uZoom * 0.5;
  float near = 0.0;
  for (int dx = -1; dx <= 1; dx++) {
    for (int dy = -1; dy <= 1; dy++) {
      vec2 offset = vec2(float(dx), float(dy)) * halfPx;
      near = max(near, step(SOLID, texture2D(uMainSampler, outTexCoord + offset).a));
    }
  }
  float rim = (1.0 - isSolid) * near;

  // Body: gentle lift so the whole sprite reads "active".
  vec3 lifted = clamp(base.rgb * 1.18, 0.0, 1.0);

  vec3 color = mix(base.rgb, lifted, isSolid);
  float alpha = base.a;
  color = mix(color, vec3(1.0), rim);
  alpha = max(alpha, rim);

  gl_FragColor = vec4(color * alpha, alpha);
}
`;

export class HoverGlowPipeline extends Phaser.Renderer.WebGL.Pipelines
  .PostFXPipeline {
  /** Framebuffer pixels per source pixel — set when the effect is applied. */
  zoom = 1;

  constructor(game: Phaser.Game) {
    super({ game, fragShader: FRAG });
  }

  onPreRender() {
    this.set1f("uZoom", this.zoom);
    this.set2f("uTexel", 1 / this.renderer.width, 1 / this.renderer.height);
  }
}

export const HOVER_GLOW_KEY = "HoverGlow";

export type GlowTarget = Phaser.GameObjects.Image | Phaser.GameObjects.Sprite;

/** Register once per game; safe to call repeatedly. */
function ensureRegistered(scene: Phaser.Scene): boolean {
  const renderer = scene.game.renderer;
  if (!(renderer instanceof Phaser.Renderer.WebGL.WebGLRenderer)) return false;
  if (!renderer.pipelines.postPipelineClasses.has(HOVER_GLOW_KEY)) {
    renderer.pipelines.addPostPipeline(HOVER_GLOW_KEY, HoverGlowPipeline);
  }
  return true;
}

export function applyHoverGlow(scene: Phaser.Scene, target: GlowTarget) {
  if (!ensureRegistered(scene)) return;
  // Room for the rim to draw just outside the sprite's own quad.
  target.postFX?.setPadding(1);
  target.setPostPipeline(HOVER_GLOW_KEY);
  const pipeline = target.getPostPipeline(HOVER_GLOW_KEY);
  if (pipeline instanceof HoverGlowPipeline) {
    // Backing store is physical pixels; camera zoom already includes DPR.
    pipeline.zoom = scene.cameras.main.zoom;
  }
}

export function clearHoverGlow(target: GlowTarget) {
  if (!target.active) return;
  target.removePostPipeline(HOVER_GLOW_KEY);
}
