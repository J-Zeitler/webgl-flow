precision mediump float;

uniform float time;
uniform sampler2D map;

varying vec4 pos;

void main() {

	vec2 pos2d = pos.xy;

    float a = 0.01;
    mat2 rot = mat2(
    	cos(a), -sin(a),
    	sin(a), cos(a)
	);

    pos2d = rot * pos2d;

	vec2 texCoord = vec2(
        0.5 * pos2d.x + 0.5,
        0.5 * pos2d.y + 0.5
    );

	vec4 colorSample = texture2D(map, texCoord);

	gl_FragColor = vec4(colorSample.xy, 0.0, 1.0);
}