precision mediump float;

uniform float time;
uniform sampler2D colorMap;
uniform sampler2D stateMap;

varying vec4 pos;


/**
 * PressureForce force
 */
vec2 pressureForce(vec2 coord) {

  // just check x component 0 or 1 for now
  float cR = texture2D(colorMap, vec2(coord.x+0.01, coord.y)).x;
  float cL = texture2D(colorMap, vec2(coord.x-0.01, coord.y)).x;
  float cU = texture2D(colorMap, vec2(coord.x, coord.y+0.01)).x;
  float cD = texture2D(colorMap, vec2(coord.x, coord.y-0.01)).x;

  vec2 p = vec2(cR - cL, cU - cD);

  return p;
}


/**
 * Tex to value
 */
vec4 texToValue(vec4 tex) {
  return 2.0 * tex - 1.0;
}


/**
 * Value to tex
 */
vec4 valueToTex(vec4 value) {
  return value*0.5 + 0.5;
}


/**
 * Advect velocities
 */
vec4 advec(vec2 coord, float dt) {

  vec4 coordState = texToValue(texture2D(stateMap, coord));

  // RK2
  vec2 midVelocity = texToValue(texture2D(stateMap, coord - 0.5 * dt * coordState.xy)).xy;
  vec4 advectState = texToValue(texture2D(stateMap, coord - dt * midVelocity));

  advectState.xy -= 0.5 * pressureForce(coord);
  advectState = valueToTex(advectState);

  return advectState;
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
