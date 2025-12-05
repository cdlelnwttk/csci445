varying vec3 our_uv;

uniform float spikeHeight;
uniform float spikeFreq;
uniform float time;

void main() {
    our_uv = position;
    float spike = (cos(position.x * spikeFreq * 4.0 + time * 20.0) * 
                  cos(position.y * spikeFreq * 4.0 + time * 20.0) * 
                  cos(position.z * spikeFreq * 4.0 + time * 10.0) * spikeHeight);

    vec3 newPos = position + normalize(position) * spike;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}
