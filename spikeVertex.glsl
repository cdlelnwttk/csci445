varying vec3 vPos;

uniform float spikeHeight;
uniform float spikeFreq;
uniform float time;
void main() {
    vPos = position;
    float spike = sin(position.x * spikeFreq+ time * 2.0) * 
                  cos(position.y * spikeFreq + time * 0.25) * 
                  cos(position.z * spikeFreq+ time * 10.0) * spikeHeight;

    vec3 newPos = position + normalize(position) * spike;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}
