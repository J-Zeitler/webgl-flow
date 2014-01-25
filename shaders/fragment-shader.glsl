precision mediump float;

uniform float time;
uniform sampler2D map;

varying vec4 pos;
varying vec4 pos3d;
varying vec3 vUv;

void main() {
	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}