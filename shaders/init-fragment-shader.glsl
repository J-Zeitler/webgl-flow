precision mediump float;

varying vec3 vUv;

void main() {

	vec2 noiseSeedL = vec2(vUv.x, vUv.y);
	float noise = 0.50 * snoise(noiseSeedL);

	vec2 noiseSeedM = vec2(vUv.x * 4.0, vUv.y * 4.0);
	noise += 0.25 * snoise(noiseSeedM);

	vec2 noiseSeedS = vec2(vUv.x * 8.0, vUv.y * 8.0);
	noise += 0.125 * snoise(noiseSeedS);

	gl_FragColor = vec4(noise, noise, noise, 1.0);
}