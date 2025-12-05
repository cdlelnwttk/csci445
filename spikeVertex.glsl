varying vec3 our_uv;
varying vec2 noise_uv;

uniform float spikeHeight;
uniform float spikeFreq;
uniform float time;
uniform sampler2D noise;

void main() {
    our_uv = position;
    noise_uv = uv;
    vec2 noiseSampleUV = uv * spikeFreq + vec2(time * 0.1, time * 0.1); 
    float n = texture2D(noise, fract(noiseSampleUV)).r;
    float spike = cos((position.x + n * spikeFreq + time * n)) *
                  cos(position.y + n* spikeFreq + time * n) *
                  cos(position.z + n * spikeFreq + time * n) *
                  spikeHeight;

    float spike2 = sin(position.x * spikeFreq * 0.2 + time * 3.0) *
                   sin(position.y * spikeFreq * 0.4 + time * 5.0) *
                   spikeHeight * 0.1;
    spike += spike2;
    vec3 newPos = position + normalize(position) * spike;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}