precision mediump float;

uniform float time;
uniform sampler2D colorMap;
uniform sampler2D stateMap;

varying vec4 pos;

/**
 * Tex to value
 */
vec4 texToValue(vec4 tex) {
  return 2.0 * tex - 1.0;
}


/**
 * Value to hex
 */
vec4 valueToTex(vec4 value) {
  return value*0.5 + 0.5;
}

/**
 * Advect color
 */
vec4 advec(vec2 coord, float dt) {

  vec4 coordState = texToValue(texture2D(stateMap, coord));

  // RK2
  vec2 midVelocity = texToValue(texture2D(stateMap, coord - 0.5 * dt * coordState.xy)).xy;
  vec4 advectColor = texture2D(colorMap, coord - dt * midVelocity);

  return advectColor;
}

/**
 * Main
 */
void main() {

  const float dt = 0.005;

  vec2 pos2d = pos.xy;
  vec2 texCoord = pos2d * 0.5 + 0.5;

  gl_FragColor = advec(texCoord, dt);
}
