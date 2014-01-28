precision mediump float;

uniform float time;
uniform sampler2D colorMap;
uniform sampler2D stateMap;

varying vec4 pos;

vec4 advec(vec2 coord, float dt) {

	vec4 coordState = texture2D(stateMap, coord);

	// RK2
	vec2 midVelocity = texture2D(stateMap, coord - 0.5 * dt * coordState.xy).xy;
	vec4 advectColor = texture2D(colorMap, coord - dt * midVelocity);

	return advectColor;
}

void main() {

	const float dt = 0.01;

	vec2 pos2d = pos.xy;

	vec2 texCoord = vec2(
        0.5 * pos2d.x + 0.5,
        0.5 * pos2d.y + 0.5
    );

	gl_FragColor = advec(texCoord, dt);
}