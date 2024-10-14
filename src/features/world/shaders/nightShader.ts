const MAX_LIGHT_SOURCES = 1;

const fragShader = `
#define SHADER_NAME NIGHT_SHADER

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 outTexCoord;
uniform sampler2D uMainSampler;
uniform vec2 screenResolution;
uniform vec2 lightSources[${MAX_LIGHT_SOURCES}];

float getLuminance(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

vec3 brightness(vec3 color, float amount) {
  return color + amount;
}

vec3 contrast(vec3 color, float amount) {
  return mix(vec3(0.5), color, amount);
}

vec3 exposure(vec3 color, float amount) {
  return color * amount;
}

vec3 overlay(vec3 color) {
  vec3 darker = 2.0 * color * color;
  vec3 lighter = 1.0 - (1.0 - 2.0 * (color - 0.5)) * (1.0 - color);
  vec3 grey = vec3(getLuminance(color));
  return mix(darker, lighter, grey);
}

vec3 popLights(vec3 color, float popStrength, float popThreshold) {
  vec3 grey = vec3(getLuminance(color));
  return color + popStrength * max(grey - popThreshold, 0.0);
}

vec3 saturation(vec3 color, float amount) {
  vec3 grey = vec3(getLuminance(color));
  return mix(color, grey, 1.0 - amount);
}

vec3 lightEffect(vec3 color) {
  vec3 lightSourceTint = vec3(1.0, 1.0, 0.5);
  vec3 modifiedColor = color * lightSourceTint;
  modifiedColor = saturation(modifiedColor, 1.25);
  modifiedColor = exposure(modifiedColor, 1.7);
  return modifiedColor;
}

void main() {
  vec4 texColor = texture2D(uMainSampler, outTexCoord);
  
  // set to 0.5 for debugging
  bool isRightHalf = outTexCoord.x >= 0.0;

  // Apply darkening and moonlight tint effect only to the right half
  if (isRightHalf) {
    // basic corrections
    vec3 nightColor = overlay(texColor.rgb);
    nightColor = saturation(nightColor, 0.45);
    nightColor = contrast(nightColor, 0.9);
    nightColor = popLights(nightColor, 0.3, 0.8);
    nightColor = brightness(nightColor, -0.05);
    nightColor = exposure(nightColor, 1.5);

    // apply a bluish tint for moonlight effect
    vec3 moonlightTint = vec3(0.3, 0.3, 0.65);
    nightColor *= moonlightTint;

    // calculate normalized coordinates of current fragment
    vec2 aspect = vec2(screenResolution.x/screenResolution.y, 1.0); // aspect scale vector
    vec2 normalizedCoords = gl_FragCoord.xy / screenResolution.xy * aspect;

    // set the radius to a fixed percentage of the screen size up to a certain maximum
    float radius = min(min(screenResolution.x, screenResolution.y) * 0.5, 500.0) / min(screenResolution.x, screenResolution.y);

    // get the total light
    float maxFalloff = 0.0;
    for (int i = 0; i < ${MAX_LIGHT_SOURCES}; i++) {
      vec2 center = lightSources[i]; // center of the light source
      
      // skip light sources that are not initialized
      // assuming no one will be exactly at (0.0, 0.0)
      if (center == vec2(0.0, 0.0)) {
        break;
      }
      
      // calculate the distance from the center
      float dist = distance(normalizedCoords, center * aspect);

      // smoothstep function to create a smooth transition at the edges of the circle
      float falloff = smoothstep(radius, radius * 0.05, dist);  // adding a small epsilon for smooth falloff
      maxFalloff = max(maxFalloff, falloff);
    }

    // apply the effect based on the falloff mask
    vec3 maskedEffect = lightEffect(nightColor);
    maskedEffect = mix(maskedEffect, texColor.rgb, 0.15); // mix in some original color

    // combine with the original color to keep the rest untouched
    nightColor = mix(nightColor, maskedEffect, maxFalloff);

    // output the final color with original alpha
    gl_FragColor = vec4(nightColor, texColor.a);
  } else {
    // output the original color for the left half
    gl_FragColor = texColor;
  }
}
`;

export class NightShaderPipeline extends Phaser.Renderer.WebGL.Pipelines
  .PostFXPipeline {
  lightSources: { x: number; y: number }[] = [];

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
        .slice(0, MAX_LIGHT_SOURCES)
        .map((source) => [source.x, 1 - source.y])
        .flat(),
    );
  }
}
