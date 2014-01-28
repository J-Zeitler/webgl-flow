precision mediump float;

uniform float time;
uniform sampler2D colorMap;
uniform sampler2D stateMap;

varying vec4 pos;


vec2 pressure(vec2 coord) {

	// just check x component 0 or 1 for now
	float cR = texture2D(colorMap, vec2(coord.x+0.01, coord.y)).x;
	float cL = texture2D(colorMap, vec2(coord.x-0.01, coord.y)).x;
	float cU = texture2D(colorMap, vec2(coord.x, coord.y+0.01)).x;
	float cD = texture2D(colorMap, vec2(coord.x, coord.y-0.01)).x;

	vec2 eX = vec2(1.0, 0.0);
	vec2 eY = vec2(0.0, 1.0);

	vec2 p = cR * eX - cL * eX + cU * eY - cD * eY;

	return -p;
}

vec4 advec(vec2 coord, float dt) {

	vec4 coordState = 2.0 * texture2D(stateMap, coord) - 1.0;

	// RK2
	vec2 midVelocity = 2.0 * texture2D(stateMap, coord - 0.5 * dt * coordState.xy).xy - 1.0;
	vec4 advectState = 2.0 * texture2D(stateMap, coord - dt * midVelocity) - 1.0 ;

	advectState.xy += 0.5 * pressure(coord);
	advectState.xy = 0.5 * advectState.xy + 0.5;
	advectState.z = 0.0;
	advectState.w = 1.0;

	return advectState;
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