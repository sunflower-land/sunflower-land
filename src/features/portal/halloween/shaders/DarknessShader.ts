import { MAX_LAMPS_IN_MAP } from "../HalloweenConstants";

const TOTAL_LIGHTS = MAX_LAMPS_IN_MAP + 1;

const fragShader = `
#define SHADER_NAME DARKNESS_SHADER

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 outTexCoord;
uniform sampler2D uMainSampler;
uniform vec2 screenResolution;
uniform vec2 lightSources[${TOTAL_LIGHTS}];
uniform float lightRadius[${TOTAL_LIGHTS}];

float getLuminance(vec3 color) {
  return dot(color, vec3(0.1, 0.1, 0.1));
}

vec3 overlay(vec3 color) {
  vec3 darker = 2.0 * color * color;
  vec3 lighter = 1.0 - (1.0 - 2.0 * (color - 0.5)) * (1.0 - color);
  vec3 grey = vec3(getLuminance(color));
  return mix(darker, lighter, grey);
}

vec3 lightEffect(vec3 color) {
  vec3 lightSourceTint = vec3(1.0, 1.0, 0.5);
  vec3 modifiedColor = color * lightSourceTint;
  return modifiedColor;
}

float edgeDistance() {
  vec2 normalizedCoords = gl_FragCoord.xy / screenResolution.xy;
  float distX = min(normalizedCoords.x, 1.0 - normalizedCoords.x); // Distancia horizontal al borde
  float distY = min(normalizedCoords.y, 1.0 - normalizedCoords.y); // Distancia vertical al borde
  float dist = min(distX, distY); // Distancia al borde más cercano
  return dist;
}

void main() {
  vec4 texColor = texture2D(uMainSampler, outTexCoord);

  vec3 nightColor = overlay(texColor.rgb);

  nightColor *= vec3(0.0, 0.0, 0.0);

  // calculate normalized coordinates of current fragment
  vec2 aspect = vec2(screenResolution.x/screenResolution.y, 1.0); // aspect scale vector
  vec2 normalizedCoords = gl_FragCoord.xy / screenResolution.xy * aspect;

  // get the total light
  float maxFalloff = 0.0;
  for (int i = 0; i < ${TOTAL_LIGHTS}; i++) {
    vec2 center = lightSources[i]; // center of the light source
    
    // skip light sources that are not initialized
    // assuming no one will be exactly at (0.0, 0.0)
    if (center == vec2(0.0, 0.0)) {
      break;
    }

    // calculate the distance from the center
    float dist = distance(normalizedCoords, center * aspect);
    
    // smoothstep function to create a smooth transition at the edges of the circle
    float falloff = smoothstep(lightRadius[i], lightRadius[i] * 0.05, dist);  // adding a small epsilon for smooth falloff
    maxFalloff = max(maxFalloff, falloff);
  }

  // apply the effect based on the falloff mask
  vec3 maskedEffect = lightEffect(nightColor);
  maskedEffect = mix(maskedEffect, texColor.rgb, 1.0); // mix in some original color

  // Calculates edge distance and mixing factor
  float dist = edgeDistance();
  float width = 0.05;
  float borderFactor = smoothstep(width * 0.0, width, dist);

  // Combines both edge factors using a mix
  float combinedFactor = min(maxFalloff, borderFactor);

  // combine with the original color to keep the rest untouched
  nightColor = mix(nightColor, maskedEffect, combinedFactor);

  // output the final color with original alpha
  gl_FragColor = vec4(nightColor, texColor.a);
}
`;

export class DarknessPipeline extends Phaser.Renderer.WebGL.Pipelines
  .PostFXPipeline {
  lightSources: { x: number; y: number }[] = [];
  lightRadius: number[] = [];

  constructor(game: Phaser.Game) {
    super({
      game,
      fragShader: fragShader,
    });
  }

  onPreRender(): void {
    this.set2f(
      "screenResolution",
      Number(this.game.config.width) ?? 1,
      Number(this.game.config.height) ?? 1,
    );
    this.set2fv(
      "lightSources",
      this.lightSources
        .slice(0, TOTAL_LIGHTS)
        .map((source) => [source.x, 1 - source.y])
        .flat(),
    );
    this.set1fv("lightRadius", this.lightRadius);
  }
}
